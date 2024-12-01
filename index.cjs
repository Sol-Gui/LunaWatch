const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { fetch_price_jupiter } = require('./public/js/prices/jupiter.cjs');

const dados = require('./data.json');

const app = express();
const port = 80;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

dotenv.config();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function connectToDatabase() {
    try {
        await db.connect();
        console.log("Database conectada com sucesso!");
    } catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    }
}

connectToDatabase();

async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    const [result] = await db.query(sql, [email, hashedPassword]);

    console.log({
        email: email,
        password: hashedPassword
    })

    return result.insertId;
}


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

app.get('/r/:subreddit', (req, res)=>{

    let subreddit = req.params.subreddit;
    let dado = dados[subreddit];

    res.render('subreddit', {subreddit, ...dado});
});

app.get('/rand', (req, res)=>{
    let numero = Math.floor(Math.random()*10)+1;
    res.render('rand', {numero});
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

// app.use((req, res)=>{
//     res.sendFile(path.join(__dirname, '/home.html'));
// });

app.listen(port, ()=>{
    console.log(`Ouvindo na porta ${port}!`);
});