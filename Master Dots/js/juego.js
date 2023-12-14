// Variables globales

var iniciadoMarcado = false;
var adyacentes = [];
var idMarcados = [];
var classMarcada;
var tamanoPanel;
var idInterval;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
/**
 Funcion que rellena nick y src de avatar
 */
function rellenarFormularioUsuario(){
    document.getElementById("nick").value=nick;
    document.getElementById("avatarImg").src=avatarImg;
    tamanoPanel = parseInt(tamano);
}

// Fintar los paneles

function pintarPanelJuego(){
    document.getElementById("juego").style.gridTemplateColumns="repeat("+tamano+", 1fr)"
    document.getElementById("juego").style.gridTemplateRows="repeat("+tamano+", 1fr)"
    //Elementos de forma automatica
    let items="";
    let color=["rojo","verde"];
    let colorRnd=0;
    for (let index = 0; index < (parseInt(tamano)*parseInt(tamano)); index++) {
        if(index%2>0) colorRnd=getRandomInt(2);
        items+=`<div class="containerItem"><div id="${index}"class="item ${color[colorRnd]}"></div></div>`;

    }
    document.getElementById("juego").innerHTML=items;
}

// Calculo de adyacentes

function calcularAdyacentes(idMarcado){ 
    adyacentes = [];

    //adyacente superior
    if ((idMarcado - tamanoPanel)>= 0) adyacentes.push(idMarcado - tamanoPanel);
    // adyacente inferior
    if((idMarcado+tamanoPanel)<(tamanoPanel*tamanoPanel)) adyacentes.push(idMarcado + tamanoPanel);
    // adyacente izquierda
    if((idMarcado%tamanoPanel)>0)adyacentes.push(idMarcado-1);
    // adyacentes derecha 
    if(((idMarcado +1)%tamanoPanel)>0) adyacentes.push(idMarcado + 1);

    for(let index =0; index < adyacentes.length; index ++ ) { 
        console.log(adyacentes[index]);
    }
}

// function cuenta atras del juego 

function cuentaAtras() { 
    let tiempoRestante = parseInt(document.getElementById('tmpo').value)-1;
    document.getElementById('tmpo').value =tiempoRestante;
   if(tiempoRestante == 0){
    clearInterval(idInterval);
    // finalizar todos los eventos
    const items = document.getElementsByClassName('item');
    for(let item of items){
        item.removeEventListener('mousedown', comenzarMarcar);
        item.removeEventListener('mouseover',  continuarMarcando);
      
    }
    document.removeEventListener('mouseup', finalizarMarcado);

    // cambiart los z index de los paneles

    document.getElementById("juegoAcabado").classList.add('juegoAcabadoColor');
    document.getElementById("juegoAcabado").style.zIndex="2";
    document.getElementById("juego").style.zIndex="1";
    document.getElementById("nuevaPartida").addEventListener("click",(e)=>location.reload());
   }
}

// Funcionalidad del juego
function programarEventosJuego (){ 
    const items = document.getElementsByClassName('item');
    for(let item of items){
        item.addEventListener('mousedown', comenzarMarcar);
        item.addEventListener('mouseover',  continuarMarcando);
      
    }
    document.addEventListener('mouseup', finalizarMarcado);
    // cuenta atras 
    idInterval = setInterval(cuentaAtras,1000)

}
 
function comenzarMarcar(event){
    let item=event.target;
    let containerItem=event.target.parentElement;
    if(item.classList.contains('rojo')){
        classMarcada='rojo';
        containerItem.classList.add('rojo');
    }
    else{
        classMarcada='verde';
        containerItem.classList.add('verde');
    }
    if(!iniciadoMarcado) iniciadoMarcado=true;


    // Guardo los marcados
    idMarcados.push(parseInt(item.id));
    //Comienzo a calcular adyacentes
    calcularAdyacentes(parseInt(item.id));
    console.log("Pinchado sobre un circulo");
}


//continuar marcando el item 

function continuarMarcando(event){
    if (iniciadoMarcado){ 
        let item = event.target;
        let idNuevo=parseInt(item.id);
        //Es adyacente?
        if(adyacentes.includes(idNuevo)&&item.classList.contains(classMarcada))
        {
            let containerItem=event.target.parentElement;
            if(item.classList.contains('rojo')) containerItem.classList.add('rojo');
            else containerItem.classList.add('verde');
           
             // Guardo los marcados
            idMarcados.push(parseInt(item.id));
            calcularAdyacentes(parseInt(item.id));
        }

    }
    console.log("Pasando sobre un circulo");
 }


// Finalizando el marcado de los item
function finalizarMarcado (event){ 
    iniciadoMarcado = false;
    adyacentes=[]
    const puntuacionInput = document.getElementById('puntuacion');
    if(idMarcados.length > 1){
        // Añadiriamos puntuacion

        puntuacionInput.value = parseInt(puntuacionInput.value) + idMarcados.length;
    }
     //Trabajar con los marcados 
     for(let index =0; index < idMarcados.length; index ++ ) { 
        //capturar el objeto
        let itemMarcado = document.getElementById(idMarcados[index]);
        itemMarcado.parentElement.classList.remove(classMarcada);
        //cambiar el color de forma random 
        let color = ['rojo', 'verde'];
        let colorRnd = getRandomInt(2);
        itemMarcado.classList.remove(classMarcada);
        itemMarcado.classList.add(color[colorRnd]);

    }
    idMarcados= [];
    console.log("Se ha dejado de pulsar un item")
}



/*
    Main del programa
*/

//Capturamos Datos Usuaio
getDatosUsuario();
//Comprobamos los datos
if(!comprobacionDatosUsuario()) location="index.html";
//Rellenamos el formulario
rellenarFormularioUsuario();
pintarPanelJuego();
programarEventosJuego();


