const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { createDatabase, createTables, connectToDatabase, QueryDatabase} = require('./public/js/database/database.js');
const { Login, Solana, User, Update } = require('./controllers/index.js');


(async () => {
    try {
      await createDatabase();
    } catch (error) {
      console.error('Creating Database error:', error.message);
    }
    try {
        await createTables();
    } catch (error) {
        console.error('Creating Tables error:', error.message);
    }
    try {
        await connectToDatabase();
    } catch (error) {
        console.error('Connecting Database error:', error.message);
    }
})();


const app = express();
const port = 80;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(Login.checkToken);


app.use((err, req, res, next) => {
    console.error('Erro capturado:', err.message);
    res.status(500).json({ message: 'Ocorreu um erro no servidor!' });
});

process.on('uncaughtException', (err) => {
    console.error('Exceção não capturada:', err.message);
});
  
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição não tratada:', reason);
});  


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


app.put('/profile/edit-coin', User.requireValidToken, User.editCoin)


app.delete('/profile/remove-coin/:id', User.requireValidToken, User.removeCoin)


app.post('/profile/add-coin', User.requireValidToken, User.addCoin)


app.put('/profile/edit-password', User.requireValidToken, User.editPassword)


app.delete('/profile/delete-account', User.requireValidToken, User.deleteAccount)


app.put('/profile/change-username', User.requireValidToken, User.changeUsername)


app.get('/solana/token/:ca', Solana.pricePage);


app.get('/register-crypto', User.requireValidToken, async (req, res) => {
    res.render('registerCrypto');
})


app.post('/register-crypto/manual', User.requireValidToken, Solana.addNewCoinManual)


app.post('/register-crypto/automatic', User.requireValidToken, Solana.addNewCoinAutomatic)


app.get('/general', (req, res) => {
    res.render('blockchains/general');
})


app.get('*', (req, res)=>{
    res.render('notfound');
});


app.listen(port, ()=>{
    console.log(`Ouvindo na porta ${port}!`);
});

Update.processLoop();