const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth')

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/auth/failure',
    })
);

app.get('/auth/failure', (req, res) =>
    res.send('Something went wrong')
)

app.get('/profile', isLoggedIn, (req, res) => {
    res.render('perfil', { name: req.user.displayName, picture: req.user.picture, email: req.user.email, 
    genero: req.user.gender, idioma: req.user.language, cumple: req.user.relationship})

    //res.send(`Hello ${req.user.displayName} ${res.user.picture}`)

})


app.get('/protected', isLoggedIn, (req, res) => {

    res.render('protegida')
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/')
    })
});

app.listen(process.env.PORT || 5000, () => console.log('Escuchando en el puerto 5000'))
