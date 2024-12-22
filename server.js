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


const port = 3000;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));

