class Score{
    x;
    y;
    text;
    constructor(x,y,text){
        this.x=x;
        this.y=y;
        this.text=text;
    }
    draw(){
        ctx.fillStyle="white";
        ctx.font="30px Arial";
        ctx.fillText(this.text,this.x,this.y);
    }
}

class Lives{
    x;
    y;
    width;
    height;
    text;
    constructor(x,y,width,height,text){
        this.x=x;
        this.y=y;
        this.width =width;
        this.height=height;
        this.text=text;
    }
    draw(){
        let img = new Image()
        img.src='img/heart-icon.png';
        img.onload=function(){
            ctx.drawImage(img,canvas.width-120,10,30,30);
        }
        ctx.drawImage(img,this.x,this.y,this.width,this.height);
        ctx.fillStyle="white";
        ctx.font="30px Arial";
        ctx.fillText(this.text,this.x+35,this.y+25);
    }
}

class Brick{
    width;
    height;
    x;
    y;
    color;
    constructor(x,y,width,height,color) {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color =color;
    }
}

class Ball{
    x;
    y;
    radius;
    dx;
    dy;
    constructor(x,y,radius,dx,dy){
        this.x=x;
        this.y=y;
        this.radius = radius;
        this.dx=dx;
        this.dy=dy;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle="#E13F33";
        ctx.fill();
    }
    update(id,bar,bricks){
        if(this.x-this.radius<0 || this.x+this.radius>canvas.width){
            wallHitSound.play();
            this.dx=-this.dx;
        }
        if(this.y-this.radius<0){
            wallHitSound.play();
            this.dy=-this.dy;
        }
        //Nen doi huong bong tuy` theo cho ma bong va cham vao thanh bar(vd ben trai thi bong nhay sang ben trai)
        // if(this.y+this.radius>=canvas.height-bar.height &&this.x>=bar.x && this.x<=bar.x+bar.width){
        //     this.dy=-this.dy;
        // }
        if(this.y+this.radius>bar.y &&this.x+this.radius>bar.x && this.x-this.radius<bar.x+bar.width){
            paddleHitSound.play();
            this.dy=-this.dy;
        }

        this.x+=this.dx
        this.y+=this.dy;
        this.draw();
        // Bong doi huong khi cham vao gach
        for(let i = 0;i<bricks.length;i++){
            for(let j=0;j<bricks[i].length;j++){
                let b = bricks[i][j];
                if(this.y+this.radius>b.y && this.y-this.radius<b.y+b.height
                    &&this.x+this.radius>b.x && this.x-this.radius<b.x + b.width){
                    brickHitSound.play();
                    this.dy=-this.dy;
                    b.x=0;
                    b.y=0;
                    b.width = 0;
                    b.height = 0;
                    firstScore++;
                    score.text = `Score: ${firstScore}`;
                    if(firstScore%5==0&&firstScore>0){
                        if(this.dx<0){
                            this.dx-=2;
                        }else{
                            this.dx+=2;
                        }
                    }

                }
            }
        }
        if(this.y+this.radius>canvas.height){
            lives--;
            live.text = `x ${lives}`;
            if(lives<=0){
                cancelAnimationFrame(id);
                menuSound.muted = true;
                loseGameSound.play();
                ctx.drawImage(loseImg,0,50,canvas.width,canvas.height);
            } else{
                lifeLostSound.play();
                bar.x = canvas.width/2-200;
                bar.y = canvas.height-20;
                ball.x = bar.x+(bar.width/2);
                ball.y= bar.y-10;
            }
        }
        let count = 0;
        for(let i = 0;i<bricks.length;i++){
            for(let j=0;j<bricks[i].length;j++){
                let b = bricks[i][j];
                if(b.x==0 && b.y==0){
                    count++
                }
            }
        }
        if(count==brickRow*brickCol){
            cancelAnimationFrame(id);
            menuSound.muted = true;
            winGameSound.play();
            ctx.drawImage(winImg,250,100,canvas.width*0.5,canvas.height*0.6);
        }
    }
}

