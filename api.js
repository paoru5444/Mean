const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/barbers';

app.use(bodyParser.json());
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(url, function(err, db) {
    if (err) {
        return console.log(err);
    }
    console.log('Banco de dados conectado com sucesso!');

    //Verdo do Rest que consulta informações no BD
    app.get('/', (req, res) => {
        let fila = db.collection('fila');
        fila.find({}).toArray((err, items) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Erro ao inserir na fila',
                    erro: err
                });
            }

            res.json(items);
        })
    });

    //Função que irá restringir a entrada apenas aos parametros definidos abaixo.
    function verifica(req) {
        if ((Object.keys(req.body)[0] != "nome") || (Object.keys(req.body)[1] != "chegada") || (Object.keys(req.body)[2] != "posicao")) {
            return {
                success: false,
                message: "O Parâmetro precisa ser igual a nome, chegada ou posição sequencialmente!"
            }
        }

        if (typeof(req.body.nome) != "string") {
            return {
                success: false,
                message: "O conteudo em nome precisa ser uma string"
            }
        }

        if (typeof(req.body.chegada) != "string") {
            return {
                success: false,
                message: "O conteudo em chegada precisa ser uma string"
            }
        }

        if (typeof(req.body.posicao) != "string") {
            return {
                success: false,
                message: "O conteudo em posicao precisa ser uma string"
            }
        }

        return null;
    }

    //Verbo do Rest para inserir uma nova informação.
    app.post('/', function(req, res) {
        var resultado = verifica(req);
        if (resultado != null) {
            return res.json(resultado);
        }
        var fila = db.collection('fila');
        fila.insert(req.body, function(err, result) {
            if (err) {
                res.json(err)
            }
            res.json({
                success: true,
                message: "Adicionado com sucesso"
            })

        })
    });

    //Verbo do Rest que deleta uma colection do BD, usa params para pegar o id inserido na url do programa PostMan.
    app.delete('/:id', function(req, res) {
        var fila = db.collection('fila');
        fila.deleteOne({ _id: ObjectID(req.params.id) }, function(err, result) {
            if (err) {
                return res.json(err)
            }

            res.json({
                success: true
            })
        })
    });

    //Verbo do Rest para alterar uma informação no BD usa id assim como o DELETE
    app.put('/:id', function(req, res) {
        var resultado = verifica(req);
        /*if (resultado != null) {
            return res.json(resultado);
        }*/
        var fila = db.collection('fila');
        fila.updateOne({ _id: ObjectID(req.params.id) }, req.body, (err, result) => {
            if (err) {
                return res.json(err)
            }

            res.json({
                success: true
            })
        })
    });

    //Conecção com o servidor
    app.listen(3000, function() {
        console.log('Conectado');
    });

})