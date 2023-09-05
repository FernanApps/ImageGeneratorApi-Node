//index.js
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const fetch = require('cross-fetch');


const apiKeyGeneratorMain = process.env.API_TOKEN_MAIN;
const apiKey = process.env.API_TOKEN;
const apiUrl = process.env.API_URL;


let server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());


server.get('/', function(req, res) {
    res.send("Hello World ");
});

server.post('/generate', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.status(401).json({ error: 'Token faltante en el encabezado' });
  } else {
    const token = authHeader.split(' ')[1];
    
    if (!token || token !== apiKey) {
      res.status(401).json({ error: 'Token inválido' });
    } else {
		
	  const prompt = req.body.prompt;
	  const model = req.body.prompt || 'art';

	  
	  var myHeaders = new fetch.Headers();

		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
		myHeaders.append("Authorization", "Bearer " + apiKeyGeneratorMain);

		var urlencoded = new URLSearchParams();
		urlencoded.append("prompt", prompt);
		urlencoded.append("model", model);
		urlencoded.append("key3", "");

		var requestOptions = {
		  method: 'POST',
		  headers: myHeaders,
		  body: urlencoded,
		  redirect: 'follow'
		};

		fetch(apiUrl, requestOptions)
			.then(response => response.text())
			.then(result => {
			   const parsedResult = JSON.parse(result); 
			   const beautifiedJson = JSON.stringify(parsedResult, null, 2); 
			   res.status(200).send(beautifiedJson);
			  
			})
			.catch(error => {
			  res.status(500).json({ error: 'Error en la solicitud' });
			});		
  
    }
  }
});



module.exports = server;

server.listen(3000, () => {
    console.log('Listening on port 3000');
});