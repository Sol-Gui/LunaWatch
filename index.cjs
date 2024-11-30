const express = require('express');
const path = require('path');
const { fetch_price_jupiter } = require('./public/js/prices/jupiter.cjs')

const dados = require('./data.json');

const app = express();
const port = 80;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    res.render('home');
});

app.get('/login', (req, res)=>{
    res.render('login');
});

app.get('/r/:subreddit', (req, res)=>{

    let subreddit = req.params.subreddit;
    let dado = dados[subreddit];

    res.render('subreddit', {subreddit, ...dado});
});

app.get('/rand', (req, res)=>{
    let numero = Math.floor(Math.random()*10)+1;
    res.render('rand', {numero});
});

app.post('/cadastro', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    res.send({email, password});
    res.redirect('/')
});


app.get('/solana/:ca', async (req, res)=>{

    let ca = req.params.ca;

    try {
        const result = await fetch_price_jupiter(ca);

        res.render('token_pages/token_page_sol', { token: result });
    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).send('Error fetching price');
    }
});

app.get('/tradingview', (req, res) => {
    res.render('tradingview');
})

app.get('*', (req, res)=>{
    res.render('notfound');
});


// app.use((req, res)=>{
//     res.sendFile(path.join(__dirname, '/home.html'));
// });

app.listen(port, ()=>{
    console.log(`Ouvindo na porta ${port}!`);
});