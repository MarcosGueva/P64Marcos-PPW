const URL = 'https://rickandmortyapi.com/api/character/'
var xhttp = null

function conectar(personaje,fn) {
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if (xhttp != null && xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                fn(null,JSON.parse(xhttp.responseText))
                console.log(dato)
            }else{
                const error=`[error]:${URL+personaje}`
            }
        } 
    }
    xhttp.open('GET', URL + personaje, true)
    xhttp.send()
}

function crear_personaje(dato){
    let container = document.getElementById('container')
                let personaje = `<div class="container-item"><h1>${dato.name}</h1>
                <img src="${dato.image}" /><div class="container-item">`
                container.innerHTML = personaje
}

const invocacion_sincrona=function(erro,data){
if (error){
    return console.error(error)
}
crear_personaje(data)
conectar(URL+data.results[0].id,function(error2,data2){
    if (error2)
    return console.error(error2)
    conectar(URL+data.results[0].id,function(error3,data3){

    })
})
}

conectar(URL,invocacion_sincrona)
