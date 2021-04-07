module.exports = function(app, swig, gestorBD) {
    app.post('/comentarios/:cancion_id', function (req, res) {
            let comentario = {
                autor: req.session.usuario,
                texto: req.body.texto,
                cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id)
            }
            if(req.session.usuario == null){
                res.send("Debe estar cutenticado para comentar");
            }
            // Conectarse
            gestorBD.insertarComentario(comentario, function (id) {
                if (id == null) {
                    res.send("Error al insertar comentario");
                } else {
                    res.send("Agregado comentario id:  " + id);                }
            });

        });
}