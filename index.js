const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToDatabase, QueryDatabase } = require('./public/js/database/database.js');
const { Login, Solana, User } = require('./controllers/index.js');
const router = express.Router();


const app = express();
const port = 80;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());

app.use(Login.checkToken);

connectToDatabase();


app.get('/', (req, res)=>{
    res.render('home');
});


app.get('/login/sign-up', (req, res)=> {
    res.render('login', {method: 1});
});


app.get('/login/sign-in', (req, res)=> {
    res.render('login', {method: 2});
});


app.get('/login', (req, res)=> {
    res.render('login', {method: 1});
});


app.post('/login/sign-in', Login.loginUser)


app.post('/login/sign-up', Login.registerUser);


app.post('/logout', Login.logOut);


app.get(['/solana/:pg', '/solana'], Solana.tokensPage)


app.get('/profile', User.requireValidToken, User.profilePage);


app.put('/profile/edit-coin/:id/:quantity', User.requireValidToken, User.editCoin)


app.delete('/profile/remove-coin/:id', User.requireValidToken, User.removeCoin)

/*

IGNORAR ESTA PÁGINA CASO NÃO DE TEMPO DE FINALIZAR

app.get('/solana/token/:ca', Solana.pricePage);
*/


app.get('/register-crypto', User.requireValidToken, async (req, res) => {
    res.render('registerCrypto');
})

/*
app.post('/register-crypto', (req, res) => {
    res.render('registerCrypto');
})
*/


app.get('/tradingview', (req, res) => {
    res.render('tradingview');
})


app.get('/general', (req, res) => {
    res.render('blockchains/general');
})


app.get('*', (req, res)=>{
    res.render('notfound');
});


app.listen(port, ()=>{
    console.log(`Ouvindo na porta ${port}!`);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let n = 0
async function processLoop() {
    try {
        const timestamp = Date.now() - (3 * 60 * 60 * 1000);
        const now = new Date();

        if (![15,30,45,0].includes(now.getMinutes())) {n = 0}

        if ([5,10,15,20,25,30,35,40,45,50,55,0].includes(now.getMinutes())) {
            const len = await QueryDatabase("SELECT ca AS contract_address, decimals, id FROM crypto_sol");

            for (const el of len[0]) {
                const priceToken = await Solana.fetch_price_jupiter(el.contract_address, el.decimals, 1200);
                await QueryDatabase("UPDATE crypto_sol SET last_price = ? WHERE id = ?", [priceToken, el.id])

                const isOpen = await QueryDatabase("SELECT H_open FROM crypto_sol WHERE ca = ?", [el.contract_address]);
                if (!isOpen[0][0]?.H_open || isOpen[0][0]?.H_open == 0) {
                    await QueryDatabase("UPDATE crypto_sol SET H_open = ? WHERE ca = ?", [priceToken, el.contract_address]);
                }

                const high = await QueryDatabase("SELECT H_high FROM crypto_sol WHERE ca = ?", [el.contract_address]);
                const low = await QueryDatabase("SELECT H_low FROM crypto_sol WHERE ca = ?", [el.contract_address]);

                if (priceToken > high[0][0]?.H_high) {
                    await QueryDatabase("UPDATE crypto_sol SET H_high = ? WHERE ca = ?", [priceToken, el.contract_address]);
                }

                if (priceToken < low[0][0]?.H_low) {
                    await QueryDatabase("UPDATE crypto_sol SET H_low = ? WHERE ca = ?", [priceToken, el.contract_address]);
                }

                await QueryDatabase("UPDATE crypto_sol SET H_close = ? WHERE ca = ?", [priceToken, el.contract_address]);
                await sleep(1200);
            }
        }

        if ([15,30,45,0].includes(now.getMinutes())) {
            n = 1
            if (n == 1) {
                const id = await QueryDatabase("SELECT id FROM users");
                for (const id_u of id[0]) {
                    let open = 0;
                    let high = 0;
                    let low = 0;
                    let close = 0;

                    const len = await QueryDatabase(`
                        SELECT p.quantity AS quantity_owned, cs.ca AS contract_address, 
                        cs.decimals AS decimals FROM portfolio p JOIN crypto_sol cs 
                        ON  p.crypto_id = cs.id 
                        WHERE p.user_id = ?; `, id_u.id);
                    
                    for (const el of len[0]) {
                        const chartData = await QueryDatabase("SELECT H_open, H_high, H_low, H_close FROM crypto_sol WHERE ca = ?", [el.contract_address]);

                        open += parseFloat((chartData[0][0]?.H_open * el.quantity_owned).toFixed(5))
                        high += parseFloat((chartData[0][0]?.H_high * el.quantity_owned).toFixed(5))
                        low += parseFloat((chartData[0][0]?.H_low * el.quantity_owned).toFixed(5))
                        close += parseFloat((chartData[0][0]?.H_close * el.quantity_owned).toFixed(5))
                        const isOpen = await QueryDatabase("SELECT H_open FROM crypto_sol WHERE ca = ?", [el.contract_address]);
                        if (isOpen[0][0]?.H_open) {
                            await QueryDatabase("UPDATE crypto_sol SET H_open = ? WHERE ca = ?", [0, el.contract_address]);
                        }
                    }

                    await QueryDatabase(`INSERT INTO portfolio_chart 
                        (user_id, timestamp, open, high, low, close) 
                        VALUES (?, ?, ?, ?, ?, ?)`, [id_u.id, timestamp, open, high, low, close]);
                }
            }
        }
    } catch (err) {
        console.error(err);
        throw err;
    }

    setTimeout(processLoop, 45000);
}

processLoop();