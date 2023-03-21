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

router.get("/users/dashboard", async (req, res) => {
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  
  try {
    const userId = req.user.id;
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    const result = await pool.query(query);
    const user = result.rows[0];
    const autos = await pool.query('SELECT * FROM autos WHERE id = $1', [userId]);
    res.render('dashboard', { user: user.name, userId: user.id, autos: autos.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});




module.exports = router;

router.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.render("index", { user: req.user, message: "You have logged out successfully" });
  });
});

router.post("/users/register", upload.single("photo"), async (req, res) => {
  // manejar la imagen cargada
  const photo = req.file;

  let { name, email, password, password2, years, specialization } = req.body;

  console.log({
    name,
    email,
    password,
    password2,
    years,
    specialization,
    photo,
  });

  let errors = [];

  if (
    !name ||
    !email ||
    !password ||
    !password2 ||
    !years ||
    !specialization ||
    !photo
  ) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Passwords should be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    //form validation has passed

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users
            WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }

        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          res.render("register", { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password, years, specialization, photo)
                  VALUES ($1, $2, $3, $4, $5, $6)
                  RETURNING id, password`,
            [
              name,
              email,
              hashedPassword,
              years,
              specialization,
              photo.filename,
            ],
            (err, results) => {
              if (err) {
                throw err;
              }
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

router.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);
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


router.get('/users/:id/image', async (req, res) => {
  const id = req.params.id;
  const query = `SELECT photo FROM users WHERE id = ${id}`;
  try {
    const result = await pool.query(query);
    const user = result.rows[0];
    const imagePath = path.join(__dirname, '..', 'public', 'img', user.photo);
    res.attachment(imagePath);
    res.sendFile(imagePath);
  } catch (err) {
    console.error(err);
    res.status(404).send('Image not found');
  }
});



module.exports = router;

