const NGROK = `https://${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, {
    path: '/real-time'
});

//let controllerX, controllerY = 0;
//let interactions = 4;

let screenMobile;

let screen_MB1;
let screen_MB2;


let btn1, btn2;
let user = {
    name: '',
    email: ''
};


function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    controllerX = windowWidth / 2;
    controllerY = windowHeight / 2;
    background(0);
    screenMobile = 1;
    angleMode(DEGREES);

    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });
    preloadImages();

    createInputs();

    /*btn2 = createButton("Siguiente");
    btn2.mousePressed(function () {
        socket.emit('app-change-mupi-screen', screenMobile);
        screenMobile++;
        //btn2.style("display", 'none');
    });

    btn1 = createButton("Juega Ahora");
    btn1.mousePressed(function () {
        //DeviceOrientationEvent.requestPermission();
        //orderScreen(3);
        //btn1.hide();
        socket.emit('app-change-mupi-screen', screenMobile);
        screenMobile++;
        //console.log("btn: ", btn1.style);
        btn1.style("display", 'none');
    });*/
}

function draw() {
    background(0, 5);
    displayScreens();
}


function preloadImages() {
    screen_MB1 = loadImage('img/MB-screen1.png' );
    screen_MB2 = loadImage('img/MB-screen2.png');

}

function displayScreens() {
    switch (screenMobile) {
        case 1:
            imageMode(CORNER);
            image(screen_MB1, 0, 0);
            userInputName.style('display', 'block');
            userInputEmail.style('display', 'block');
            button.style('display', 'block');

           // btn1.style("display", 'none');
            //btn2.style("display", 'none');

            break;

        case 2:
            imageMode(CORNER);
            image(screen_MB2, 0, 0);
            userInputName.style("display", 'none');
            userInputEmail.style("display", 'none');
            button.style("display", 'none');

            //btn1.style("display", 'none');

            break;

        default:
            break;
    }
}




function inputNameEvent() {
    user.name = this.value();
    //userInputName.style("display", 'none');
}
function inputEmailEvent() {
    user.email = this.value();
    //userInputEmail.style("display", 'none');
}
function submitForm() {
    sendUserData(user);
    console.table(user);
    button.style("display", 'none');
    socket.emit('app-change-mupi-screen', screenMobile);
    screenMobile++;
}

//---------------------------------------- petición POST con Fetch
async function sendUserData() { //la manera como se hacen las peticiones. Estamos haciendo una solicitud de HTTP
    //console.log ("nene");
    
    const request = {
        method: 'POST',
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    }

    await fetch(NGROK+"/send-user-data", request);
}



function touchMoved() {
    switch (interactions) {
        case 0:
            socket.emit('mobile-instructions', {
                interactions,
                pmouseX,
                pmouseY
            });
            //background(255, 0, 0);
            break;
    }
}



function deviceMoved() {
    switch (interactions) {
        case 1:
            socket.emit('mobile-instructions', { interactions, pAccelerationX, pAccelerationY, pAccelerationZ });
            background(0, 255, 255);
            break;
        case 2:
            socket.emit('mobile-instructions', { interactions, rotationX, rotationY, rotationZ });
            //background(0, 255, 0);
            break;
    }
    
}

/*function deviceShaken() {
    //socket.emit('mobile-instructions', 'Moved!');
    //background(0, 255, 255);
}*/

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function createInputs(){
    
    userInputName = createInput('');
    userInputName.position((windowWidth / 2) - 80, windowHeight - 300);
    userInputName.size(200);
    userInputName.input(inputNameEvent);
    

    userInputEmail = createInput('');
    userInputEmail.position((windowWidth / 2) - 80, windowHeight - 220);
    userInputEmail.size(200);
    userInputEmail.input(inputEmailEvent);
    
    
    button = createButton('Enviar');
    button.position((windowWidth / 2) - 80, windowHeight - 100);
    button.mousePressed(submitForm);
    
}

