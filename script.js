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
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,512,380);
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

let vidaImg = new Image();
vidaImg.src = "img/vida.png";
let visy = 0;
let vida;
vida = {
    sx:0,
    sy:24*visy,
    sw:512,
    sh:24,
    x:0,
    y:2,
    w:512,
    h:24,
}
function loadVida(){
    vida.sy = 24*visy;
    ctx.drawImage(vidaImg, vida.sx, vida.sy, vida.sw, vida.sh, vida.x, vida.y, vida.w, vida.h)
}

//score

let scoreImg = new Image();
scoreImg.src = "img/numeros.png";
let unidade = 0, dezena = 0, centena = 0;
let score = {
    sx:32,
    sy:0,
    sw:32,
    sh:32,
    x:396,
    y:48,
    w:32,
    h:32,
}
function loadScore (){
    if(unidade != 0 && unidade % 10 == 0){
        dezena++;
    }
    if(dezena != 0 && dezena % 10 == 0){
        centena++;
    }
    (unidade >= 10) ? unidade = 0 : unidade = unidade;
    (dezena >= 10) ? dezena = 0 : dezena = dezena;
    (centena >= 10) ? centena = 0 : centena = centena;

    ctx.globalAlpha = 0.6;
    ctx.drawImage(scoreImg, score.sx*unidade, score.sy, score.sw, score.sh, score.x+(score.w*2), score.y, score.w, score.h);
    ctx.drawImage(scoreImg, score.sx*dezena, score.sy, score.sw, score.sh, score.x+(score.w), score.y, score.w, score.h);
    ctx.drawImage(scoreImg, score.sx*centena, score.sy, score.sw, score.sh, score.x, score.y, score.w, score.h);
    ctx.globalAlpha = 1;
}

//gameOver

let gameOverStatus = false;
let gameOverImg = new Image();
gameOverImg.src = "img/gameOver.png";
function loadGameOver(){
    ctx.drawImage(gameOverImg, 0, 0, 1584, 1188, (512-280)/2, (380-210)/2-30, 280, 210);
}

//---------------------LOAD--------------------------//

let tempo, media, mx, my, cronometro, diferenca;
let reaOvo = false, pegou = false, diagonal = false;
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
            if(direcao <= 4){
                console.log(direcao)
                pegou = true;
            }
            else{
                diagonal = true;
            }
            somQuebrar.play();
        }
        if(reaOvo){
            realocarOvo();
            console.log(diagonal)
            if(!pegou){
                ovoX = ovo.x;
                ovoY = ovo.y;
                if(!diagonal){
                    avsx = 0;
                }
            }
            diagonal = false;
            loadOvo();
            calcOvo();
            reaOvo = false;
            ovsx = 0;
            if(pegou){
                if(visy >= 5){
                    visy -= 5;
                }
                else{
                    visy = 0;
                }
                tamanho++;  
                unidade++;  
                console.log(" - Pontuação: "+(tamanho-3))    
            }
            pegou = false;
        }
        loadMuro();
        loadAve();
        loadScore();
        loadVida();
    }

    //ave
    if(Date.now()-delayAve>=2/17*1000){
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
    if(gameOverStatus){
        loadGameOver();
    }
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
ctx.fillRect(0,0,512,380);
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
    if(jogo && visy <= 20 && direcao >= 1 && direcao <= 4){
        visy++;
        if(visy == 20){
            gameOver();
        }
    }
    
}

