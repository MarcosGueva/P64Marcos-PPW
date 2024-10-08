const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar la conexión a SQL Server
const dbConfig = {
    user: '',            // Deja vacío si usas Windows Authentication
    password: '',        // Deja vacío si usas Windows Authentication
    server: 'localhost,1433',  // Nombre del servidor
    database: 'proyecto',  // Nombre de la base de datos
    options: {
        encrypt: true,   // Esto es opcional
        trustServerCertificate: true  // Esto es necesario si estás usando una conexión local
    }
};

// Conectarse a la base de datos
sql.connect(dbConfig, (err) => {
    if (err) {
        console.error('No se pudo conectar a la base de datos SQL Server', err);
        process.exit(1);
    } else {
        console.log('Conectado a la base de datos SQL Server');
    }
});

// Crear un nuevo usuario
app.post('/register', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).send({ error: true, message: 'Por favor proporciona un nombre' });
    }
    const query = "INSERT INTO Usuarios (nombre) VALUES (@nombre)";
    const request = new sql.Request();
    request.input('nombre', sql.VarChar, nombre);
    request.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ error: false, data: result, message: 'Usuario registrado exitosamente' });
    });
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    const query = "SELECT * FROM Usuarios";
    const request = new sql.Request();
    request.query(query, (err, results) => {
        if (err) console.log(err);
        else res.send({ error: false, data: results.recordset, message: 'Lista de usuarios' });
    });
});

// Obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM Usuarios WHERE id = @id";
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ error: false, data: result.recordset[0], message: 'Usuario encontrado' });
    });
});

// Actualizar un usuario por ID
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).send({ error: true, message: 'Por favor proporciona un nombre' });
    }
    const query = "UPDATE Usuarios SET nombre = @nombre WHERE id = @id";
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('nombre', sql.VarChar, nombre);
    request.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ error: false, data: result, message: 'Usuario actualizado exitosamente' });
    });
});

// Eliminar un usuario por ID
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Usuarios WHERE id = @id";
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ error: false, data: result, message: 'Usuario eliminado exitosamente' });
    });
});

// Insertar un nuevo puntaje
app.post('/puntaje', (req, res) => {
    const { usuario_id, puntaje } = req.body;
    if (!usuario_id || !puntaje) {
        return res.status(400).send({ error: true, message: 'Por favor proporciona el id del usuario y el puntaje' });
    }
    const query = "INSERT INTO Puntajes (usuario_id, puntaje, fecha) VALUES (@usuario_id, @puntaje, GETDATE())";
    const request = new sql.Request();
    request.input('usuario_id', sql.Int, usuario_id);
    request.input('puntaje', sql.Int, puntaje);
    request.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ error: false, data: result, message: 'Puntaje registrado exitosamente' });
    });
});

// Obtener todos los puntajes
app.get('/puntajes', (req, res) => {
    const query = "SELECT u.nombre, p.puntaje, p.fecha FROM Puntajes p JOIN Usuarios u ON p.usuario_id = u.id ORDER BY p.puntaje DESC";
    const request = new sql.Request();
    request.query(query, (err, results) => {
        if (err) console.log(err);
        else res.send({ error: false, data: results.recordset, message: 'Lista de puntajes' });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
