const express = require('express');
const app = express()
const session = require('express-session')
const flash = require("express-flash");
const passport = require('passport');
const PORT = process.env.PORT || 4000;
const initizalizePassport = require("./config/passportConfig");
const userRoutes = require('./routes/usersRoutes');
const autoRoutes = require('./routes/autosRoutes');
const cors = require('cors');

//initializations
app.set('views', __dirname + '/views');
app.use(express.static('public'));
// Configurar el tipo MIME para los archivos CSS
app.use('/css', express.static('public/css', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

initizalizePassport(passport);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  saveUntialized: false,
  resave: false,
  cookie: {
    sameSite: 'lax' // 
  }
}));

//Session
app.use(session({
  secret: 'your secret key', // This should be a secret string used to sign the session ID cookie
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // The session will expire after 24 hours of inactivity
  }
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

//Routes
app.use('/', userRoutes);
app.use('/autos', autoRoutes);

//Server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});