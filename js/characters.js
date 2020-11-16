//Generate Canvas 
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");

// Variables
    let frames = 0;
    let olaVirus = [];
    let score = 0; 
    let shot = false; 

    //Starting position VirusL1
    let vX = Math.floor(Math.random()*9)
    let vY = 500;
    //Starting position aim/mouse
    let aX = 385;
    let aY = 200;
    //Starting position Gatell
    let gX = 280;
    let gY = 180;

    //Images VirusL1 alive
    const virus1Alive = {
        first: "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_01_nqqk95.png",
        second:"https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_02_idfgwt.png"
    }
    //Images VirusL1 shot
    const virus1Shot = {
        first: "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_hit_01_wunvwp.png",
        second:"https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_hit_02_qq1eia.png"
    }
    //Images VirusL1 dead
    // const virus1Dead = {
    //     first: "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_falling_01_u3mpj7.png",
    //     second:"https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_falling_02_bcxfbj.png"
    // }
     //Images VirusL2 alive
     const virus2Alive = {
        first: "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/02_covid_01_jicmmd.png",
        second:"https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/02_covid_02_z84lnt.png"
     }
    //Images VirusL2 shot
     const virus2Shot = {
        first: "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394048/Corona%20Hunt/02_covid_hit_01_nj6x3j.png",
        second:"https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394048/Corona%20Hunt/02_covid_hit_02_h3eqwp.png"
    }
     //Images VirusL2 dead
    //  const virus2Dead = {
    //     first: "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394048/Corona%20Hunt/02_covid_falling_01_zzxmli.png",
    //     second:"https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/02_covid_falling_02_f0310l.png"
    //  }

//Objetos/clases
//Crear escena
class Scene{
    constructor(x,y,width,height,img){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = new Image();
        this.scene.src = img
    }
    draw (){
        ctx.drawImage(this.scene,this.x,this.y,this.width, this.height)
    }
}
//Crear un virus
class Virus {
    constructor(x,y, xSpeed,ySpeed, health,img){
        this.vX = x;
        this.vY = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed
        this.width = 80;
        this.height = 80;
        this.health = health; 
        this.shot = false;
        this.dead = false; 
        this.gravity = 10;
        this.gravitySpeed = 1;
        this.virus1 = new Image();
        this.virus1.src = img.first;//img.alive1
        this.virus2 = new Image();//img.alive2
        this.virus2.src = img.second;
        this.virus = this.virus1;
    }
    receiveDamage (){
        if ((this.shot === true)*2){
            this.dead =false;
        }
        else {
            this.shot = true;
            this.dead = true;
        }
    }
    collition (aim){
        return(
            this.vX < aim.x + aim.width &&
            this.vX + this.width > aim.x  &&
            this.vY < aim.y + aim.height &&
            this.vY + this.height > aim.y 
        )}
    move (){
        this.vX += this.xSpeed;
        this.vY += this.ySpeed;
        // Rebotar el virus si llega a los bordes
        if(this.vX < 0){
            this.xSpeed *= -1;
        }
        if(this.vX + this.width > canvas.width){
            this.xSpeed *= -1;
        }
        if(this.vY < 0){
            this.ySpeed *= -1;
        }
        if(this.vY > canvas.height){
            this.ySpeed *= -1;
        }
    }
    draw (){
        if (this.shot === true){
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.virus1.src = "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_hit_02_qq1eia.png"//img.shot1
            this.virus2.src ="https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394048/Corona%20Hunt/02_covid_hit_02_h3eqwp.png"//img.shot2
        }
        if (this.health <= 0){
            this.dead = true;
            this.xSpeed = 0;
            this.ySpeed = this.gravity;
            this.virus1.src = "https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394047/Corona%20Hunt/01_covid_hit_02_qq1eia.png"//img.dead1
            this.virus2.src ="https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394048/Corona%20Hunt/02_covid_hit_02_h3eqwp.png"//img.dead2
        }
        if (frames % 20 === 0){
            this.virus = this.virus === this.virus1 ? this.virus2 : this.virus1
        }
        ctx.drawImage(this.virus,this.vX,this.vY,this.width,this.height)
        this.move();

    }
}
//Crear un arma
class Aim {
    constructor (x, y, strenght, img){
        this.x = x;
        this.y = y; 
        this.width = 50;
        this.height = 50;
        this.strenght = strenght;
        this.aim = new Image();
        this.aim.src = img;
        this.shot = false; 
    }
    //Coordenadas del mouse y animación mirilla
    updateAimPos (evt) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        const mouseX = evt.clientX- rect.left - root.scrollLeft;
        const mouseY = evt.clientY - rect.top - root.scrollTop;
        this.x = mouseX;
        this.y = mouseY;
    }
    draw (){
        ctx.drawImage(this.aim,this.x,this.y,this.width, this.height)
    }
}

// Crear un Gatell
class Gatell extends Scene {
    draw (){
        ctx.drawImage(this.scene, this.x, this.y, this.width, this.height,)
    }
}

//Sprite
class Character {
    constructor (){
        this.x = 280;
        this.y = 190;
        this.width = 240;
        this.height = 240;
        this.frameX = 0;
        this.frameY = 0;
        this.image = new Image();
        this.image.src = `https://res.cloudinary.com/dyvopd0iz/image/upload/v1605394050/Corona%20Hunt/spriteGatell_k5ehud.png`; 
    }
    collition (aim){
        return(
            this.x < aim.x + aim.width &&
            this.x + this.width > aim.x  &&
            this.y < aim.y + aim.height &&
            this.y + this.height > aim.y 
        )}
    draw(){
        drawSprite(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        if (this.frameX < 6 && frames % 10 == 0){
            this.frameX++;
        }
        else if(this.frameX >= 6 && frames % 10 == 0){
            this.frameX = 0;
        }
    }
}

