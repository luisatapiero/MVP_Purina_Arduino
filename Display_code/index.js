const express = require('express');
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
const app = express();
const PORT = 5050; // No cambiar
//const SERVER_IP = '172.30.228.225'; // Cambiar por la IP del computador
const SERVER_IP = '192.168.1.19';
//const httpServer = app.listen(PORT);
//const ioServer = new Server(httpServer);

//const staticDisplay = express.static('public-display');
//app.use('/display', staticDisplay);
app.use(express.json());
app.use('/app', express.static('public-app')); //están sirviendo los endopoints de manera estatica
app.use('/display', express.static('public-display'));

const httpServer = app.listen(PORT, () => { //app listen es cuando activa el servidor. EL proyecto empieza a escuchar el puerto que le indicaron
    console.log(`http://${SERVER_IP}:${PORT}/app`);
    console.log(`http://${SERVER_IP}:${PORT}/display`);
});

const ioServer = new Server(httpServer, { path: '/real-time' });


let characterMessage = {
    x: 0,
    y: 0
};

/*app.get('/test', (req, res) => {
    console.log(req.body);
    res.send({
        m: 'Okay'
    });
});*/

ioServer.on('connection', (socket) => {
    console.log(`Connected`, socket.id);

   //Sends the player's moves
    socket.broadcast.emit('directions', characterMessage);
    //socket.broadcast.emit('action', action );

    socket.on('screens', (pantalla) => {
        console.log(pantalla)
        socket.broadcast.emit('screens', pantalla);
    });

   socket.on('screensController', (pantalla) => {
    console.log('controler', pantalla)
    socket.broadcast.emit('screensController', pantalla);
    });

});

//------------------------------------------------this opens a port

const protocolConfiguration = {
    path: 'COM3',
    baudRate: 9600
}

const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser());


parser.on('data', (data) => {

    // Create the array
    let dataArray = data.split(' ');

console.log(data)

    // Parse the Strings to Integer
    characterMessage.x = parseInt(dataArray[0]);
    characterMessage.y = parseInt(dataArray[1]);
    characterMessage.b = parseInt(dataArray[2]);
    //console.log(characterMessage);

    // Emit the message using WebSocket to the client
 
    ioServer.emit('directions', characterMessage);

    
});


//---------------------------- Database local 
let users = []; // user structure =  {name: ‘’, email: ‘’}


let usuarios = {};


//---------------------------- Endpoints del API

app.post('/send-user-data',(request, response) =>{ //creamos un API rest, es crear endpoints que podemos entrar desde nuestro cliente
//dependiendo de la información que se mande. El post crea información nueva en la DB
    usuarios = request.body; //se cambia la variable usuarios
    console.log('Post! from client', request.body);
});


app.get('/send-user-data',(request, response) =>{

    console.log("help");
    response.send(usuarios); //envia los datos. SI entramos a al ruta '/send-user-data' nos llegará el json de usuarios
});
