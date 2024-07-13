//---------------------HEADER--------------------------//

const canvas = document.querySelector("#tela");
let ctx = canvas.getContext("2d");
canvas.width = 512
canvas.height = 380
let somQuebrar = document.querySelector("#quebrar");
let somMusica = document.querySelector("#musica");
let somPreJogo = document.querySelector("#preJogo");
let somGameOver = document.querySelector("#gameOver");
let somPintinho = document.querySelector("#pintinho");
let logo = document.querySelector("#logo");
let botao = document.querySelector("#jogar");
let gameOver = document.querySelector("#gameOverImg");
let divMain;

//---------------------ENTIDADES--------------------------//

//tela

let width = 30;
let height = 20;
let tela ={
    w:width*16,
    h:height*16,
}

function ajusteTela (){
    divMain = document.querySelector("main");
    if(divMain.clientHeight/divMain.clientWidth < 0.7421875){
        canvas.style.height = "100vmin";
    }
    else{
        canvas.style.height = "calc(100vmin*0.7421875)";
    }
    requestAnimationFrame(ajusteTela);
}ajusteTela();

// background

let variaY = 28;
let bg;
let bg2;
let map = new Image();
map.src = "img/bg.png";

function loadbg(){
    bg = {
        x:0,
        y:0,
        w:512,
        h:128
    }
    bg2 = {
        sx:0,
        sy:0,
        sw:tela.w,
        sh:tela.h,
        x:0+16,
        y:variaY+16,
        w:tela.w,
        h:tela.h
    }
    ctx.fillStyle = "#343434"
    ctx.fillRect(bg.x, bg.y, bg.w, bg.h)
    ctx.drawImage(map, bg2.sx, bg2.sy, bg2.sw, bg2.sh, bg2.x, bg2.y, bg2.w, bg2.h)  
}

//muro

let muro;
let muroImg = new Image();
muroImg.src="img/muro.png";

function loadMuro(){
    muro = {
        sx:0,
        sy:0,
        sw:512,
        sh:352,
        x:0,
        y:variaY,
        w:512,
        h:352
    }
    ctx.drawImage(muroImg, muro.sx, muro.sy, muro.sw, muro.sh, muro.x, muro.y, muro.w, muro.h)        
}

//snake

let tamanho = 3;
let xx = 5, yy = 12;
let casx=0, casy=0;
let body = [];
let snake;
let cabeca = new Image();
cabeca.src="img/cabeca1.png";
let corpoimg = new Image();
corpoimg.src="img/corpo.png";

for(let n=0; n<3; n++){
    snake = {
        sx:casx,
        sy:casy,
        sw:16,
        sh:16,
        x:xx*16,
        y:(yy+n)*16+variaY,
        w:16,
        h:16
    }
    body[n] = snake;    
}

function loadsnake(){
    for(let i=tamanho-1; i>0; i--){
        snake = {
            sx:body[i-1].sx,
            sy:body[i-1].sy,
            sw:16,
            sh:16,
            x:body[i-1].x,
            y:body[i-1].y,
            h:16,
            w:16,
        }
        body[i] = snake;   
    }
    andar();
    overflow(xx, yy);
    snake = {
        sx:casx,
        sy:casy,
        sw:16,
        sh:16,
        x:xx*16,
        y:yy*16+variaY,
        w:16,
        h:16
    }
    body[0] = snake;
}

function desenhaSnake(i){
    if(i==0){
        ctx.drawImage(cabeca, body[i].sx, body[i].sy, body[i].sw, body[i].sh, body[i].x, body[i].y, body[i].w, body[i].h)    
    }
    else{
        ctx.drawImage(corpoimg, body[i].sx, body[i].sy, body[i].sw, body[i].sh, body[i].x, body[i].y, body[i].w, body[i].h)    
    }
}

//ovo

let num = ale(0, (width-1));
let num2 = ale(0, (height-1));
let ovsy=0, ovsx=0;
let ovo;
let ovoimg = new Image();
ovoimg.src="img/ovo.png";

function loadOvo(){
    ovo = {
        sx:ovsx,
        sy:ovsy,
        sw:16,
        sh:16,
        x:num*16,
        y:num2*16+variaY,
        h:16,
        w:16
    }   
    ctx.drawImage(ovoimg, ovo.sx, ovo.sy, ovo.sw, ovo.sh, ovo.x, ovo.y, ovo.w, ovo.h) 
}
realocarOvo();

//ave

let avsx = 0, avsy = 0;
let ovoX = -100, ovoY = 0;
let aveImg = new Image();
aveImg.src = "img/x.png";
let ave;

