const validator = require('validator');
const { createUser, findInDatabase } = require('../public/js/database/database.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie = require('cookie');

async function registerUser(req, res) {
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
        console.log(err);
        res.status(500).send({
            error: 'Ocorreu um erro ao processar sua solicitação.',
        });
    }
}

function checkToken(req, res, next) {
    const token = req.cookies.jwtToken;

    if (!token) {
        res.locals.isAuthenticated = false;
        next();
        return;
    }

    try {
        const secret = process.env.SECRET;
        
        jwt.verify(token, secret);

        res.locals.isAuthenticated = true

        next();
    } catch (err) {
        res.locals.isAuthenticated = false;
        next();
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const findId = await findInDatabase('id', 'users', 'email', email)

        if (!findId[0][0]) {
            return res.status(400).send({ error: 'Email não cadastrado!' });
        } else {
            const id = findId[0][0].id
            const pass = await findInDatabase('password', 'users', 'id', id);
            bcrypt.compare(password, pass[0][0].password, function(err, result) {
                if (err){
                  throw err;
                }
                if (result) {
                    const secureCookie = true;
                    const httpOnlyCookie = true;
                    const cookieOptions = {
                        secure: secureCookie,
                        maxAge: 86400 * 7, // 86400 * 7 = 7 dias
                        path: '/',
                        httpOnly: httpOnlyCookie,
                    };
            
                    const token = jwt.sign({id: id}, process.env.SECRET)
                    const cookieString = cookie.serialize('jwtToken', token, cookieOptions);
            
                    res.setHeader('Set-Cookie', cookieString);
            
            
                    res.status(201).send({
                        success: true,
                        message: 'Usuário logado com sucesso!',
                    });
                } else {
                  return res.status(401).send({ error: 'Senha Incorreta!' });
                }
              });
              
        }

    } catch (err) {
        throw err
    }
}


module.exports = { registerUser, loginUser, checkToken }