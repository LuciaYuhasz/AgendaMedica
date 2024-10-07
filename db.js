const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto si es necesario
    user: 'root',      // Tu usuario de MySQL
    password: '',      // Tu contraseña de MySQL
    database: 'agendamedica' // Nombre de tu base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;




//netstat -ano | findstr :3000
//taskkill /PID 9068 /F
