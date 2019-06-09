"use strict";
const sha1 = require("js-sha1");
const axios = require("axios");
const FormData = require("form-data");
const request = require('request');

let form = new FormData();

const fs = require("fs");

let answer = {};

axios
  .get(
    "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=1a2ce692fe5c6f03b49f890b74a880e8776c8d03"
  )
  .then(function(response) {
    console.log(response.data);
    answer = response.data;

    writeFile(response);
    answer.decifrado = answer.cifrado
      .split("")
      .map(it => it.charCodeAt(0))
      .map(it =>
        it == 32 ? " " : String.fromCharCode(it + answer.numero_casas)
      )
      .join("");
    answer.resumo_criptografico = sha1(answer.decifrado);
    writeFile(JSON.stringify(answer));

    form.append("file", "./answer.json");
    // console.log(form);

    const options = {
      method: "POST",
      url: "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=1a2ce692fe5c6f03b49f890b74a880e8776c8d03",
      port: 443,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        answer: fs.createReadStream("answer.json")
      }
    };

    console.log(options)

    request(options, function (err, res, body) {
        if(err) console.log(err);
        console.log(body);
    });

    // axios
    //   .post(
    //     ``,
    //     form
    //   )
    //   .then(it => {
    //     console.log("Sucesso!!");
    //     console.log(it);
    //   })
    //   .catch(err => {
    //     console.log("Falha!!");
    //     // console.log(err);
    //   });
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  });

function writeFile(obj) {
  fs.writeFile("./answer.json", obj, err => {
    if (err) {
      console.log("Erro ao criar o arquivo", err);
    } else {
      console.log("Arquivo gerado com sucesso");
    }
  });
}
