const multer = require("multer");

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

module.exports = upload;
