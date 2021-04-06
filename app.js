//Módulos
let express = require('express');
let app = express();

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db','mongodb://admin:sdi@tiendamusica-shard-00-00.soeex.mongodb.net:27017,tiendamusica-shard-00-01.soeex.mongodb.net:27017,tiendamusica-shard-00-02.soeex.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-l9qqk5-shard-0&authSource=admin&retryWrites=true&w=majority');

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, mongo); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig);


//Lanzar el servidor
app.listen(app.get('port'), function(){
   console.log("Servidor activo");
});