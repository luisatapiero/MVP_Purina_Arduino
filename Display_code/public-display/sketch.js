//const { text } = require("express");

let socket = io();

let badFood = [];
let goodFood = [];
let puntos;
let character = {
    x: 0,
    y: 0
};
let speed = 2;
let gameOver = false;
let screenNum = 1;
let moveStateX = '';

let screen1;
let screen2;
let screen3;
let screen4;
let screen5;
let screen6;

let meat;
let bowl;
let chicken;
let carrot;
let salmon;
let grapes;
let avocado;
let chocolate;
let onion;

function setup() {
    frameRate(60);
    createCanvas(600, 766);
    //createCanvas(windowWidth, windowHeight);
   // character.x = windowWidth / 2;
    //character.y = windowHeight / 2;

    character.x = 307,04;
    character.y = 690;

    puntos = 0;

    preloadImages();
}

function draw() {
    background(0);
    fill(255);
    noStroke();
    //ellipse(character.x, character.y, 50, 50);
    switch (screenNum) {
        case 1:
            createFood();
            paintFood();
            paintDogBowl();
            touchBadFood();
            touchGoodFood();
            paintPuntos();
            break;

      case 2:
            fill(255);
            textSize(25);
            text('GAME OVER 😔', 340, 300);
            textSize(14);
            text('Tu puntuación fue: '+puntos, 340, 350);
        break;
    
        default:
            break;
    }
    

}

//socket.on('positions', (positions) => {

        /*character.x = map(positions.x, 0, 100, 0, windowWidth);
        character.y = map(positions.y, 0, 100, 0, windowHeight);*/

        socket.on('directions', (positions) => {


            if(positions.x > 60 ){
                console.log("Derecha");
                moveStateX = 'RIGHT'
              
            };
            if(positions.x < 40 ){
                console.log("Izquierda");
                moveStateX = 'LEFT'
               
            };
            if(positions.x > 40 && positions.x < 60){
                moveStateX = '';
            };
            
        
        });

    

//});
function preloadImages() {

    screen1 = loadImage('img/MUPI-screen1.png');
    screen2 = loadImage('img/MUPI-screen2.png');
    screen3 = loadImage('img/MUPI-screen3.png');
    screen4 = loadImage('img/MUPI-screen4.png');
    screen5 = loadImage('img/MUPI-screen5.png');
    screen6 = loadImage('img/MUPI-screen6.png');
    bowl = loadImage('img/bowl.png');
    meat = loadImage('img/carne.png');
    chicken = loadImage('img/pollo.png');
    carrot = loadImage('img/zanahoria.png');
    salmon = loadImage('img/salmon.png');
    grapes = loadImage('img/grapes.png');
    avocado = loadImage('img/avocado.png');
    chocolate = loadImage('img/chocolate.png');
    onion = loadImage('img/onion.png');

}


function createFood() {
    if (frameCount % 360 === 0) {
        let randomFood = int(random(1,4));
        console.log(randomFood);
        switch (randomFood) {
            case 1:
                badFood.push(new ComidaMala(random(1, 590), -10, avocado))
                break;
            case 2:
                badFood.push(new ComidaMala(random(1, 590), -10, grapes))
                break;
            case 3:
                badFood.push(new ComidaMala(random(1, 590), -10, chocolate))
                break;
            case 4:
                badFood.push(new ComidaMala(random(1, 590), -10, onion))
                break;
        
            default:
                break;
        }
        
    }

    if (frameCount % 240 === 0) {
        let randomFood = int(random(1,4));
        switch (randomFood) {
            case 1:
                goodFood.push(new ComidaBuena(random(1, 590), -10, meat))
                break;
            case 2:
                goodFood.push(new ComidaBuena(random(1, 590), -10, chicken))
                break;
            case 3:
                goodFood.push(new ComidaBuena(random(1, 590), -10, carrot))
                break;
            case 4:
                goodFood.push(new ComidaBuena(random(1, 590), -10, salmon))
                break;
        
            default:
                break;
        }
        
    }
}

function paintFood() {
    
    if(badFood != null){
        for (let i = 0; i < badFood.length; i++) {
            badFood[i].draw();
            badFood[i].move();
            
        }
    }
    
    if(goodFood != null){
        for (let i = 0; i < goodFood.length; i++) {
            goodFood[i].draw();
            goodFood[i].move();
        }
    
    }

    
}

function paintDogBowl() {
    imageMode(CENTER);
    fill(255,255,255);
    //stroke(255);
    rectMode(CENTER);
    rect(character.x, 690,30,30);

    switch(moveStateX){
        case 'RIGHT':
            character.x += speed;
            break;
        case 'LEFT':
            character.x -= speed;
            break;
        default:
            break;
    }


    if (character.y >= 766) {
        character.y = 766;
    }

    if (character.x < 0) {
        character.x = 0;
    }

    if (character.x > 600) {
        character.x = 600;
    }

}

function removeFood() {

    
    for (let i = 0; i < badFood.length; i++) {
        if (badFood[i].getY > 770  == true) {
            badFood.shift(i);

        }
    }

    for (let i = 0; i < goodFood.length; i++) {
        
        if (goodFood[i].getY > 770 == true) {
            goodFood.shift(i);
        }
    }

    
}

function touchBadFood(){
    if (badFood.length > 0){
        for (let i = 0; i < badFood.length; i++) {
            let badFoodX = badFood[i].getX;
            let badFoodY = badFood[i].getY;
            if (dist(badFoodX, badFoodY, character.x, 690)<50) {
                console.log('Perdiste')
                badFood = [];
                goodFood = [];
                screenNum = 2;
            }
        }
    }
    
}

function touchGoodFood(){
    
    if (goodFood.length > 0){
       // console.log('funciono')
        for (let i = 0; i < goodFood.length; i++) {
            
            let goodFoodX = goodFood[i].getX;
            let goodFoodY = goodFood[i].getY;
            if (dist(goodFoodX, goodFoodY, character.x, 690)<50) {
                console.log('toca comida buena');
                goodFood.splice(i,1);
               puntos = puntos + 100;
            }
        }
    }
    
}

function paintPuntos(){
    fill(255);
    text('Puntuación '+puntos, 360, 50);
}

