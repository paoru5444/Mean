let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/barbers';
MongoClient.connect(url, function(err, db) {
    if (err) {
        return console.log(err);
    }

    console.log('Banco de dados conectado com sucesso!');
    let fila = db.collection('fila');
    fila.insertOne({
        "Nome": "Vitor",
        "Chegada": "30 minutos atrás",
        "Posição": "4º na fila"
    });

    fila.insertOne({
            "Nome": "Chester",
            "Chegada": "10 minutos atrás",
            "Posição": "7º na fila"
        }),
        function(err, res) {
            if (err) {
                return console.log(err);
            }
        }
    console.log('Adicionado com Sucesso!');

    db.close();
});