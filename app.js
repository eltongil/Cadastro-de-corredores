const express = require('express');
var bodyParser = require('body-parser');
const app = express()
const port = 3000
var mongoose = require('mongoose');
app.listen(port, ()=> console.log(`example app listening on port ${port}!`))
mongoose.connect('mongodb://localhost/corridas', {useNewUrlParser: true});

var db = mongoose.connection;
app.use(bodyParser());

db.on('error',console.error.bind(console,'conection error:'))
db.once('open',function(){
    //cria o esquema com todas as variaveis necessárias para fazer os processos de inscrição e relatorio de classificação
    var runnerSchema = new mongoose.Schema({

        nome: String,
        sobrenome: String,
        email: String,
        telefone: Number,

        diaNascimento: Number,
        mesNascimento: Number,
        anoNascimento: Number,
        idade: Number,

        genero: String,
        km: Number,

        cidade: String,
        estado: String,
        pais: String,
        equipe: String,

        classificacaoGeral: Number,
        classificacaoCategoria: Number,
        participou: Boolean,
        categoria: String, 
        tempoLiquido: String,
        tempoBruto: String
    });
    var corredor = mongoose.model('corredor',runnerSchema);
    /*
    app.get('/teste', (req, res) => {
        res.send('teste.')
    })*/
    //rota de inscrição com post para inscrever o atleta com seus respectivos dados informados
    app.post('/inscricao', (req, res) =>{
        var momentoAtual = new Date();
        var ano = momentoAtual.getYear();
        var mes = momentoAtual.getMonth();
        var dia = momentoAtual.getDay();
        console.dir(dia + "/" + mes + "/" + ano);

        //recebe os parametros dados no body da aplicação  na respectiva rota
        const param1 = req.body.nome
        const param2 = req.body.sobrenome
        const param3 = req.body.diaNascimento
        const param4 = req.body.mesNascimento
        const param5 = req.body.anoNascimento
        const param6 = req.body.genero
        const param7 = req.body.km
        const param8 = req.body.cidade
        const param9 = req.body.estado
        const param10 = req.body.pais
        const param11 = req.body.email
        const param12 = req.body.telefone
    
        
        // cria um novo atleta atribuindo os parametros recebidos para as variaveis do mesmo
        var novoCorredor = new corredor({
            nome: param1,
            sobrenome: param2,
            email: param11,
            telefone: param12,
    
            diaNascimento: param3,
            mesNascimento: param4,
            anoNascimento: param5,
    
            genero: param6,
            km: param7,
    
            cidade: param8,
            estado: param9,
            pais: param10,
            participou: false,
        });
    
    //analisa a data de nascimento e a data atual para calcular a idade do corredor
    if(novoCorredor.mesNascimento == mes){
        if(novoCorredor.diaNascimento <= dia){
            if(novoCorredor.anoNascimento <= (ano - 100)){
                novoCorredor.idade = ano - novoCorredor.anoNascimento - 100;
            }
            else{
                novoCorredor.idade = ano - novoCorredor.anoNascimento;
            }
        }
        else if(novoCorredor.diaNascimento > dia){
            if(novoCorredor.anoNascimento <= (ano - 100)){
                novoCorredor.idade = ano - novoCorredor.anoNascimento - 101;
            }
            else{
                novoCorredor.idade = ano - novoCorredor.anoNascimento - 1;
            }
        }
    }
    else if(novoCorredor.mesNascimento < mes){
            if(novoCorredor.anoNascimento <= (ano - 100)){
                novoCorredor.idade = ano - novoCorredor.anoNascimento - 100;
            }
            else{
                novoCorredor.idade = ano - novoCorredor.anoNascimento;
            }
    }
    else if(novoCorredor.mesNascimento > mes){
        if(novoCorredor.anoNascimento <= (ano - 100)){
            novoCorredor.idade = ano - novoCorredor.anoNascimento - 101;
        }
        else{
            novoCorredor.idade = ano - novoCorredor.anoNascimento - 1;
        }
    }

    //de acordo com a idade do corredor e na quilometragem na qual está inscrito, inscreve na categria correspondente
    if(novoCorredor.idade < 18){
        //faz uma string composta pela KM escolhida pelo atleta com a categoria de idade
        novoCorredor.categoria = novoCorredor.km + "km 0-17";
    }
    else if(novoCorredor.idade >= 18 && novoCorredor.idade <= 29){
        novoCorredor.categoria = novoCorredor.km + "km 18-29";
    }
    else if(novoCorredor.idade > 29 && novoCorredor.idade <= 39){
        novoCorredor.categoria = novoCorredor.km + "km 30-39";
    }
    else if(novoCorredor.idade > 39 && novoCorredor.idade <= 49){
        novoCorredor.categoria = novoCorredor.km + "km 40-49";
    }
    else if(novoCorredor.idade > 49 && novoCorredor.idade <= 59){
        novoCorredor.categoria = novoCorredor.km + "km 50-59";
    }
    else if(novoCorredor.idade > 59 && novoCorredor.idade <= 69){
        novoCorredor.categoria = novoCorredor.km + "km 60-69";
    } 
    else if(novoCorredor.idade > 69){
        novoCorredor.categoria = novoCorredor.km + "km 70+";
    }
    //salva os dados do corredor no banco
    novoCorredor.save(function(err, novoCorredor) {
            if (err) return console.error(err);
            console.dir(novoCorredor);
            res.send(novoCorredor)
        });
    })
    //rota de inscrição com get para retornar todos os incritos
    app.get('/inscricao', (req, res) =>{
        corredor.find(function(err, corredor) {
            if (err) return console.error(err);
            console.dir(corredor);
            res.send(corredor)
        });
    })
    //rota de classificação com post para inserir as colocações e tempo de cada atleta
    app.post('/classificacao', (req, res) =>{

         //recebe os parametros dados no body da aplicação na respectiva rota
        const id = req.body._id
        const param1 = req.body.classificacaoGeral
        const param2 = req.body.classificacaoCategoria
        const param3 = req.body.tempoBruto
        const param4 = req.body.tempoLiquido
    
        //procura o corredor pelo id fornecido
        corredor.findById(id, function(err, corredor) {
            //o achar o corredor, atribui os outros dados que fornecidos
            if (err) throw err;
            corredor.classificacaoGeral = param1;
            corredor.classificacaoCategoria = param2;
            corredor.tempoBruto = param3;
            corredor.tempoLiquido = param4;
            //se o atleta tiver o seu resultado postado aqui, a variavel participou fica true, para sinalizar que o mesmo
            //participou da corrida, que servirá, principalmente, para dar a classificação apenas com os que participaram
            corredor.participou = true;
            corredor.save(function(err, corredor) {
                if (err) return console.error(err);
            });
            res.json(corredor);
        });
       
    })
    //rota apenas para auxiliar na obtenção dos dados
    app.get('/classificacao', (req, res) =>{
        res.send("Para ter o resultado da classificação geral, acesse classificacao/geral ou para acessar o resultado das categorias, acesse classificacao/categoria. Se quiser apenas masculino ou feminino, acesse /masculino ou /feminino");
    });
    //diferencia classificação geral de classificação por categoria

    //classificação geral (masculina e feminina) ordenada por colocação em categorias
    app.get('/classificacao/categoria', (req, res) =>{
            //find com filtro de participação na corrida, ordenado por genero primeiramente, depois
            //categoria e posteriormente por classificação na categoria
            corredor.find({participou: { $eq: true }}).sort({genero: 1,categoria: 1, classificacaoCategoria: 1}).exec(function(err, corredor) {
                if (err) return console.error(err);
                console.dir(corredor);
                res.send(corredor)
            });
        });
    //classificação feminina ordenada por colocação em categorias
    app.get('/classificacao/categoria/feminino', (req, res) =>{
        //find com filtro de participação na corrida e genero feminino, ordenado primeiramente por
        //categoria e posteriormente por classificação na categoria
        corredor.find({participou: { $eq: true },genero:{ $eq:"F"}}).sort({categoria: 1, classificacaoCategoria: 1}).exec(function(err, corredor) {
            if (err) return console.error(err);
            console.dir(corredor);
            res.send(corredor)
        });
    });
    //classificação masculina ordenada por colocação categoria
    app.get('/classificacao/categoria/masculino', (req, res) =>{
        //find com filtro de participação na corrida e genero masculino, ordenado primeiramente por
        //categoria e posteriormente por classificação na categoriaria
        corredor.find({participou: { $eq: true },genero:{ $eq:"M"}}).sort({categoria: 1, classificacaoCategoria: 1}).exec(function(err, corredor) {
            if (err) return console.error(err);
            console.dir(corredor);
            res.send(corredor)
        });
    });
    //classificação geral(masculina e feminina) ordenada por colocação geral
    app.get('/classificacao/geral', (req, res) =>{
            //find com filtro de participação na corrida, ordenado por KM primeiramente, depois
            //genero e posteriormente por classificação na classificação geral
            corredor.find({participou: { $eq: true }}).sort({km:1, genero: 1, classificacaoGeral: 1}).exec(function(err, corredor) {
                if (err) return console.error(err);
                console.dir(corredor);
                res.send(corredor);
            });
    });
    //classificação feminina ordenada por colocação geral
    app.get('/classificacao/geral/feminino', (req, res) =>{
        //find com filtro de participação na corrida e genero feminino, ordenado por KM primeiramente
        //e posteriormente por classificação na classificação geral
        corredor.find({participou: { $eq: true },genero:{ $eq:"F"} }).sort({km:1, classificacaoGeral: 1}).exec(function(err, corredor) {
            if (err) return console.error(err);
            console.dir(corredor);
            res.send(corredor);
        });
    });
    //classificação masculina ordenada por colocação geral
        app.get('/classificacao/geral/masculino', (req, res) =>{
        //find com filtro de participação na corrida e genero masculino, ordenado por KM primeiramente
        //e posteriormente por classificação na classificação geral
        corredor.find({participou: { $eq: true },genero:{ $eq:"M"}}).sort({km:1, classificacaoGeral: 1}).exec(function(err, corredor) {
            if (err) return console.error(err);
            console.dir(corredor);
            res.send(corredor);
        });
    });
});