function loadAve (){
    ave = {
        sx:avsx,
        sy:avsy,
        sw:480,
        sh:64,
        x:ovoX,
        y:ovoY-48,
        w:480,
        h:64
    }
    ctx.drawImage(aveImg, ave.sx, ave.sy, ave.sw, ave.sh, ave.x, ave.y, ave.w, ave.h,)
}

//vida

let vida;
vida = {
    x:0,
    y:2,
    w:512,
    h:24,
    vx:1,
    vy:3,
    vw:510,
    vh:22,
    fvx:1,
    fvy:3,
    fvw:510,
    fvh:22
}
function loadVida(){
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(vida.x, vida.y, vida.w, vida.h);
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fillRect(vida.fvx, vida.fvy, vida.fvw, vida.fvh)
    ctx.fillStyle = "rgb(0,150,10)";
    ctx.fillRect(vida.vx, vida.vy, vida.vw, vida.vh)
}

//score

let pontos = "";
let score = {
    nx:440,
    ny:72,
    font:"32px serif"
}
function loadScore (){
    if(tamanho-3<10){
        pontos += "00";
    }
    else if(tamanho-3<100){
        pontos += "0";
    }
    pontos += tamanho-3;
    ctx.font = score.font;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText(pontos, score.nx, score.ny);
    pontos = "";
}

//---------------------LOAD--------------------------//

let tempo, media, mx, my, cronometro, diferenca;
let reaOvo = false, pegou = true;
let jogo = false;
let inicio = true;
let delayJogo = Date.now();
let delayOvo = Date.now();
let delayAve = Date.now();
let velocidade = 1;

function loop () {
    if(jogo){
        somMusica.play();    
    }  
    if(cronometro > tempo){
        reaOvo = true;
        pegou = false;
    }
    if(Date.now()-delayJogo>=velocidade*200){
        if(jogo){
            ObterDirecao();    
        }
        loadbg();
        loadOvo();
        for(let i=0; i<body.length; i++){
            desenhaSnake(i)
        }  

        //reajuste
        delayJogo=Date.now();   
        keys.ArrowUp = false,
        keys.ArrowLeft = false,
        keys.ArrowRight = false,
        keys.ArrowDown = false
        

        //pegar ovo
        if(body[0].x == ovo.x && body[0].y == ovo.y && ! reaOvo){
            reaOvo = true;
            pegou = true;
            somQuebrar.play();
        }
        if(reaOvo){
            realocarOvo();
            if(!pegou){
                ovoX = ovo.x;
                ovoY = ovo.y;
                avsx = 0;
            }
            loadOvo();
            calcOvo();
            reaOvo = false;
            ovsx = 0;
            if(pegou){
                if(vida.vw < (vida.w-2)*3/4){
                    vida.vw += (vida.w-2)/4;
                }
                else{
                    vida.vw = vida.w-2;
                }
                tamanho++;    
                console.log(" - Pontuação: "+(tamanho-3))    
            }
        }
        loadMuro();
        loadAve();
        loadScore();
        loadVida();
    }

    //ave
    if(Date.now()-delayAve>=2/17*1000 && ! inicio){
        if(avsx == 0 && tamanho > 3 && jogo){
            somPintinho.play();
        }
        avsx += 480;
        delayAve = Date.now();
    }

    //ovo
    if(tempo-cronometro<2){
        if(diferenca == 0){
            diferenca = tempo-cronometro;
        }
        if((Date.now()-delayOvo)>=(diferenca/8)*1000){
            delayOvo = Date.now();
            if(ovsx!=112){
                ovsx += 16;
            }
        }
    }
    //gameOver
    
    requestAnimationFrame(loop);     
}

let preJogo = true;
let tempoPreJogo = Date.now();
let logoImg = new Image();
logoImg.src = "./img/logo.png";
let gifImg = new Image();
gifImg.src = "./img/gif.png";

loadVida();
ctx.fillStyle = "rgb(0,0,0)";
ctx.fillRect(0,28,512,352);
function loopPreJogo (){
    loadVida();
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,28,512,352);
    if(Date.now()-tempoPreJogo < 1700 && Date.now()-tempoPreJogo > 700){
        ctx.drawImage(gifImg, 0, 0, 512, 352, ((512-96)/2), (28+((352-66)/2)), 96, 66)
    }
    if(Date.now()-tempoPreJogo > 1700){
        ctx.drawImage(logoImg, 0, 0, 500, 500, ((512-192)/2), (14+((352-192)/2)), 192, 192)
    }
    if(Date.now()-tempoPreJogo > 3000){
        logo.style.opacity = "0.35";
        loop();
        preJogo = false;
        tempoPreJogo = 0;
    }
    if(preJogo){
        requestAnimationFrame(loopPreJogo);    
    }
}

