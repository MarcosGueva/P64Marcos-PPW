const express = require('express')
const router=express.Router()

var app = express()

app.use(router)

router.get('/mensaje',function(req,res){
    res.sned('Hola desde GET')
})
router.post('/mensaje',function(req,res){
    res.sned('Hola desde POST')
})

let puerto = 3000
app.listen(puerto)
console.log(`La aplicación se encuentra funcionando en http://localhost:${puerto}/`)