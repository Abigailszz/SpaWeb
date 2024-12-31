const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());




// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Ruta por defecto para redirigir a index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spa'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

// Ruta para obtener productos
app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/soliTurnos', (req, res) => {
    const query = `
         SELECT CONCAT(clientes.nombre, ' ', clientes.apellido) AS cliente , productos.titulo AS servicio, solicitudturnos.dia,solicitudturnos.hora, solicitudturnos.metodo_pago
        FROM solicitudturnos
        INNER JOIN productos ON solicitudturnos.id_servicio = productos.id INNER JOIN clientes ON solicitudturnos.id_cliente=clientes.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener los turnos con el nombre del servicio' });
        }
        res.json(results);
    });
});

// Ruta para obtener productos
app.get('/turnos', (req, res) => {
    const query = 'SELECT * FROM turnos';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
// Ruta para obtener los turnos con el nombre del servicio en lugar del número
app.get('/nombreCliente-Servicio', (req, res) => {
    const query = `
         SELECT CONCAT(clientes.nombre, ' ', clientes.apellido) AS cliente , productos.titulo AS servicio, turnos.fecha,turnos.hora, turnos.estado
        FROM turnos
        INNER JOIN productos ON turnos.id_servicio = productos.id INNER JOIN clientes ON turnos.id_cliente=clientes.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener los turnos con el nombre del servicio' });
        }
        res.json(results);
    });
});





app.get('/productos/inactivo', (req, res) => {
    const query = 'SELECT * FROM productos WHERE estado = ?';
    db.query(query, [0], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener los productos inactivos' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos inactivos' });
        }
        res.json(results);
    });
});

app.get('/productos/activos', (req, res) => {
    const query = 'SELECT * FROM productos WHERE estado = ?';
    db.query(query, [1], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener los productos activoss' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos activos' });
        }
        res.json(results);
    });
});

// Ruta para obtener la información de un producto por su ID
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]); // Devuelve solo el primer resultado
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    });
});

// Ruta para guardar un turno
app.post('/turnos/guardar-turno', (req, res) => {
    const { clienteId, servicioId, fecha, hora, estado,metodopago } = req.body;

    // Consulta SQL para insertar un turno
    const query = `
        INSERT INTO turnos (id_cliente, id_servicio, fecha, hora, estado,metodo_pago)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [clienteId, servicioId, fecha, hora, estado,metodopago], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al guardar el turno' });
        } else {
            res.status(201).json({ message: 'Turno guardado exitosamente', turnoId: result.insertId });
        }
    });
});

app.get('/turnos/reservados', (req, res) => {
    const query = `
        SELECT fecha, hora 
        FROM turnos 
        WHERE estado = 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los turnos disponibles' });
        }

        if (results.length === 0) {
            return res.json([]); // Devuelve un array vacío si no hay resultados
        }

        // Convertimos la fecha y hora a un formato más fácil de manejar
        const reservedSlots = results.map(turno => {
            const date = new Date(turno.fecha);
            const hour = turno.hora.split(':')[0] + ":" + turno.hora.split(':')[1];  // Formato HH:mm
            return { date: date.toISOString().split('T')[0], hour }; // Devuelve solo la fecha (YYYY-MM-DD) y la hora (HH:mm)
        });
        res.json(reservedSlots); // Devuelve las fechas y horas reservadas
    });
});

// Ruta para verificar el rol del usuario
app.post('/personal/verificar-rol', (req, res) => {
    const { username, password } = req.body; // Obtener username y password del cuerpo de la solicitud

    const query = 'SELECT rol FROM personal WHERE usuario = ? AND contraseña= ?'; // O usar el campo adecuado para la verificación
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al verificar el usuario' });
        }

        if (results.length > 0) {
            const user = results[0];
            // Si el rol es "administrador", enviamos true, sino false
            if (user.rol === 'administrador') {
                res.json({ rol: 'administrador' });
            } else {
                res.json({  rol: 'usuario' });
            }
        } else {
            res.status(404).json({ message: 'Usuario no encontrado o contraseña incorrecta' });
        }
    });
});







const port = 3000;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));

