const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importar conexión a la base de datos



// Alta de profesional
router.post('/agregar', (req, res) => {
    const { nombre, apellido, dni, matricula } = req.body;
    const query = "INSERT INTO profesionales (nombre, apellido, dni, matricula) VALUES (?, ?, ?, ?)";
    connection.query(query, [nombre, apellido, dni, matricula], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).send('Error al agregar profesional');
        }
        res.status(200).send('Profesional agregado correctamente');
    });
});
// Modificación de médico
router.put('/modificar/:id', (req, res) => {
    const { id } = req.params; // id debería corresponder a id_profesional
    const { nombre, apellido, dni, matricula } = req.body; // Las columnas disponibles en la tabla

    console.log('ID recibido:', id); // Agrega un log para ver el ID
    console.log('Datos recibidos:', req.body); // Agrega un log para ver los datos

    const query = "UPDATE profesionales SET nombre = ?, apellido = ?, dni = ?, matricula = ? WHERE id_profesional = ?";
    connection.query(query, [nombre, apellido, dni, matricula, id], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err); // Log del error
            return res.status(500).send('Error al modificar médico');
        }
        res.status(200).send('Médico modificado correctamente');
    });
});



// Inactivar médico
router.put('/inactivar/:id', (req, res) => {
    const { id } = req.params; // id debería corresponder a id_profesional
    const query = "UPDATE profesionales SET activo = 0 WHERE id_profesional = ?"; // Asegúrate de que exista la columna 'activo'
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al inactivar médico');
        }
        res.status(200).send('Médico inactivado correctamente');
    });
});


// Obtener todos los médicos
router.get('/', (req, res) => {
    const query = "SELECT * FROM profesionales"; // Cambia medicos por profesionales
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener médicos');
        }
        res.json(results);
    });
});

module.exports = router;
