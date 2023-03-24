// Importar módulos necesarios
const express = require('express');
const router = express.Router();
const { pool } = require("../config/dbConfig");
const multer  = require('multer');
const initializePassport = require('../config/passportConfig');
const passport = require('passport');
initializePassport(passport);

// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
  // Verificar si el usuario está autenticado
  if (req.isAuthenticated()) {
    // Si está autenticado, continuar con la siguiente función en la cadena
    return next();
  } else {
    // Si no está autenticado, redirigir al usuario a la página de inicio de sesión
    res.redirect('/users/login');
  }
}

// Ruta que requiere autenticación
router.get('/users/dashboard', ensureAuthenticated, async (req, res) => {
  // Obtener el ID del usuario autenticado
  const userId = req.user.id;
  const query = 'SELECT * FROM autos WHERE id = $1';
  const values = [userId];
  const result = await pool.query(query, values);
  const auto = result.rows[0];

  try {
    // Obtener los autos del usuario actual
    const autoResult = await pool.query(
      'SELECT id, foto, marca, modelo, anio FROM autos WHERE id_propietario = $1 ORDER BY id ASC LIMIT 5',
      [userId]
    );

    // Almacenar los autos en una variable
    const autos = autoResult.rows;

    // Renderizar la vista del panel de control (dashboard) con la información de los autos
    res.render('dashboard', { autos });
  } catch (err) {
    // Manejar cualquier error y enviar un error 500
    console.error(err);
    res.status(500).send('Error retrieving user profile');
  }
});

// Ruta para servir imágenes de usuarios según el ID del usuario y el ID de la imagen
router.get("/users/:userId/image/:imageId", async (req, res) => {
  // Obtener el ID del usuario y el ID de la imagen de los parámetros de la ruta
  const { userId, imageId } = req.params;
  // Crear la ruta de la imagen en el sistema de archivos
  const imagePath = path.join(__dirname, '..', 'public', 'img', imageId);
  // Enviar la imagen como respuesta
  res.sendFile(imagePath);
});

// Función para obtener todos los autos de la base de datos
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

