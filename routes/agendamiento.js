const express = require('express');
const router = express.Router();
const connection = require('../db');


// Agendar turno
router.post('/agendar', (req, res) => {
    const { id_paciente, id_profesional, fecha, hora, motivo_consulta, sobreturno } = req.body;

    // Obtener el día de la semana basado en la fecha proporcionada
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const fechaTurno = new Date(fecha);


    const diaSemana = diasSemana[fechaTurno.getDay()]; // Devuelve el día de la semana en formato ENUM

    // Verificar disponibilidad en la tabla de agendas del profesional
    const verificarAgenda = `
        SELECT * FROM agendas 
        WHERE id_profesional = ? 
        AND dia_semana = ? 
        AND ? BETWEEN hora_inicio AND hora_fin`;

    connection.query(verificarAgenda, [id_profesional, diaSemana, hora], (err, agendaResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al verificar disponibilidad en agenda');
        }

        if (agendaResults.length === 0) {
            return res.status(400).send('El profesional no tiene disponibilidad en ese día o hora');
        }

        const agenda = agendaResults[0];

        // Verificar si ya hay un turno en ese horario para el profesional
        const verificarTurno = `
            SELECT * FROM turnos 
            WHERE id_profesional = ? 
            AND fecha = ? 
            AND hora = ?`;

        connection.query(verificarTurno, [id_profesional, fecha, hora], (err, turnosResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al verificar turno');
            }

            if (turnosResults.length > 0) {
                // Si se permiten sobreturnos, verificamos si es un sobreturno
                if (sobreturno) {
                    // Contar cuántos sobreturnos ya existen para este día
                    const verificarSobreturnos = `
                        SELECT COUNT(*) AS sobreturnos_actuales FROM turnos 
                        WHERE id_profesional = ? 
                        AND fecha = ? 
                        AND sobreturno = TRUE`;

                    connection.query(verificarSobreturnos, [id_profesional, fecha], (err, sobreturnosCountResults) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Error al verificar sobreturnos');
                        }

                        const sobreturnosActuales = sobreturnosCountResults[0].sobreturnos_actuales;

                        if (sobreturnosActuales >= agenda.sobreturnos_maximos) {
                            return res.status(400).send('No hay más sobreturnos disponibles para este día');
                        }

                        // Insertar el sobreturno si aún hay lugar
                        insertarTurno(id_paciente, id_profesional, fecha, hora, motivo_consulta, sobreturno, res);
                    });
                } else {
                    // Si no es un sobreturno, entonces el turno ya está ocupado
                    return res.status(400).send('Turno no disponible');
                }
            } else {
                // Insertar el turno normal
                insertarTurno(id_paciente, id_profesional, fecha, hora, motivo_consulta, sobreturno, res);
            }
        });
    });
});

// Función para insertar el turno
function insertarTurno(id_paciente, id_profesional, fecha, hora, motivo_consulta, sobreturno, res) {
    const query = `
       


        INSERT INTO turnos (id_paciente, id_profesional, id_clasificacion, fecha, hora, estado, motivo_consulta, sobreturno) 
VALUES (?, ?, ?, ?, ?, 'Reservada', ?, ?)`;



    connection.query(query, [id_paciente, id_profesional, id_clasificacion, fecha, hora, motivo_consulta, sobreturno], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al agendar turno');
        }
        res.status(200).send('Turno agendado correctamente');
    });
}

////////////////////////////////////////////////////////////////////

// Agendar turno
/*router.post('/agendar', (req, res) => {
    const { id_paciente, id_profesional, fecha, hora, motivo_consulta, sobreturno } = req.body;

    // Primero verifica si el turno ya está ocupado
    const verificarTurno = "SELECT * FROM turnos WHERE id_profesional = ? AND fecha = ? AND hora = ?";
    connection.query(verificarTurno, [id_profesional, fecha, hora], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al verificar turno');
        }

        if (results.length > 0) {
            return res.status(400).send('Turno no disponible');
        }

        // Insertar turno con el estado inicial como 'Reservada'
        const query = "INSERT INTO turnos (id_paciente, id_profesional, fecha, hora, estado, motivo_consulta, sobreturno) VALUES (?, ?, ?, ?, 'Reservada', ?, ?)";
        connection.query(query, [id_paciente, id_profesional, fecha, hora, motivo_consulta, sobreturno], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al agendar turno');
            }
            res.status(200).send('Turno agendado correctamente');
        });
    });
});*/
module.exports = router;
