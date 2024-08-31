const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar la conexión a SQL Server
const dbConfig = {
    user: process.env.DB_USER || '',            // Variables de entorno para seguridad
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || 'localhost,1433',  // Nombre del servidor
    database: process.env.DB_NAME || 'proyecto',  // Nombre de la base de datos
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
        if (err) {
            console.error('Error al registrar el usuario:', err);
            res.status(500).send({ error: true, message: 'Error al registrar el usuario' });
        } else {
            res.send({ error: false, data: result, message: 'Usuario registrado exitosamente' });
        }
    });
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    const query = "SELECT * FROM Usuarios";
    const request = new sql.Request();
    request.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            res.status(500).send({ error: true, message: 'Error al obtener los usuarios' });
        } else {
            res.send({ error: false, data: results.recordset, message: 'Lista de usuarios' });
        }
    });
});

// Obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM Usuarios WHERE id = @id";
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener el usuario:', err);
            res.status(500).send({ error: true, message: 'Error al obtener el usuario' });
        } else if (result.recordset.length === 0) {
            res.status(404).send({ error: true, message: 'Usuario no encontrado' });
        } else {
            res.send({ error: false, data: result.recordset[0], message: 'Usuario encontrado' });
        }
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
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            res.status(500).send({ error: true, message: 'Error al actualizar el usuario' });
        } else if (result.rowsAffected[0] === 0) {
            res.status(404).send({ error: true, message: 'Usuario no encontrado' });
        } else {
            res.send({ error: false, message: 'Usuario actualizado exitosamente' });
        }
    });
});

// Eliminar un usuario por ID
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Usuarios WHERE id = @id";
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            res.status(500).send({ error: true, message: 'Error al eliminar el usuario' });
        } else if (result.rowsAffected[0] === 0) {
            res.status(404).send({ error: true, message: 'Usuario no encontrado' });
        } else {
            res.send({ error: false, message: 'Usuario eliminado exitosamente' });
        }
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
        if (err) {
            console.error('Error al registrar el puntaje:', err);
            res.status(500).send({ error: true, message: 'Error al registrar el puntaje' });
        } else {
            res.send({ error: false, data: result, message: 'Puntaje registrado exitosamente' });
        }
    });
});

// Obtener todos los puntajes
app.get('/puntajes', (req, res) => {
    const query = "SELECT u.nombre, p.puntaje, p.fecha FROM Puntajes p JOIN Usuarios u ON p.usuario_id = u.id ORDER BY p.puntaje DESC";
    const request = new sql.Request();
    request.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los puntajes:', err);
            res.status(500).send({ error: true, message: 'Error al obtener los puntajes' });
        } else {
            res.send({ error: false, data: results.recordset, message: 'Lista de puntajes' });
        }
    });
});

// Iniciar el servidor en un puerto diferente
const PORT = process.env.PORT || 4000; // Cambiado a 4000 si el 3000 está en uso
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
