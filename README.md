ENGLISH
Express Login and Registration Application

This is a simple login and registration application built with Node.js and Express.
Features

    User registration with name, email, and password
    Passwords are hashed and stored securely in the database
    User login with email and password
    User logout
    Sessions and cookies to keep users logged in

Technologies Used

    Node.js
    Express
    EJS
    PostgreSQL
    Bcrypt
    Passport

Installation

    Clone this repository
    Run npm install to install dependencies
    Create a PostgreSQL database and update the ./dbConfig.js file with your database credentials
    Run the SQL queries in ./database.sql to set up the necessary tables in your database
    Run npm start to start the application
    Navigate to http://localhost:4000 in your browser to use the application

Usage

    Register a new user account by visiting /users/register and filling out the registration form
    Login to an existing account by visiting /users/login and entering your email and password
    Once logged in, navigate to /users/dashboard to view your dashboard
    Click the "Logout" button on the dashboard page to log out of your account

Code Explanation
Server Configuration

The ./server.js file configures the server by requiring necessary packages and initializing the Express application.
View Configuration

The application uses the EJS template engine and the express-ejs-layouts package to render views. The app.set() method is used to set the views directory and engine.
Session Configuration

The application uses the express-session package to manage user sessions. The session is configured with a secret key and options to control session behavior.
Passport Configuration

Passport is used to handle user authentication. The passportConfig.js file sets up a local strategy for authenticating users based on email and password. The ./server.js file initializes and configures Passport.
Routing

The application has several routes for registering, logging in, logging out, and accessing the dashboard. The routes use the appropriate methods (GET or POST) and render the appropriate views or redirect to other routes.
Database Integration

The application uses the pg package to interact with a PostgreSQL database. The ./dbConfig.js file exports a pool object that is used to execute SQL queries.
User Registration

When a user submits the registration form, the server validates the form data and hashes the password using bcrypt. The server then queries the database to check if the user already exists and inserts the new user into the database if they do not exist.
User Login

When a user submits the login form, Passport authenticates the user using the local strategy. If authentication is successful, the user is redirected to the dashboard. If authentication fails, the user is redirected back to the login page with an error message.
User Logout

When a user clicks the "Logout" button, Passport destroys the session and logs the user out.
Error Handling

The application uses the express-flash package to display flash messages for successful and failed actions. Error messages are also rendered on the registration and login pages if form validation fails.

Credits
This application was developed by José Alvarado for educational and programming practice purposes.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ESPAÑOL
Aplicación de registro e inicio de sesión Express

Esta es una sencilla aplicación de login y registro construida con Node.js y Express.
Características

    Registro de usuario con nombre, email y contraseña
    Las contraseñas son hash y almacenadas de forma segura en la base de datos
    Login de usuario con email y contraseña
    Cierre de sesión del usuario
    Sesiones y cookies para mantener a los usuarios conectados

Tecnologías utilizadas

    Node.js
    Express
    EJS
    PostgreSQL
    Bcrypt
    Pasaporte

Instalación

    Clonar este repositorio
    Ejecuta npm install para instalar las dependencias
    Crea una base de datos PostgreSQL y actualiza el archivo ./dbConfig.js con las credenciales de tu base de datos
    Ejecuta las consultas SQL en ./database.sql para configurar las tablas necesarias en tu base de datos
    Ejecuta npm start para iniciar la aplicación
    Navega a http://localhost:4000 en tu navegador para utilizar la aplicación

Uso

    Registre una nueva cuenta de usuario visitando /users/register y rellenando el formulario de registro.
    Inicie sesión en una cuenta existente visitando /users/login e introduciendo su dirección de correo electrónico y contraseña.
    Una vez iniciada la sesión, vaya a /users/dashboard para ver su panel de control.
    Haga clic en el botón "Salir" de la página del panel de control para salir de su cuenta.

Explicación del código
Configuración del servidor

El archivo ./server.js configura el servidor requiriendo los paquetes necesarios e inicializando la aplicación Express.
Configuración de la vista

La aplicación utiliza el motor de plantillas EJS y el paquete express-ejs-layouts para renderizar las vistas. El método app.set() se utiliza para establecer el directorio de vistas y el motor.
Configuración de la sesión

La aplicación utiliza el paquete express-session para gestionar las sesiones de usuario. La sesión se configura con una clave secreta y opciones para controlar el comportamiento de la sesión.
Configuración de Passport

Passport se utiliza para gestionar la autenticación de usuarios. El archivo passportConfig.js configura una estrategia local para autenticar usuarios basada en correo electrónico y contraseña. El archivo ./server.js inicializa y configura Passport.
Rutas

La aplicación tiene varias rutas para registrarse, iniciar sesión, cerrar sesión y acceder al panel de control. Las rutas utilizan los métodos apropiados (GET o POST) y renderizan las vistas apropiadas o redirigen a otras rutas.
Integración con la base de datos

La aplicación utiliza el paquete pg para interactuar con una base de datos PostgreSQL. El archivo ./dbConfig.js exporta un objeto pool que se utiliza para ejecutar consultas SQL.
Registro de usuarios

Cuando un usuario envía el formulario de registro, el servidor valida los datos del formulario y cifra la contraseña utilizando bcrypt. A continuación, el servidor consulta la base de datos para comprobar si el usuario ya existe e inserta el nuevo usuario en la base de datos si no existe.
Inicio de sesión del usuario

Cuando un usuario envía el formulario de inicio de sesión, Passport autentica al usuario utilizando la estrategia local. Si la autenticación es correcta, el usuario es redirigido al panel de control. Si la autenticación falla, el usuario es redirigido de nuevo a la página de inicio de sesión con un mensaje de error.
Cierre de sesión

Cuando un usuario hace clic en el botón "Salir", Passport destruye la sesión y cierra la sesión del usuario.
Tratamiento de errores

La aplicación utiliza el paquete express-flash para mostrar mensajes flash para acciones exitosas y fallidas. También se muestran mensajes de error en las páginas de registro e inicio de sesión si falla la validación del formulario.


Créditos
La aplicación fue desarrollada por José Alvarado con fines educativos y de práctica de programación. 
