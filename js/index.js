//1. Sound effects
const achuCumbia = new Audio("https://res.cloudinary.com/dyvopd0iz/video/upload/v1605394829/Corona%20Hunt/achuCumbia_tra3ts.mp3");
const gunshot = new Audio("https://res.cloudinary.com/dyvopd0iz/video/upload/v1605394828/Corona%20Hunt/gunshot_d6d2qr.mp3");
const soundLaugh = new Audio ("https://res.cloudinary.com/dyvopd0iz/video/upload/v1605394828/Corona%20Hunt/laugh_wlu8np.mp3");
const soundLevelUp = new Audio("https://res.cloudinary.com/dyvopd0iz/video/upload/v1605394828/Corona%20Hunt/nextLevel_cpfvdn.mp3");
const soundGameover = new Audio ("https://res.cloudinary.com/dyvopd0iz/video/upload/v1605394827/Corona%20Hunt/gameOver_iwyus4.mp3");

//2. Variables generales
const sceneBack = new Scene (0,0, canvas.width, canvas.height, "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394050/Corona%20Hunt/scene_back_osztnc.png")//Excena atras de Gatell
let virus1 = new Virus (vX*64, vY, .7,.7, 1, virus1Alive)//Virus nivel 1
let virus2 = new Virus (vX*64, vY, .3,.3, 2, virus2Alive) //Virus nivel 2

//Gatel sin animar 
// let gatell = new Gatell(gX, gY, 240,240, "../images/gatel.gif")

//Gatell Sprite
const gatell = new Character(); 

const sceneFront = new Scene (0,0,canvas.width,canvas.height,"https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394050/Corona%20Hunt/scene_front_j3ci7y.png")//Escena frente a Gatell 
let aim = new Aim(aX,aY, 1, "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394048/Corona%20Hunt/aim2_kxeu9k.png")
let gameOverImg = new Scene(222, 100, 376, 273, "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394049/Corona%20Hunt/gameOver_djgtkz.png");
let winnerImg = new Scene(222, 100, 321, 260, "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394050/Corona%20Hunt/winner_ly1ssx.png");

//3. Actualizar Escena fondo
updateScene = () => {
    // frames ++;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    sceneBack.draw();
    sceneFront.draw();
    // gameOverImg.draw();

    //Winner
    if(olaVirus.length <= 10 && score >= 15){
        winner();
        requestId2 = undefined;
    }

     //Game Over
    if((olaVirus.length >= 10 && score <= 15)){
        gameOver();
        requestId2 = undefined; 
    }

    aim.draw();

    if(!requestId1){
        return false; 
    }
    else{
        requestId1 = requestAnimationFrame(updateScene);
    }

}

//4. Actualizar juego
updateGame = () => {
    frames ++;
    ctx.clearRect(0,0,canvas.width, canvas.height);

    //Escena fondo
    sceneBack.draw();

    //Nivel 
    generateVirus();
    drawVirus();

    //Nivel 2
    // setTimeout(subirNivel, 15000);
    // subirNivel = () => {
    //     soundLevelUp.play();
    //     generateVirusMutation();
    //     drawVirusMutation();
    // }
    if(score === 8 || score === 12 || score === 16 || score === 20 || score === 25){
        soundLevelUp.play();
        generateVirusMutation();
        drawVirusMutation();
    }

    //Sprite
    gatell.draw();

    //Escena frente
    sceneFront.draw();

    //Puntero/mirilla
    aim.draw();

    //Score 
    printScore();

    if(!requestId2){
        return false;
    }
    else{
        requestId2 = requestAnimationFrame(updateGame);
    }
}

//Generar Ola de virus nivel 1
generateVirus = () => {
    let vX = Math.floor(Math.random()*13);
    let virus1 = new Virus (vX*64, vY, -2,2.5, 1, virus1Alive);
    if(frames % 60 == 0){
        // let virus1 = new Virus (vX*64, vY, -2,2, 1, virus1Alive);
    // Push virus 
    olaVirus = [...olaVirus,virus1]
    }
}
drawVirus = () => {
        olaVirus.forEach((virus1, index)=>{
            //Colisión
            if(virus1.collition(aim) && aim.shot){
                gunshot.play();
                score ++;
                virus1.shot = true;
                olaVirus.splice(index,1);
            }
                virus1.draw();
            })
}

//Generar Ola de virus nivel 2
generateVirusMutation = () => {
    let vX = Math.floor(Math.random()*9);
    if(frames % 60 == 0){
        let virus2 = new Virus (vX*64, vY, 1,1.5, 2, virus2Alive) //Virus nivel 2
    // Push more virus 
    olaVirus = [...olaVirus,virus2]
    }
}
drawVirusMutation = () => {
        olaVirus.forEach((virus2)=>{
            //Colisión 
            if(virus1.collition(aim) && aim.shot){
                gunshot.play();
                score ++;
                virus2.shot = true;
                olaVirus.splice(index,1);
            }
            virus2.draw();
        })
}

//5. Funciones del juego
startGame = () => {
    achuCumbia.play();
    requestId1 = requestAnimationFrame(updateScene)
    requestId2 = requestAnimationFrame(updateGame)
}

//Reiniciar el juego
// restart = () => {
//     ctx.clearRect(0,0,canvas.width, canvas.height);
//     olaVirus = [];
//     score = 0;
//     updateGame();
//     // window.requestAnimationFrame(updateGame);
// }

// Ganar el juego
winner = () => {
    achuCumbia.pause();
    soundLaugh.play();
    setTimeout(() => {
      soundLaugh.pause(); 
      requestId1 = undefined;  
    },1000);
    winnerImg.draw();
}

// Terminar el juego
gameOver = () => {
        achuCumbia.pause();
        soundGameover.play();
        setTimeout(() => {
            soundGameover.pause();  
            requestId1 = undefined;
          },2000);
        gameOverImg.draw();
        // requestId2 = undefined; 
}

//Imprimir resultado
printScore = () => {
    let i = document.getElementById("printScore");
    i.innerHTML = `virus caídos: ${score}`;
  }

//6. Inputs
//Boton start game 
// startBtn.addEventListener(`click`, (e)=>{
//     startGame ();
// });

//Botón restart game
// restartBtn.addEventListener(`click`, (e)=>{
//     frames ++;
//     ctx.clearRect(0,0,canvas.width, canvas.height);
//     startGame ();
// });

//Eventos disparo
//Mirilla siguien coordenadas del mouse en el canvas
canvas.addEventListener (`mousemove`, (e) => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    aim.updateAimPos(e)
});

//Agregar click al disparo
canvas.addEventListener (`mousedown`, (e) => {
    aim.shot = true;
});
canvas.addEventListener (`mouseup`, (e) => {
    aim.shot = false;
});

//Sprite
function drawSprite (img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

window.onload = () => {
    document.getElementById('start-button').onclick = () => {
        startGame();
    };
}

// window.onload = setInterval(gatell.draw(), 1000/10);



   
