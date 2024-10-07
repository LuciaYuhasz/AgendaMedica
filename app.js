const express = require('express');
const bodyParser = require('body-parser');
const medicosRoutes = require('./routes/medicos');

const app = express();
app.use(bodyParser.json());

// Ruta para médicos
app.use('/medicos', medicosRoutes);
const agendamientoRoutes = require('./routes/agendamiento');
app.use('/turnos', agendamientoRoutes);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
