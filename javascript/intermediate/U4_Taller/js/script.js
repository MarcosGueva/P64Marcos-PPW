document.getElementById('userForm').addEventListener('submit', addUser);

function addUser(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const city = document.getElementById('city').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const country = document.getElementById('country').value.trim();

    if (!name || !lastname || !city || !phone || !country) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const userId = document.getElementById('userForm').getAttribute('data-id');

    const method = userId ? 'PUT' : 'POST';
    const url = userId ? `http://localhost:3000/api/users/${userId}` : 'http://localhost:3000/api/users';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, lastname, city, phone, country })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.message}`);
        } else {
            alert(userId ? 'Usuario actualizado exitosamente.' : 'Usuario registrado exitosamente.');
            getUsers(); // Actualizar la lista de usuarios
            clearForm(); // Limpiar el formulario después de agregar o actualizar
        }
    })
    .catch(error => console.error('Error:', error));
}

function getUsers() {
    fetch('http://localhost:3000/api/users')
    .then(response => response.json())
    .then(users => {
        let output = '<h2>Lista de Usuarios</h2>';
        users.forEach(user => {
            output += `
                <div>
                    <h3>${user.name} ${user.lastname}</h3>
                    <p>Ciudad: ${user.city}</p>
                    <p>Teléfono: ${user.phone}</p>
                    <p>País: ${user.country}</p>
                    <button onclick="deleteUser('${user._id}')">Eliminar</button>
                    <button onclick="startEditUser('${user._id}')">Editar</button>
                </div>
            `;
        });
        document.getElementById('userList').innerHTML = output;
    })
    .catch(error => console.error('Error al obtener usuarios:', error));
}

function deleteUser(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.message}`);
            } else {
                alert('Usuario eliminado exitosamente.');
                getUsers(); // Actualizar la lista de usuarios
            }
        })
        .catch(error => console.error('Error al eliminar usuario:', error));
    }
}

function startEditUser(id) {
    fetch(`http://localhost:3000/api/users/${id}`)
    .then(response => response.json())
    .then(user => {
        document.getElementById('name').value = user.name;
        document.getElementById('lastname').value = user.lastname;
        document.getElementById('city').value = user.city;
        document.getElementById('phone').value = user.phone;
        document.getElementById('country').value = user.country;
        document.getElementById('submitButton').innerText = 'Actualizar Usuario';
        document.getElementById('userForm').setAttribute('data-id', user._id);
    })
    .catch(error => console.error('Error al cargar usuario para editar:', error));
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('city').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('country').value = '';
    document.getElementById('submitButton').innerText = 'Agregar Usuario';
    document.getElementById('userForm').removeAttribute('data-id');
}

// Cargar los usuarios cuando se carga la página
getUsers();
