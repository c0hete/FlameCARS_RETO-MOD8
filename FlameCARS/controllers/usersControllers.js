const { pool } = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const path = require("path");
const upload = require('../config/multerConfig');
const initializePassport = require('../config/passportConfig');
const passport = require('passport');
initializePassport(passport);