//---------------------FUNÇÕES--------------------------//

function vidaF (){
    if(jogo && vida.vw>0){
        vida.vw -= (vida.w-2)/20;
        if(vida.vw <= 0){
            jogo = false;
            botao.style.display = "block";
            gameOver.style.display = "block";
            somMusica.pause();  
            somGameOver.play();  
        }
    }
}

function realocarOvo(){
    do{
         posicaoovo = true;
         num = ale(0, (width-1));
         num2 = ale(0, (height-1));
         body.forEach((item)=>{
             if(item.x==num*16 && item.y==num2*16+variaY){
                 posicaoovo = false;
                 console.log("Ovo Realocado!")
             }
         });
     }while(!posicaoovo); 
 }

function calcOvo(){
    mx = ovo.x - body[0].x;
    my = ovo.y - body[0].y;
    media = (my * my)+(mx * mx);
    media = Math.sqrt(media);
    media /= 16;
    tempo = media/(1000/(0.65*200));//1=velocidade
    tempo = tempo*2;
    cronometro = 0;
    diferenca = 0;
}

function ale(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min+1;
}

function overflow (xx, yy){
    if(xx-1<0 || xx-1>(width-1) || yy-1<0 || yy-1>(height-1)){
        console.log("Você perdeu!")
        jogo=false;
        botao.style.display = "block";
        gameOver.style.display = "block";
        somMusica.pause();
        somGameOver.play();  
    }
    if(jogo){
        body.forEach((item, i)=>{
            if(i!=0 && item.x==xx*16 && item.y==yy*16+variaY){
                jogo=false;
                botao.style.display = "block";
                gameOver.style.display = "block";
                somMusica.pause();
                somGameOver.play();  
                console.log("Você perdeu!");
            }
        });
    }
}

let direcao = 0;
function ObterDirecao(){
    if(keys.ArrowUp==true){
        if(keys.ArrowRight && !keys.ArrowLeft && direcao!=7){
            direcao = 5;
            velocidade=1;
        }
        else if(keys.ArrowLeft && direcao!=8){
            direcao = 6;
            velocidade=1;
        }
        else if(direcao!=3){
            direcao = 1;   
            velocidade=0.65; 
        }
    }
    else if(keys.ArrowDown==true){
        if(keys.ArrowRight && !keys.ArrowLeft && direcao!=6){
            direcao = 8;
            velocidade=1;
        }
        else if(keys.ArrowLeft && direcao!=5){
            direcao = 7;
            velocidade=1;
        }
        else if(direcao!=1){
            direcao = 3;  
            velocidade=0.65;  
        }
    }
    else if(keys.ArrowRight==true && direcao!=2){
        direcao = 4;
        velocidade=0.65;
    }
    else if(keys.ArrowLeft==true && direcao!=4){
        direcao = 2;
        velocidade=0.65;
    }
    loadsnake();       
}

function andar(){
    switch(direcao){
        case 1:
            yy--;
            casx=(direcao-1)*16;
            break;
        case 2:
            xx--;
            casx=(direcao-1)*16;
            break;
        case 3:
            yy++;
            casx=(direcao-1)*16;
            break;
        case 4:
            xx++;
            casx=(direcao-1)*16;
            break;
        case 5:
            yy--;
            xx++;
            casx=(direcao-1)*16;
            break;
        case 6:
            yy--;
            xx--;
            casx=(direcao-1)*16;
            break;
        case 7:
            yy++;
            xx--;
            casx=(direcao-1)*16;
            break;
        case 8:
            xx++
            yy++
            casx=(direcao-1)*16;
            break;
    }
}

//---------------------KEYS--------------------------//

botao.addEventListener("click", ()=>{
    if(preJogo){
        somPreJogo.play();
        tempoPreJogo = Date.now();
        loopPreJogo();
        botao.style.display = "none";  
        botao.innerText = "Jogar Novamente";  
    }
    else{
        reaOvo = false;
        pegou = true;
        inicio = true;
        direcao = 0;
        ovsx = 0;
        vida = {
            x:0,
            y:2,
            w:512,
            h:24,
            vx:1,
            vy:3,
            vw:510,
            vh:22,
            fvx:1,
            fvy:3,
            fvw:510,
            fvh:22
        }
        tamanho = 3;
        xx = 5;
        yy = 12;
        casx = 0;
        casy = 0;
        body = [];
        for(let n=0; n<3; n++){
            snake = {
                sx:casx,
                sy:casy,
                sw:16,
                sh:16,
                x:xx*16,
                y:(yy+n)*16+variaY,
                w:16,
                h:16
            }
            body[n] = snake;    
        }
        clearInterval(intervalCronometro);
        clearInterval(intervalVida);
        botao.style.display = "none";  
        gameOver.style.display = "none";  
    }
});

