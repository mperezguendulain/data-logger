/*
* Autor: Martín Alejandro Pérez Güendulain
*/

window.onload = function() {
    drawEjes();
}

const COLOR_DATO = "#9b59b6";
const COLOR_FONDO = "#fff";
const COLOR_EJES = "#e6ebe0";
const MARGEN_ERROR = 3;

let canvas = document.getElementById('canvas');
let width = canvas.width;
let height = canvas.height;
let ctx = canvas.getContext("2d");
let cont_eje_x = -1;
let div_x = width / 4;
let div_y = height / 4;
let socket;
let dato_ant = 0;
let log = [];

function drawEjes() {
    ctx.fillStyle = COLOR_FONDO;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = COLOR_EJES;
    for(let y = 0; y <= height; y += div_y) {
        for(let x = 0; x < width; x++)
            ctx.fillRect(x, y, 1, 1);
    }

    for(let x = 0; x <= width; x += div_x) {
        for(let y = 0; y < height; y++)
            ctx.fillRect(x, y, 1, 1);
    }
}

function plot(dato) {
    let imgGraphTemp = ctx.getImageData(1, 0, width-1, height);
    ctx.putImageData(imgGraphTemp, 0, 0);

    // Dibujando la última linea junto con el nuevo valor que acaba de llegar del puerto serial
    cont_eje_x = (cont_eje_x+1)%div_x;
    ctx.fillStyle = COLOR_FONDO;
    for(let y = 0; y < height; y++)
        ctx.fillRect(width-1, y, 1, 1);

    ctx.fillStyle = COLOR_EJES;
    for(let y = 0; y <= height; y += div_y)
        ctx.fillRect(width-1, y, 1, 1);

    if(cont_eje_x == 0) {
        ctx.fillStyle = COLOR_EJES;
        for(let y = 0; y < height; y++)
            ctx.fillRect(width-1, y, 1, 1);
    }

    // Pintando el dato
    ctx.fillStyle = COLOR_DATO;
    ctx.fillRect(width-1, height - (dato >> 2), 1, 1);
}

function capturarDatos() {
    log = [];
    socket = io();
    socket.on('dato', (dato) => {
        document.getElementById('dato').innerHTML = dato;

        if(Math.abs(dato-dato_ant) > MARGEN_ERROR)
            log.push({datatime: new Date().toLocaleString(), value: dato});
        dato_ant = dato;
        plot(dato);
    });
    return false;
}


function generarLogFile() {
    socket.disconnect();
    console.log("Desconectando...");

    let txt_log = "Log del Puerto Serial:\n";
    for(let i = 0; i < log.length; i++)
        txt_log += log[i].datatime + " => " + log[i].value + "\n";

    let link = document.createElement("a");
    link.download = "log.txt";
    link.href = "data:application/octet-stream," + encodeURIComponent(txt_log);
    link.click();

    return false;
}
