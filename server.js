const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios');
const options = require('./db/connectionAzure');
var knex = require('knex')(options);
const fetch = require('node-fetch');
const {Line} = require('messaging-api-line');
// var linebot = require('linebot');


const volleyball = require('volleyball');
require('dotenv').config();
const api = require('./api/balang');

 
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
 
// create LINE SDK client
const client = new line.Client(config);
const app = express();
// const linebotParser = l.json();
// const parser = express.json();

// app.use(express.json());
app.use(volleyball);
app.use('/api',api);


// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  console.log(req);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((e)=>{
      console.log(e);
    });
 
});

app.get('/',(req,res)=>{
    res.json("halooo")
})
 
function handleEvent(event) {
    console.log('event')
    console.log(event.message.text)
    if(event.message.text == "hai"){
      const echo = { type: 'text', text: "Halo juga :)·" };
      return client.replyMessage(event.replyToken, [
        Line.createText('Hello'),
        Line.createText('End'),
      ]);
    }else if(event.message.text == "barang"){
      let echo = "Daftar Barang\n==============";
      axios.get('https://pinto-planarian.glitch.me/api/barang').then(function(res){
        res.data.map(function(result){
          echo += "\nNama Barang : " + result.nama + "\n" +"Pemilik Barang : " + result.pemilik + "\n" +"Lokasi Barang : " + result.lokasiBarang+  "\n--------------";
        }).join('');
        return client.replyMessage(event.replyToken,[
            Line.createText(echo),
          ]);
      }).catch(function(err){
        console.log("error");
        console.log(err);
      })
    }else if(event.message.text == "sayang kamu"){
      const echo = { type: 'text', text: "sayang kamu juga :)·" };
      return client.replyMessage(event.replyToken, echo);
    }else if(event.message.text.startsWith("ditemukan")){
      console.log(event.message.text);
      let statement = event.message.text.split(" ");
      let data = statement[1].split("/");
      const body = {
        "nama" : data[0],
        "pemilik" : data[1],
        "lokasiBarang" : data[2]
      }
      // console.log(body);
      
      // axios.post({
      //   method: 'post',
      //   url: 'https://butter-mail.glitch.me/api/postBarang',
      //   data: {
      //     nama : data[0],
      //     pemilik : data[1],
      //     lokasiBarang : data[2]
      //   }
      // })
      // .then(function (response) {
      //   console.log("success" + data);
      //   const echo = { type: 'text', text: "saved" };
      //   return client.replyMessage(event.replyToken, echo);
      // })
      // .catch(function (error) {
      //   console.log("error" + data);
      //   console.log(error)
      //   const echo = { type: 'text', text: error.message };
      //   return client.replyMessage(event.replyToken, echo);
      // });
      
      // console.log(JSON.stringify(body));
      fetch ('https://pinto-planarian.glitch.me/api/postBarang',{
      method: 'POST',
      headers:{
        'content-type':'application/json',
      },
      body:JSON.stringify(body),
      json: true
    }).then(response=>{
      if(response.ok){
        const echo = { type: 'text', text: "saved" };
        return client.replyMessage(event.replyToken, echo);
        
      }
      return response.json().then(error=>{
        console.log("error1");
        console.log(error.message);
        const echo = { type: 'text', text: error.message };
        return client.replyMessage(event.replyToken, echo);
      });
    }).catch(error=>{
        console.log(body)
      console.log('fetch error'+error)
      // this.setState({ errorMessage: error.message });
      // this.setState({login:false})
        console.log("error2");
        console.log(error.message);
        const echo = { type: 'text', text: error.message};
        return client.replyMessage(event.replyToken, echo);
    });
      
    }else{
      const echo = { type: 'text', text: "Saya tidak mengerti, saya simpan dulu" };
      return client.replyMessage(event.replyToken, echo);
    }
}
 
// listen on port
const port = 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});