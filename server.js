var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('public'));


// Serial Port
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});
port.pipe(parser);

port.on('open', () => console.log('Port open'));
parser.on('data', (dato) => {
    io.emit('dato', dato);
});



// nos suscribimos al evento de socketIO cuando
// un cliente se conecta por WebSockets
io.sockets.on('connection', function (socket) {
	console.log("Usuario conectado");

    socket.on('disconnect', () => {
		console.log("Usuario Desconectado");
	});
});
