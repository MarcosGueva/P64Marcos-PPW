function cargar_elemento() {
    var content = document.getElementById("content")
    var texto = document.getElementById("texto")

    var div = document.createElement("div")
    div.className = "item-box"
    var texto = document.createTextNode( texto.value )
    div.appendChild(texto)


    content.appendChild(div)
}
function cargar_elemento1() {
    var content1 = document.getElementById("content")
    var texto1 = document.getElementById("Descripcion")

    var div = document.createElement("div")
    div.className = "item-box1"
    var texto1 = document.createTextNode( texto1.value )
    div.appendChild(texto1)


    content1.appendChild(div)
}
function eliminar_elemento() {
    var content = document.getElementById("content")
    content.removeChild(content.lastElementChild)
}
function eliminar_elemento1() {
    var content1 = document.getElementById("content")
    content1.removeChild(content1.lastElementChild)
}