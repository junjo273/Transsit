/*
Importación de módulos
*/
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnection } = require('./database/configdb');
const fileUpload = require('express-fileupload');



const app = express();

dbConnection();

app.use(cors());
app.use(express.json());

app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true,
}));

app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/viajes', require('./routes/viajes'));
app.use('/api/solicitudesviajes', require('./routes/solicitudesviajes'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/valoraciones', require('./routes/valoraciones'));
app.use('/api/baneados', require('./routes/baneados'));

//const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

// Abrir la aplicacíon en el puerto 3000
app.listen(port,  () => {
    console.log('Servidor corriendo en el puerto ', port);
});