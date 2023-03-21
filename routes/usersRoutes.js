const { Router } = require("express");
const { pool } = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const path = require("path");
const router = Router();
const passport = require("passport");
const multer = require("multer");

//MULTER
// Definir el almacenamiento para los archivos cargados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(
      null, 
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    ); // crear un nombre único para el archivo
  },
});
// Configurar multer
const upload = multer({ storage: storage });

// Middleware para verificar si el usuario está autenticado
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

router.get("/", (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/', function(req, res) {
  res.render('index', { user: req.user, message: 'You have logged out successfully' });
});

router.get("/users/login", (req, res) => res.render("login",{user: req.user}));

router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}), (req, res) => {
  req.session.userId = req.user.id;
  res.redirect('/users/dashboard');
});

router.get('/users/register', (req, res) => {
  res.render('register', { user: req.user });
});

router.get("/users/dashboard", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    const result = await pool.query(query);
    const user = result.rows[0];
    const autos = await pool.query('SELECT * FROM autos WHERE id_propietario = $1', [userId]);
    res.render('dashboard', { user: user.name, userId: user.id, autos: autos.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

router.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.render("index", { user: req.user, message: "You have logged out successfully" });
  });
});

router.get('/users/:id/image', async (req, res) => {
  const id = req.params.id;
  const query = `SELECT photo FROM users WHERE id = ${id}`;
  try {
    const result = await pool.query(query);
    const user = result.rows[0];
    const imagePath = path.join(__dirname, '..', 'public', 'img', user.photo);
    res.sendFile(imagePath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

router.get('/autos/:id/image', async (req, res) => {
  const id = req.params.id;
  const query = `SELECT foto FROM autos WHERE id = ${id}`;
  try {
    const result = await pool.query(query);
    const auto = result.rows[0];
    const imagePath = path.join(__dirname, '..', 'public', 'img', auto.foto);
    res.sendFile(imagePath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// Resto del código ...

module.exports = router;
