# **Banco de dados de corridas de rua usando MongoDB**
## Autores

 - [Leonardo Nammur](github.com/Nammur)
 - [Paulo Vanzolini]
 - [Elton Gil]


## Observações
  
	Como objetivo do trabalho, escolhemos fazer um banco de dados para um site de inscrição de atletas para corrida de rua. O motivo da escolha do tema foi por conta de que um dos integrantes do grupo já tinha essa demanda e aproveitamos para fazer com base nos conhecimentos adquiridos na disciplina.
	Antes de mais nada, é bom deixar claro que o banco de dados não está finalizado para utilização real e que o que foi feito aqui até o momento foi apenas para apresentação na disciplina.

## Sobre o projeto

	Para realização do projeto usamos MongoDB como o banco de dados escolhido para armazenamento dos atletas.
	O site funciona da seguinte maneira: O atleta se inscreve individualmente, colocando todos os dados necessários para a corrida. Após o término do período de inscrição, a lista de competidores estará pronta e assim é enviada para uma outra plataforma para a realização da corrida. Depois de terminada a corrida, os dados de colocação e tempo voltam para o site para que seja publicada a classificação dos atletas divididos por categorias e/ou por classificação geral.
	Um dos possíveis bancos que estariam disponíveis para o uso, como o CouchDB, não atenderia as necessidades da empresa, já que não existe esquema predefinido, além de ter uma eventual consistência, o que não seria interessante para o uso. Não será empregado o cache e portanto o Redis também é descartado, além do fato de que o sistema de chave-valor do banco ser muito simples e tornar a programação desse banco para o uso da empresa bem mais complicada. 
Como também não se usaria muitas buscas no banco, ElasticSearch , HBase e Accumulo são preteridos. Os dados que seriam utilizados não são tão complexos, portanto, os bancos orientados a Grafos também foram excluídos.
	No código temos o esquema do corredor com as possíveis informações para inscrição do mesmo, e para a inscrição foi utilizada uma rota em post, já que lidaremos com uma maior quantidade de dados do que uma consulta
	Utilizamos outra rota em post para salvar a classificação e o tempo de corrida dos participantes, que seria buscado no banco pelo Id fornecido pelo usuário, que seria gerado automaticamente pelo próprio mongo quando efetuada a inscrição, além de um campo extra para as buscas (o campo “participou” do tipo booleano para retornar nas buscas apenas os atletas que realmente participaram da corrida ).
	As buscas foram separadas por classificação na corrida, categoria e gênero, as categorias são divididas em duas, são elas: corridas de 5km ou 10km. Já a classificação poderá ser geral ou por categoria. Os comando utilizados no Mongo para as consultas foram o “find” com o campo do documento “participou” verdadeiro e a função sort para ordenar os dados de acordo com a solicitação, aqui os índices não foram interessantes pois, as consultas seriam feitas apenas uma vez por corrida, já as inscrições podem ser feitas a qualquer momento, portanto, o tempo que seria ganho para a consulta não alcançaria a perda no tempo para inserir os dados.
	Na aplicação futura, os dados resultantes das consultas serão gerados em um pdf e enviados para a publicação.

   
## Como Usar
  Para conseguir rodar o programa, teŕa que ter o mongo já em seu computador. A forma como utilizamos aqui em nosso projeto foi por meio do docker com os seguintes comandos:

-------------------------------------------------------------------------
Para iniciar o mongo-> sudo docker run -p 27017:27017 --name mongo-trabalho -v /home/mongo:/data/ -d mongo

Para usar o Shell do mongo -> sudo docker exec -it mongo-trabalho mongo

--------------------------------------------------------------------------

Após iniciado o mongo, terá que acessar a pasta do projeto pelo terminal e rodar os comandos npm install e npm start respectivamente (o npm install só precisa ser rodado uma unica vez).

O programa estará rodando na porta 3000 do localhost e tem as seguintes rotas:

--------------------------------------------------------------------------
http://localhost:3000/inscricao
http://localhost:3000/classificacao
http://localhost:3000/classificacao/categoria/feminino
http://localhost:3000/classificacao/categoria/masculino
http://localhost:3000/classificacao/geral
http://localhost:3000/classificacao/geral/feminino
http://localhost:3000/classificacao/geral/masculino

--------------------------------------------------------------------------

Para efetuar os posts dos atletas tanto na inscrição quanto na classificação, utilizamos o Postman, sugerido anteriormente pelo Professor Gustavo Leitão.


         
## Limitações
 	Como dito anteriormente, o site não está concluido. O que está pronto aqui foi apenas o necessário para apresentação na disciplina de banco de dados no-sql. Por conta disso, não há nenhuma interface amigavel e a forma de retorno nas buscas é a mais "pura" possível (sem excluir campos nem modificar nada).
	Aém disso, algumas funcionalidades que são necessárias para o funcionamento real do site, visando as regras de negócio das empresas e a forma como funcionam os evntos, não foram implementadas no banco de dados.
	Os posts tem de ser feitos ainda por meio do Postman, que pode ser baixado no link a seguir:

-----------------------------
https://www.getpostman.com/
-----------------------------
