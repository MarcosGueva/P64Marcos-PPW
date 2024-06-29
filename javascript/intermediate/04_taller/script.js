//Tipos de funciones
//Funcion declarativa
function imprimir(){

}

imprimir()

const suma=function(a,b){
    return(a+b)
}
console.log(suma(10,20))


const suma2 =(a,b)=>{
    let total =a+b
    console.log(`La suma de ${a}y${b}es${total}.`)

}
suma(100,200)

const suma3 =(a,b)=>a+b
console.log(suma3(1000,2000))
