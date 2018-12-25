const express = require('express');
const options = require('../db/connectionAzure');
const router = express.Router();

var knex = require('knex')(options);


router.get('/barang',(req,res,next)=>{
    const query= "Select * from daftarBarang"
    console.log(query);
    knex.schema.raw(query).then(ress=>{
        res.json(ress);
    }).catch(err=>{
        res.status(404).json(err);
    })
})

router.post('/postBarang',(req,res,next)=>{
  console.log("request : " + req.nama);
  let query = "insert into daftarBarang (nama, pemilik, lokasiBarang) values ('"+req.body.nama+"','"+req.body.pemilik+"','"+req.body.lokasiBarang+"')";
  console.log(query);
  knex.schema.raw(query).then(ress=>{
      res.json('Berhasil dimasukkan');
  }).catch(err=>{
      res.status(400);
      res.json(err);
  })
})

module.exports = router;