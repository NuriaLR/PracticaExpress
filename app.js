const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 't2p2'
});

// Middleware para el manejo de datos JSON y URL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const port = 3001;

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Enlace para ejecutar la aplicación: http://localhost:${port}/vuelos/index`);
});

/**
 * Obtiene todos los vuelos.
 * @return {void}
 */
app.get('/vuelos/index', function (req, res) {
    let dir = __dirname + '/public/templates/vuelos/index.html';

    res.sendFile(dir, (err) => {
        if (err) {
            res.status(err.status);
        } else {
            console.log('Encontrado correctamente');
        }
    });
});

/**
 * Obtiene todos los vuelos de la base de datos.
 * @return {JSON} - Array de objetos que representan los vuelos.
 */
app.get('/vuelos-all', function (req, res) {
    let query = "SELECT * FROM vuelos";

    connection.query(query, [], function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Error en la consulta de la base de datos' });
        } else {
            res.json(rows);
        }
    });
});
**
 * Maneja las solicitudes GET para mostrar los detalles de un vuelo específico.
 * @param {Object} req - Objeto de solicitud (request).
 * @param {Object} res - Objeto de respuesta (response).
 */
app.get('/vuelos/show/:id', function (req, res) {
    // Directorio del archivo HTML que contiene los detalles del vuelo
    let dir = __dirname + '/public/templates/vuelos/show.html';

    // Envía el archivo HTML al cliente
    res.sendFile(dir, (err) => {
        if (err) {
            // Si hay un error al enviar el archivo, establece el estado de la respuesta en el estado del error
            res.status(err.status);
        } else {
            // Si se envía el archivo correctamente, imprime un mensaje en la consola
            console.log('Encontrado correctamente');
        }
    });
});
/**
 * Obtiene un vuelo específico por su ID.
 * @param {string} req.params.id - ID del vuelo a buscar.
 * @return {JSON} - Objeto que representa el vuelo encontrado.
 */
app.get('/vuelos-show/:id', function (req, res) {
    let id = req.params.id;
    let query = "SELECT * FROM vuelos WHERE id = ?";

    connection.query(query, [id], function(err, row) {
        console.log(query);
      
        if(err){
            err.message
            res.status(500).send('Error: ' + err.message);
        }
        if(row == 'undefined'){
            res.status(200).send('No hay datos');
        }
        else{
            res.json(row);
        }
    });
});

/**
 * Elimina un vuelo específico por su ID.
 * @param {string} req.params.id - ID del vuelo a eliminar.
 * @return {void}
 */
app.delete('/vuelos-eliminar/:id', function (req, res) {
    let id = req.params.id;
 
    connection.query('DELETE FROM vuelos WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        console.log('deleted ' + results.affectedRows + ' rows');
    });
});

/**
 * Actualiza un vuelo existente en la base de datos.
 * @param {string} req.params.id - ID del vuelo a actualizar.
 * @param {object} req.body - Objeto que contiene los nuevos datos del vuelo.
 * @return {void}
 */
app.put('/vuelo-actualizar/:id', (req, res) => {
    connection.query(
        'UPDATE vuelos SET numero_vuelo=?, aerolinea = ?, destino = ?, origen = ?, fecha_llegada = ?, hora_llegada = ?, fecha_salida = ?, hora_salida = ? WHERE id = ?',
        [
            req.body.numero_vuelo,
            req.body.aerolinea,
            req.body.destino,
            req.body.origen,
            req.body.fecha_llegada,
            req.body.hora_llegada,
            req.body.fecha_salida,
            req.body.hora_salida,
            req.params.id
        ],
        function (error, results, fields) {
            if(error){
                res.status(500).send('Error: ' + error.message);
            }else{
                res.json({estado : true});
            }
        }
    );
});

/**
 * Crea un nuevo vuelo en la base de datos.
 * @param {object} req.body - Objeto que contiene los datos del nuevo vuelo.
 * @return {void}
 */
app.post('/vuelos-create', (req, res) => {
    connection.query(
        'INSERT INTO vuelos SET numero_vuelo = ?, aerolinea = ?, destino = ?, origen = ?, fecha_llegada = ?, hora_llegada = ?, fecha_salida = ?, hora_salida = ?',
        [
            req.body.numero_vuelo,
            req.body.aerolinea,
            req.body.destino,
            req.body.origen,
            req.body.fecha_llegada,
            req.body.hora_llegada,
            req.body.fecha_salida,
            req.body.hora_salida,
        ],
        function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
            res.redirect(301, '/vuelos/index'); 
        }
    );
});

/**
 * Ruta para mostrar el formulario de creación de vuelos.
 * @return {void}
 */
app.get('/vuelos/create', function (req, res) {
    let dir = __dirname + '/public/templates/vuelos/create.html';

    res.sendFile(dir, (err) => {
        if (err) {
            res.status(err.status);
        } else {
            console.log('Encontrado correctamente');
        }
    });
});

/**
 * Ruta para mostrar el formulario de edición de vuelos.
 * @param {string} req.params.id - ID del vuelo a editar.
 * @return {void}
 */
app.get('/vuelos/edit/:id', function (req, res) {
    let dir = __dirname + '/public/templates/vuelos/edit.html';

    res.sendFile(dir, (err) => {
        if (err) {
            res.status(err.status);
        } else {
            console.log('Encontrado correctamente');
        }
    });
});
