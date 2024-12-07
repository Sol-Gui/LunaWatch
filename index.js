const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./public/js/database/database.js');
const { Login, Solana } = require('./controllers/index.js');


const app = express();
const port = 3000;

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


app.get('/login/sign-up', (req, res)=>{
    res.render('login', {method: 1});
});


app.get('/login/sign-in', (req, res)=>{
    res.render('login', {method: 2});
});


app.get('/login', (req, res)=>{
    res.render('login', {method: 1});
});


app.post('/login/sign-in', Login.loginUser)

app.post('/login/sign-up', Login.registerUser);

app.get('/protected', (req, res) => {
    res.send({ message: "Acesso permitido!" });
});

app.get('/solana/:ca', Solana.pricePage);


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