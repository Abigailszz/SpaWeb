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

const port = 3000;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));

