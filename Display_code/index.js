const express = require('express');
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
const app = express();
const httpServer = app.listen(5050);
const ioServer = new Server(httpServer);

const staticDisplay = express.static('public-display');
app.use('/display', staticDisplay);
app.use(express.json());

let characterMessage = {
    x: 0,
    y: 0
};

app.get('/test', (req, res) => {
    console.log(req.body);
    res.send({
        m: 'Okay'
    });
});

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
    //console.log(characterMessage);

    // Emit the message using WebSocket to the client
 
    ioServer.emit('directions', characterMessage);

    
});

//=============================================
//============================================= Week 9 demo:
//=============================================

/*
// Import de SerialPort package
const {
    SerialPort,
    ReadlineParser
} = require('serialport');
// Set the rules for the serial communication
const protocolConfiguration = {
    path: '/dev/cu.usbmodem142101',
    baudRate: 9600
}
// Opens a port
const port = new SerialPort({
    path: '/dev/cu.usbmodem142101',
    baudRate: 9600
});
/*
//--------------------------------------- 1- Read without parsing
// Read data from Serial Buffer
/*
port.on('data', (data) => {
    console.log(data);
})
*/

//--------------------------------------- 2- 4- Reading after parsing
/*
const parser = port.pipe(new ReadlineParser);
parser.on('data', (data) => {
    console.log(data);
})
*/

//--------------------------------------- 3- From String to Integer
/*
const parser = port.pipe(new ReadlineParser);
parser.on('data', (data) => {
    let integerData = parseInt(data);
    console.log(integerData);
});
*/

//--------------------------------------- 5- Creating an Array
/*
const parser = port.pipe(new ReadlineParser);
parser.on('data', (data) => {
    // Divide the String "A B C" by " " to create an Array
    let dataArray = data.split(' ');
    // Remove the last item: \r
    dataArray.splice(-1);
    console.log(dataArray);
    // Parse all the Springs in Integers
    let dataArrayInt = dataArray.map(i =>
        parseInt(i)
    );
    console.log(dataArrayInt);
});
*/