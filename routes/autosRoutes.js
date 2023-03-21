const express = require('express');
const router = express.Router();
const { pool } = require("../config/dbConfig");
const multer  = require('multer');
const initializePassport = require('../config/passportConfig');
const passport = require('passport');
initializePassport(passport);



// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

// Ruta que requiere autenticación
router.get('/users/dashboard', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT * FROM autos WHERE id = $1';
  const values = [userId];
  const result = await pool.query(query, values);
  const auto = result.rows[0];

  try {
    const autoResult = await pool.query(
      'SELECT id, foto, marca, modelo, anio FROM autos WHERE id_propietario = $1 ORDER BY id ASC LIMIT 5',
      [userId]
    );

    const autos = autoResult.rows;

    console.log(autos); // Agrega este console.log para verificar que los datos se hayan cargado correctamente

    res.render('dashboard', { autos }); // Pasando la variable autos
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user profile');
  }
});

async function getAutos() {
  const query = 'SELECT * FROM autos';
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
}




// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img/') // Cambiar 'public/uploads/' por 'public/images/'
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  const upload = multer({ storage: storage });

// Convertir el módulo en un módulo asíncrono
async function getAutos() {
  const query = 'SELECT * FROM autos;';
  const { rows } = await pool.query(query);
  return rows;
}

// Obtener todos los autos
module.exports = async (req, res) => {
  try {
    const autos = await getAutos();
    res.render('autos', { autos });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// Obtener todos los autos
router.get('/', async (req, res) => {
  try {
    const autos = await getAutos();
    res.render('autos', { user: req.user, autos: autos })
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


// Obtener un auto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM autos WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    const auto = result.rows[0];
    if (!auto) {
      return res.sendStatus(404);
    }
    res.render('autos', { auto });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Crear un auto
router.post('/', upload.single('foto'), async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/users/login');
    return;
  }
  const foto = req.file.filename;
  const propietario_id = req.user.id; // Obtener el id del propietario desde la sesión
  const { marca, modelo, anio, estado, precio } = req.body;
  try {
    const query = 'INSERT INTO autos (marca, modelo, anio, id_propietario, foto) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const values = [marca, modelo, anio, propietario_id, foto];
    const result = await pool.query(query, values);
    const autoId = result.rows[0].id;
    res.redirect(`/autos`);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


router.get('/users/dashboard', async (req, res) => {
  const userId = req.user.id;

  try {
    const userResult = await pool.query(
      'SELECT email, specialization FROM users WHERE id = $1',
      [userId]
    );

    const autoResult = await pool.query(
      'SELECT id, foto FROM autos WHERE id_propietario = $1 ORDER BY id ASC LIMIT 3',
      [userId]
    );

    const user = userResult.rows[0];
    const autos = autoResult.rows;

    res.render('dashboard', { user, autos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user profile');
  }
});



// Actualizar un auto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { marca, modelo, anio } = req.body;
  try {
    const query = 'UPDATE autos SET marca = $1, modelo = $2, anio = $3 WHERE id = $4';
    const values = [marca, modelo, anio, id];
    await pool.query(query, values);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Eliminar un auto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM autos WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