// Función para obtener todos los autos y sus propietarios de la base de datos
async function getAutos() {
  const query = `
    SELECT autos.*, users.name AS propietario_nombre
    FROM autos
    INNER JOIN users ON autos.id_propietario = users.id;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

// Ruta para actualizar un auto
router.post('/update', async (req, res) => {
  // Obtener los datos del auto desde el cuerpo de la solicitud
  const { id, marca, modelo, anio } = req.body;
  try {
    // Preparar la consulta SQL para actualizar el auto en la base de datos
    const query = 'UPDATE autos SET marca = $1, modelo = $2, anio = $3 WHERE id = $4';
    const values = [marca, modelo, anio, id];
    // Ejecutar la consulta y actualizar el auto en la base de datos
    await pool.query(query, values);
    // Redirigir al usuario al panel de control (dashboard) después de actualizar el auto
    res.redirect('/users/dashboard');
  } catch (error) {
    // Manejar cualquier error y enviar un error 500
    console.error(error);
    res.sendStatus(500);
  }
});




// Crear un auto
router.post('/', upload.single('foto'), async (req, res) => {
  // Verificar si el usuario está autenticado, si no, redirigir al inicio de sesión
  if (!req.isAuthenticated()) {
    res.redirect('/users/login');
    return;
  }
  // Obtener la información del formulario y el nombre del archivo de la foto
  const foto = req.file.filename;
  const propietario_id = req.user.id; // Obtener el id del propietario desde la sesión
  const { marca, modelo, anio, estado, precio } = req.body;
  try {
    // Insertar el nuevo auto en la base de datos
    const query = 'INSERT INTO autos (marca, modelo, anio, id_propietario, foto) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const values = [marca, modelo, anio, propietario_id, foto];
    const result = await pool.query(query, values);
    const autoId = result.rows[0].id;
    // Redirigir al usuario a la lista de autos
    res.redirect(`/autos`);
  } catch (error) {
    // Manejar cualquier error y enviar un error 500
    console.error(error);
    res.sendStatus(500);
  }
});



// Actualizar un auto
router.put('/:id', async (req, res) => {
  // Obtener el ID del auto desde los parámetros de la ruta y los datos del formulario
  const { id } = req.params;
  const { marca, modelo, anio } = req.body;
  try {
    // Preparar la consulta SQL para actualizar el auto en la base de datos
    const query = 'UPDATE autos SET marca = $1, modelo = $2, anio = $3 WHERE id = $4';
    const values = [marca, modelo, anio, id];
    // Ejecutar la consulta y actualizar el auto en la base de datos
    await pool.query(query, values);
    // Enviar un código de estado 204 para indicar que la actualización se completó correctamente
    res.sendStatus(204);
  } catch (error) {
    // Manejar cualquier error y enviar un error 500
    console.error(error);
    res.sendStatus(500);
  }
});

// Eliminar un auto
router.post('/delete', async (req, res) => {
  // Obtener el ID del auto desde el cuerpo de la solicitud
  const { id } = req.body;
  try {
    // Preparar la consulta SQL para eliminar el auto de la base de datos
    const query = 'DELETE FROM autos WHERE id = $1';
    const values = [id];
    // Ejecutar la consulta y eliminar el auto de la base de datos
    await pool.query(query, values);
    // Redirigir al usuario al panel de control (dashboard) después de eliminar el auto
    res.redirect('/users/dashboard');
  } catch (error) {
    // Manejar cualquier error y enviar un error 500
    console.error(error);
    res.sendStatus(500);
  }
});

// Exportar el enrutador para usarlo en otros archivos del proyecto
module.exports = router;

//--------------------------------------------------------------------------------GET--------------------------------------
//------------------------------------------------------------------------1
// Obtener un auto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Consultar la base de datos para obtener un auto específico por ID
    const query = 'SELECT * FROM autos WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    const auto = result.rows[0];
    if (!auto) {
      // Si no se encuentra el auto, enviar un error 404
      return res.sendStatus(404);
    }
    // Renderizar la vista de auto y enviar el auto encontrado
    res.render('autos', { auto });
  } catch (error) {
    // Manejar cualquier error y enviar un error 500
    console.error(error);
    res.sendStatus(500);
  }
});
//----------------------------------------------------------2
// Mostrar el panel de control (dashboard) del usuario
router.get('/users/dashboard', async (req, res) => {
  // Obtener el ID del usuario actual desde la sesión
  const userId = req.user.id;
  try {
    // Consultar la información del usuario (email y especialización) en la base de datos
    const userResult = await pool.query(
      'SELECT email, specialization FROM users WHERE id = $1',
      [userId]
    );
    // Consultar los autos asociados al usuario actual en la base de datos
    // LIMIT 3 significa que solo se recuperarán los primeros 3 autos
    const autoResult = await pool.query(
      'SELECT id, foto FROM autos WHERE id_propietario = $1 ORDER BY id ASC LIMIT 3',
      [userId]
    );
    // Extraer la información del usuario y los autos de los resultados de las consultas
    const user = userResult.rows[0];
    const autos = autoResult.rows;
    // Renderizar la vista del panel de control (dashboard) y enviar la información del usuario y los autos
    res.render('dashboard', { user, autos });
  } catch (err) {
    // Manejar cualquier error y enviar un error 500 con un mensaje personalizado
    console.error(err);
    res.status(500).send('Error retrieving user profile');
  }
});

// Obtener todos los autos
router.get('/', async (req, res) => {
  try {
    // Consultar la base de datos para obtener todos los autos
    const autos = await getAutos();
    // Renderizar la vista de autos y enviar la lista de autos y el usuario actual
    res.render('autos', { user: req.user, autos: autos });
  } catch (error) {
    // Manejar cualquier error y enviar un error 500
    console.error(error);
    res.sendStatus(500);
  }
});