const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { fetch_price_jupiter } = require('./public/js/prices/jupiter.js');
const { connectToDatabase, createUser  } = require('./public/js/database.js');

const app = express();
const port = 80;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

connectToDatabase();


app.get('/', (req, res)=>{
    res.render('home');
});


app.get('/login/sign-up', (req, res)=>{
    res.render('login', {method: 1});
});


app.get('/login/sign-in', (req, res)=>{
    res.render('login', {method: 2});
});


app.get('/login', (req, res)=>{
    res.render('login', {method: 1});
});


app.post('/login/sign-in', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    res.send({email, password});
});


app.post('/login/sign-up', async (req, res)=>{
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'Email e senha são obrigatórios' });
        } else if (password.length < 6) {
            return res.status(400).send({ error: 'Senha muito curta!'});
        } else if (!validator.isEmail(email)) {
            return res.status(400).send({ error: 'Email invalido!'});
        }

        const userId = await createUser(email, password);

        res.status(201).send({
            success: true,
            message: 'Usuário registrado com sucesso!',
            userId,
        });
    } catch (err) {
        res.status(500).send({
            error: 'Ocorreu um erro ao processar sua solicitação.',
        });
    }
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


app.get('/solana', (req, res) => {
    res.render('blockchains/solana');
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