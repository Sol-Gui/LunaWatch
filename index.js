const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./public/js/database/database.js');
const { Login, Solana, User } = require('./controllers/index.js');


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


app.get('/logout', Login.logOut);


app.get(['/solana/:pg', '/solana'], Solana.tokensPage)


app.get('/profile', User.requireValidToken, User.profilePage);


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