module.exports = function (app, swig) {

    app.get('/autores/agregar', function (req, res) {
        let roles = ["Cantante", "Batería", "Guitarrista", "Bajista", "Teclista"];
        let respuesta = swig.renderFile('views/autores-agregar.html', {
            roles: roles
        });
        res.send(respuesta);
    });

    app.post("/autores/agregar", function (req, res) {
        res.send("Autor agregado: " + req.body.nombre + "<br>"
            + "grupo: " + req.body.grupo + "<br>" + "rol: " + req.body.rol);
    });

    app.get("/autores", function (req, res) {
        let autores = [{
            "nombre": "Katrina Leskanich",
            "grupo": "Katrina and the Waves",
            "rol": "Cantante"
        }, {
            "nombre": "Don Henley",
            "grupo": "The Eagles",
            "rol": "Bateria"
        }, {
            "nombre": "John Levén",
            "grupo": "Europe",
            "rol": "Bajista"
        }];

        let respuesta = swig.renderFile('views/autores.html', {
                autores: autores
            }
        );

        res.send(respuesta);

    });

    app.get('/autores/filtrar/:rol', function(req, res){
        let autores = [{
            "nombre": "Katrina Leskanich",
            "grupo": "Katrina and the Waves",
            "rol": "Cantante"
        }, {
            "nombre": "Don Henley",
            "grupo": "The Eagles",
            "rol": "Bateria"
        }, {
            "nombre": "John Levén",
            "grupo": "Europe",
            "rol": "Bajista"
        }];

        let autoresfiltrados = autores.filter(autor => autor.rol.toLowerCase() === req.params.rol.toLowerCase());

        let respuesta = swig.renderFile('views/autores.html', {
                autores: autoresfiltrados
            }
        );
        res.send(respuesta);
    });

    app.get('/autores*', function (req, res) {
        res.redirect('/autores/');
    });

};