let keys = {
    ArrowUp:false,
    ArrowLeft:false,
    ArrowRight:false,
    ArrowDown:false,
}

//celular
let startDedoX, startDedoY;
divMain.addEventListener('touchstart', (event) =>{
    startDedoX = event.touches[0].clientX;
    startDedoY = event.touches[0].clientY;
    //console.log("\nSX -> "+startDedoX);
    //console.log("SY -> "+startDedoY);
});

let endDedoX, endDedoY;
/*divMain.addEventListener('touchmove', (event) =>{
    endDedoX = event.changedTouches[0].clientX;
    endDedoY = event.changedTouches[0].clientY;
    console.log("MEX -> "+endDedoX);
    console.log("MEY -> "+endDedoY);
    direcaoCelular();
});*/

divMain.addEventListener('touchend', (event) =>{
    endDedoX = event.changedTouches[0].clientX;
    endDedoY = event.changedTouches[0].clientY;
    //console.log("EX -> "+endDedoX);
    //console.log("EY -> "+endDedoY);
    direcaoCelular();
});

const minimoDeslocamento = 10;
let deltaX, deltaY;
let a;
function direcaoCelular(){
    deltaX = endDedoX - startDedoX;
    deltaY = endDedoY - startDedoY;
    deltaY = -1*deltaY;
    //console.log("DX = "+deltaX);
    //console.log("DY = "+deltaY);
    if((deltaX >= minimoDeslocamento || deltaX <= -minimoDeslocamento) || (deltaY >= minimoDeslocamento || deltaY <= -minimoDeslocamento)){
        // SX SY 1 SX SY
        // EX EY 1 EX EY
        // X  Y  1 X  Y 
        a = deltaY / deltaX;
        console.log("a = "+a)
        if(deltaX == 0 || deltaY == 0){
            if(deltaX == 0){
                (deltaY > 0) ? direcao = 1 : direcao = 3;
            }
            else if(deltaY == 0){
                (deltaX > 0) ? direcao = 4 : direcao = 2;
            }    
        }
        else{
            if(a > 0.4040 && a <= 4.3315){
                (deltaY > 0) ? direcao = 5 : direcao = 7;
            }
            else if(a < -0.4040 && a >= -4.3315){
                (deltaY > 0) ? direcao = 6 : direcao = 8;
            }
            else if(a <= 0.4040 && a >= -0.4040){
                (deltaX > 0) ? direcao = 4 : direcao = 2;
            }
            else if(a > 4.3315 || a < -4.3315){
                (deltaY > 0) ? direcao = 1 : direcao = 3;
            }   
        }
    }
    console.log(direcao);
}

//PC

let intervalCronometro;
let intervalVida;
window.addEventListener('keydown', (event)=>{
    if(event.key=='ArrowUp' && (event.key!='ArrowRight' || event.key!='ArrowLeft')){
        keys.ArrowUp = true;
        if( ! preJogo && inicio){
            jogo = true;
            inicio = false;
            intervalVida = setInterval(vidaF, 1000);
            intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
        }
    }
    else if(event.key=='ArrowDown' && (event.key!='ArrowRight' || event.key!='ArrowLeft') && jogo==true){
        keys.ArrowDown = true;
        if( ! preJogo  && inicio){
            inicio = false;
            jogo = true;
            intervalVida = setInterval(vidaF, 1000);
            intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
        }
    }
    else if(event.key=='ArrowLeft' && (event.key!='ArrowUp' || event.key!='ArrowDown')){
        keys.ArrowLeft = true;
        if( ! preJogo && inicio){
            inicio = false;
            jogo = true;
            intervalVida = setInterval(vidaF, 1000);
            intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
        }
    }
    else if(event.key=='ArrowRight' && (event.key!='ArrowUp' || event.key!='ArrowDown')){
        keys.ArrowRight = true;
        if( ! preJogo && inicio){
            inicio = false;
            jogo = true;
            intervalVida = setInterval(vidaF, 1000);
            intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
        }
    }
})