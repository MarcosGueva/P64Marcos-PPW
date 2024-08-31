const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
console.log("MongoDB URI:", process.env.MONGO_URI);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la base de datos
 // Verifica si la URI se está cargando correctamente
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado...'))
  .catch(err => console.log(err));

// Modelo de Usuario
const User = require('./models/user');

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
    const { name, lastname, phone, city, country } = req.body;
    try {
        const newUser = new User({ name, lastname, phone, city, country });
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Obtener un usuario por ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Actualizar un usuario por ID
app.put('/api/users/:id', async (req, res) => {
    const { name, lastname, phone, city, country } = req.body;
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        user.name = name;
        user.lastname = lastname;
        user.phone = phone;
        user.city = city;
        user.country = country;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Eliminar un usuario por ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        await user.remove();
        res.json({ msg: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