function gameOver (){
    console.log("Você perdeu!")
    jogo = false;
    botao.style.display = "block";
    somMusica.pause();  
    somGameOver.play();  
    gameOverStatus = true;
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
        gameOver();
    }
    if(jogo){
        body.forEach((item, i)=>{
            if(i!=0 && item.x==xx*16 && item.y==yy*16+variaY){
                gameOver();
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

/*let iphone;
iphone = setInterval(()=>{
    clearInterval(iphone);
    //divMain.requestFullscreen();
    if(preJogo){
        //somPreJogo.play();
        tempoPreJogo = Date.now();
        loopPreJogo();
        botao.style.display = "none";  
        botao.innerText = "Jogar Novamente";  
    }
}, 5000);*/

botao.addEventListener("click", ()=>{
    divMain.requestFullscreen();
    if(preJogo){
        somPreJogo.play();
        tempoPreJogo = Date.now();
        loopPreJogo();
        botao.style.display = "none";  
        botao.innerText = "Jogar Novamente";  
    }
    else{
        unidade = 0;
        dezena = 0;
        centena = 0;
        gameOverStatus = false;
        reaOvo = false;
        pegou = true;
        inicio = true;
        direcao = 0;
        ovsx = 0;
        visy = 0;
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
        //console.log("a = "+a)
        if(deltaX == 0 || deltaY == 0){
            if(deltaX == 0){
                if(deltaY > 0){if(direcao!=3){direcao=1}} else{if(direcao!=1){direcao=3}};
            }
            else if(deltaY == 0){
                if(deltaX > 0){if(direcao!=2){direcao=4}} else{if(direcao!=4){direcao=2}};
            }    
        }
        else{
            if(a > 0.4040 && a <= 4.3315){
                //console.log("eixo +XY");
                if(deltaY > 0){if(direcao!=7){direcao=5;velocidade=1}} else{if(direcao!=5){direcao=7;velocidade=1}};
            }
            else if(a < -0.4040 && a >= -4.3315){
                //console.log("eixo -XY");
                if(deltaY > 0){if(direcao!=8){direcao=6;velocidade=1}} else{if(direcao!=6){direcao=8;velocidade=1}};
            }
            else if(a <= 0.4040 && a >= -0.4040){
                //console.log("eixo X");
                if(deltaX > 0){if(direcao!=2){direcao=4;velocidade=0.65}} else{if(direcao!=4){direcao=2;velocidade=0.65}};
            }
            else if(a > 4.3315 || a < -4.3315){
                //console.log("eixo Y");
                if(deltaY > 0){if(direcao!=3){direcao=1;velocidade=0.65}} else{if(direcao!=1 && direcao!=0){direcao=3;velocidade=0.65}};
            }   
        }
    }
    if( ! preJogo && inicio && direcao != 0){
        console.log("começou");
        jogo = true;
        inicio = false;
        intervalVida = setInterval(vidaF, 1000);
        intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
    }
    //console.log(direcao);
    //console.log(velocidade);
}

//PC

let intervalCronometro;
let intervalVida;
window.addEventListener('keydown', (event)=>{
    if(event.key=='ArrowUp' && (event.key!='ArrowRight' || event.key!='ArrowLeft')){
        keys.ArrowUp = true;
        if( ! preJogo && inicio){
            console.log("começou");
            jogo = true;
            inicio = false;
            intervalVida = setInterval(vidaF, 1000);
            intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
        }
    }
    else if(event.key=='ArrowDown' && (event.key!='ArrowRight' || event.key!='ArrowLeft') && jogo==true){
        keys.ArrowDown = true;
    }
    else if(event.key=='ArrowLeft' && (event.key!='ArrowUp' || event.key!='ArrowDown')){
        keys.ArrowLeft = true;
        if( ! preJogo && inicio){
            console.log("começou");
            inicio = false;
            jogo = true;
            intervalVida = setInterval(vidaF, 1000);
            intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
        }
    }
    else if(event.key=='ArrowRight' && (event.key!='ArrowUp' || event.key!='ArrowDown')){
        keys.ArrowRight = true;
        if( ! preJogo && inicio){
            console.log("começou");
            inicio = false;
            jogo = true;
            intervalVida = setInterval(vidaF, 1000);
            intervalCronometro = setInterval(function(){cronometro += 0.125}, 125);
        }
    }
})