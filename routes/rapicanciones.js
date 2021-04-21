module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}


        cancionDisponible(req.session.usuario, gestorBD.mongo.ObjectID(req.params.id), function(esAutor){
            if(esAutor==true){
                gestorBD.eliminarCancion(criterio,function(canciones){
                    if ( canciones == null ){
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send( JSON.stringify(canciones) );
                    }
                });
            }
            else {
                res.status(403);
                res.json({error: "no tiene permisos para modificar la canción"})
            }
        });
    });

    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?
        let errors = validateData(cancion);
        if(errors.length <= 0) {
            gestorBD.insertarCancion(cancion, function(id){
                if (id == null) {
                    res.status(500);
                    res.json({
                        error : "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje : "canción insertada",
                        _id : id
                    })
                }

            });
        } else{
            res.status(400);
            res.json({error: errors});
        }
    });


    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if ( req.body.genero != null)
            cancion.genero = req.body.genero;
        if ( req.body.precio != null)
            cancion.precio = req.body.precio;

        cancionDisponible(req.session.usuario, gestorBD.mongo.ObjectID(req.params.id), function(esAutor){
            if(esAutor==true) {
                let errors = validateData(cancion);
                if(errors.length <= 0) {
                    gestorBD.modificarCancion(criterio, cancion, function (result) {
                        if (result == null) {
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensaje: "canción modificada",
                                _id: req.params.id
                            })
                        }
                    });
                }else{
                    res.status(400);
                    res.json({error: errors});
                }
            } else {
                res.status(403);
                res.json({error: "no tiene permisos para modificar la canción"})
            }
        });
    });

    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);//unauthorized
                res.json({autenticado: false})
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });
            }
        })
    });

    function cancionDisponible(usuario, cancionId, callback){
        let criterio = {"_id": cancionId}
        gestorBD.obtenerCanciones( criterio, function(canciones){
            if (canciones[0].autor == usuario){
                callback(true);
            } else {
                callback(false);
            }
        });
    }

    function validateData(cancion){
        let errors = new Array();
        if (cancion.nombre === null || typeof cancion.nombre === 'undefined' || cancion.nombre === "" || cancion.nombre.length > 20)
            errors.push("El nombre de la canción es incorrecto")

        if (cancion.genero === null || typeof cancion.genero === 'undefined' || cancion.genero === "")
            errors.push("El género de la canción no puede  estar vacio")

        if (cancion.precio === null || typeof cancion.precio === 'undefined' || cancion.precio < 0 || cancion.precio === "")
            errors.push("El precio de la canción no puede ser negativo")

        return errors;
    }
}