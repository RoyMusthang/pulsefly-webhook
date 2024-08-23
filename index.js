const express = require("express");
const fs = require("fs");
const https = require("https");
var logger = require("morgan");

const httpsOptions = {
  cert: fs.readFileSync(""), // Certificado fullchain do dominio
  key: fs.readFileSync("/"), // Chave privada do domínio
  ca: fs.readFileSync(""), // Certificado público da Efí
  minVersion: "TLSv1.2",
  requestCert: true,
  rejectUnauthorized: true, //Caso precise que os demais endpoints não rejeitem requisições sem mTLS, você pode alterar para false
};

const app = express();
const httpsServer = https.createServer(httpsOptions, app);
const PORT = 443;

app.use(logger("dev")); // Comente essa linha caso não queira que seja exibido o log do servidor no seu console
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Endpoint para configuração do webhook, você precisa cadastrar https://SEUDOMINIO.com/webhook
app.post("/webhook", (request, response) => {
  // Verifica se a requisição que chegou nesse endpoint foi autorizada
  if (request.socket.authorized) {
    response.status(200).end();
  } else {
    response.status(401).end();
  }
});

// Endpoind para recepção do webhook tratando o /pix
app.post("/webhook/pix", (request, response) => {
  if (request.socket.authorized) {
    //Seu código tratando a callback
    /* EXEMPLO:
    var body = request.body;
    filePath = __dirname + "/data.json";
    fs.appendFile(filePath, JSON.stringify(body) + "\n", function (err) {
        if (err) {
            console.log(err);
        } else {
            response.status(200).end();
        }
    })*/
    response.status(200).end();
  } else {
    response.status(401).end();
  }
});

httpsServer.listen(PORT, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
//Desenvolvido pela Consultoria Técnica da Efí