class Bar{
    width;
    height;
    x;
    y;
    dx;
    constructor(x,y,width,height,dx){
        this.width = width;
        this.height = height;
        this.x=x;
        this.y=y;
        this.dx= dx;
    }
    draw(){
        ctx.fillStyle="#2D8BD5";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    moveLeft(){
        if(this.x>0){
            this.x-=this.dx;
        }
    }
    moveRight(){
        if(this.x+this.width<canvas.width){
            this.x+=this.dx;
        }
    }
}

function randomColor(){
    let colorList = ["#3D7350","#6A8C37","#8C3F3F"];
    let random = Math.floor(Math.random()*(2-0+1))+0;
    let color = colorList[random];
    return color;
}

function drawBrick(){
    for(let i = 0;i<bricks.length;i++){
        for(let j=0;j<bricks[i].length;j++){
            ctx.fillStyle=bricks[i][j].color;
            ctx.fillRect(bricks[i][j].x,bricks[i][j].y,bricks[i][j].width,bricks[i][j].height);
        }
    }
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let id = requestAnimationFrame(animate);
    bar.draw();
    ball.update(id,bar,bricks,score,live);
    drawBrick();
    score.draw();
    live.draw();
}

let wallHitSound = new Audio();
wallHitSound.src='sounds/wall_hit.mp3';
let paddleHitSound = new Audio();
paddleHitSound.src='sounds/paddle_hit.mp3';
let loseGameSound = new Audio();
loseGameSound.src='sounds/lose_game.mp3';
let lifeLostSound = new Audio();
lifeLostSound.src='sounds/life_lost.mp3';
let winGameSound = new Audio();
winGameSound.src='sounds/ez_money.mp3';
let brickHitSound = new Audio();
brickHitSound.src='sounds/brick_hit.mp3';
let menuSound = new Audio();
menuSound.src='sounds/menuMusic.mp4';

let canvas = document.getElementById("myCanvas");
canvas.width = innerWidth*3/4;
canvas.height = innerHeight-30;
let ctx = canvas.getContext("2d");

let loseImg = new Image();
loseImg.src='img/game_over.png';
let winImg = new Image();
winImg.src="img/winImg.png";

let firstScore = 0;
let lives = 3;
let bar = new Bar((canvas.width-200)/2,canvas.height-20,200,20,18);
let ball = new Ball(bar.x+(bar.width/2),bar.y-10,10,3,4);
let score = new Score(5,30,`Score: ${firstScore}`);
let live = new Lives(canvas.width-120,10,30,30,`x ${lives}`);
bar.draw();
ball.draw();
score.draw();
live.draw();

let bricks =[];
let brickWidth = 55;
let brickPaddingRight = 50;
let brickHeight = 20;
let brickPaddingBtm = 20;
let yBrick =50;
let brickRow = 6;
let brickCol =8;
for(let i = 0; i<brickRow;i++){
    let row = [];
    bricks.push(row);
    let xBrick = canvas.width*1/10;
    for(let j=0;j<brickCol;j++){
        let brick = new Brick (xBrick,yBrick,brickWidth,brickHeight,randomColor());
        row.push(brick);
        xBrick+=brickWidth+brickPaddingRight;
    }
    yBrick+=brickHeight+brickPaddingBtm;
}
drawBrick();
let imgBtn = document.getElementById("imgBtn");
imgBtn.addEventListener("click",function(){
    let imgSrc = imgBtn.getAttribute("src");
    if(imgSrc=='img/SOUND_ON.png'){
        imgBtn.setAttribute("src",'img/SOUND_OFF.png');
    }else{
        imgBtn.setAttribute("src",'img/SOUND_ON.png');
        }
    wallHitSound.muted ? wallHitSound.muted=false : wallHitSound.muted= true;
    paddleHitSound.muted ? paddleHitSound.muted=false : paddleHitSound.muted= true;
    loseGameSound.muted ? loseGameSound.muted=false : loseGameSound.muted= true;
    lifeLostSound.muted ? lifeLostSound.muted=false : lifeLostSound.muted= true;
    winGameSound.muted ? winGameSound.muted=false : winGameSound.muted= true;
    brickHitSound.muted ? brickHitSound.muted=false : brickHitSound.muted= true;
    menuSound.muted ? menuSound.muted=false : menuSound.muted= true;
    }
)

let resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click",function(){
    location.reload();
})
let rules = document.getElementById("rules")
let instructionBtn = document.getElementById("instructionBtn");
instructionBtn.addEventListener("click",function(){
    if(rules.style.visibility =="hidden"){
        rules.style.visibility= "visible";
    }else {
        rules.style.visibility ="hidden";
    }
})

let startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click",function(){
    startBtn.disabled = true;
    menuSound.play();
    menuSound.loop=true;
        addEventListener("keydown",function(event){
            switch(event.keyCode){
                case 37:
                    bar.moveLeft();
                    break;
                case 39:
                    bar.moveRight();
                    break;
            }
        })
        animate();
});
