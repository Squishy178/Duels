if (true){
    var keyCodesToKeys={//I would not touch this. I would also advise you not to use the control.
        "A":65,"B":66,"C":67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90,'0':96,'1':97,'2':98,'3':99,'4':100,'5':101,'6':102,'7':103,'8':104,'9':105,'SPACE':32,'ENTER':13,'SHIFT':16,'CONTROL':17,'ALT':18,'ESCAPE':27,'DELETE':46,'LEFT':37,'UP':38,'RIGHT':39,'DOWN':40,'BACKSPACE':8,'TAB':9,'F1':112,'F2':113,'F3':114,'F4':115,'F5':116,'F6':117,'F7':118,F8:'119',F9:120,'F10':121,'F11':122,'F12':123
    }
    var particles=[];
    var Game={
        mouse:{array:{}},
        key:{down:{},clicked:{},array:{}},
        canvas:{global:{},local:{}},
        collide:{},
        sample:{},
    };
    var prevDelta=Date.now();
    Game.deltaTime=Date.now();

    Game.key.array.down=[];//Which keys are held down at the moment. Would not call this function unless you know all the keycodes.
    Game.key.array.click=[];
    Game.key.array.release=[];

    Game.mouse.x=0;//Mouse X position
    Game.mouse.y=0;//Mouse Y position
    Game.mouse.down=false;//Detects if the mouse is held down
    Game.mouse.click=false;//Single frame instance, detecting the frame the the mouse clicks
    Game.mouse.release=false;//Single frame. Once released
    Game.mouse.movementX=0;//The x distance since the last frame
    Game.mouse.movementY=0;//The y distance since the last frame
    Game.mouse.previousX=0;//The previous x mouse position since the last frame. (little use, but used for the movement events)
    Game.mouse.previousY=0;//The previous y mouse position since the last frame. (little use, but used for the movement events)
    Game.mouse.array.clickLastX=0;
    Game.mouse.array.clickLastY=0;

    Game.randomDirection=function(){return Math.random()*Math.PI*2;}
    Game.quarterTurn=Math.PI/2;
    Game.randomInt=function(min,max){return min+Math.round(Math.random()*(max-min));}//Returns a random integer based on a minimum and maximum, and then rounded.
    Game.distance2D=function(x1,y1,x2,y2){return Math.sqrt((x1-x2)^2+(y1-y2)^2);}
    // Game.distance3D=function(x1,y1,z1,x2,y2,z2){return Math.sqrt((x1-x2)^2+(y1-y2)^2+(z1-z2)^2);}
    
    Game.directionFrom=function(x1,y1,x2,y2){return -Math.atan2((x1-x2),(y1-y2));}
    Game.chance=function(percent){return Math.random()<=percent/100;}
    Game.collide.rect2D=function(x1,y1,sx1,sy1,x2,y2,sx2,sy2){return(x1+sx1>x2 && x1-sx2<x2 && y1+sy1>y2 && y1-sy2<y2);}//Very useful!!
    // Game.collide.rect3D=function(x1,y1,z1,sx1,sy1,sz1,x2,y2,z2,sx2,sy2,sz2){return(x1+sx1>x2 && x1-sx2<x2 && y1+sy1>y2 && y1-sy2<y2 && z1+sz1>z2 && z1-sz2<z12);}//I doubt you will use 3 dimensional collision but you never know...
    Game.collide.circle2D=function(x1,y1,rad1,x2,y2,rad2){return Game.distance2D(x1,y1,x2,y2)<rad1+rad2}
    // Game.collide.circle3D=function(x1,y1,z1,rad1,x2,y2,z2,rad2){return Game.distance3D(x1,y1,z1,x2,y2,z2)<rad1+rad2}
    // Game.canvas.global.polygon=function(c,pos){//Pos is a list of x,y cords. Example, Game.canvas.polygon(ctx,[[0,0],[100,0],[50,-100]])
    //     c.beginPath();//c is the ctx. The canvas. Please use that for c
    //     pos=pos||[[0,0]];
    //     c.moveTo(Game.globalPos2Dx(pos[0][0]),Game.globalPos2Dy(pos[0][1]));
    //     for (var i = 1; i < pos.length-1; i++){
    //         c.lineTo(Game.globalPos2Dx(pos[i][0]),Game.globalPos2Dy(pos[i][1]));
    //     }
    //     c.fill()
    // }

    // Game.canvas.local.polygon=function(c,pos){//Pos is a list of x,y cords. Example, Game.canvas.polygon(ctx,[[0,0],[100,0],[50,-100]])
    //     c.beginPath();//c is the ctx. The canvas. Please use that for c

    //     c.moveTo(pos[0][0],pos[0][1]);
    //     for (var i = 1; i < pos.length-1; i++){
    //         c.moveTo(pos[i-1][0],pos[i-1][1]);
    //         c.lineTo(pos[i][0],pos[i][1]);
    //     }
    // }
    Game.key.pressed=function(keyName){//call if certain keys are being pressed or not.. Very very useful!
        if (!eval('keyCodesToKeys.'+keyName)){
            return (Game.key.array.down.includes(keyName));//Also can directly call keycodes, so if you need an extremly specific key above keycode 10, then sure! I would NOT recomend them however...
        }else{
            return (Game.key.array.down.includes(eval('keyCodesToKeys.'+keyName)));
        }
    }
    Game.key.release=function(keyName){//call if certain keys are being pressed or not.. Very very useful!
        if (!eval('keyCodesToKeys.'+keyName)){
            return (Game.key.array.release.includes(keyName));//Also can directly call keycodes, so if you need an extremly specific key above keycode 10, then sure! I would NOT recomend them however...
        }else{
            return (Game.key.array.release.includes(eval('keyCodesToKeys.'+keyName)));
        }
    }
    Game.key.click=function(keyName){//call if certain keys are being pressed or not.. Very very useful!
        if (!eval('keyCodesToKeys.'+keyName)){
            return (Game.key.array.click.includes(keyName));//Also can directly call keycodes, so if you need an extremly specific key above keycode 10, then sure! I would NOT recomend them however...
        }else{
            return (Game.key.array.click.includes(eval('keyCodesToKeys.'+keyName)));
        }
    }
    Game.canvas.opacity=function(c,opac){c.globalAlpha=opac;}

    document.addEventListener('mousemove', function(event) {
        Game.mouse.x = event.clientX; // Get the X coordinate
        Game.mouse.y = event.clientY; // Get the Y coordinate
        Game.mouse.movementX = Game.mouse.x-Game.mouse.previousX;
        Game.mouse.movementY = Game.mouse.y-Game.mouse.previousY;
        Game.mouse.previousX = Game.mouse.x;
        Game.mouse.previousY = Game.mouse.y;
    });
    addEventListener("mousedown", function(event){
        Game.mouse.down=true;
        Game.mouse.click=true;
        Game.mouse.array.clickLastX=Game.mouse.x;
        Game.mouse.array.clickLastY=Game.mouse.y;
    });
    addEventListener("mouseup", function(event){
        Game.mouse.down=false;
        Game.mouse.release=true;
    });
    window.addEventListener("keydown", function(e){//Detects if keys are being pressed.
        if (!Game.key.array.down[e.keyCode]) Game.key.array.click[e.keyCode] = e.keyCode;
        Game.key.array.down[e.keyCode] = e.keyCode;
        
        Game.key.array.release[e.keyCode] = false;
    },false);
    window.addEventListener('keyup',function(e){
        Game.key.array.down[e.keyCode] = false;
        Game.key.array.release[e.keyCode] = e.keyCode;
    },false);
    Game.mouse.clickArea=function(x1,y1,sx1,sy1){//Detects if the mouse clicked inside an area or not
        if (Game.mouse.click){
            // if (Game.collide.rect2D(x1,y1,sx1,sy1,Game.mouse.x,Game.mouse.y,1,1) || Game.collide.rect2D(x1,y1,sx1,sy1,Game.array.clickLastX,Game.mouse.array.clickLastY,1,1)){
            
            // }
            if (Game.mouse.x<x1+sx1 && Game.mouse.x>x1 && Game.mouse.y<y1+sy1 && Game.mouse.y>y1){
                return true;
            }
        }
        return false;
    }
    function updateGameSimple(){
        for (var i = 0; i < Game.key.array.release.length; i++){
            Game.key.array.release[i]=false;
        }
        for (var i = 0; i < Game.key.array.click.length; i++){
            Game.key.array.click[i]=false;
        }
        Game.mouse.release=false;
        Game.mouse.click=false;
        Game.deltaTime=(Date.now()-prevDelta)/1000;
        prevDelta=Date.now();
        // document.querySelector('#test').innerHTML=Game.deltaTime;
    }
}
const canvas = document.getElementById("canvas");


//------------------------------------------   PRELOADING -----------------------------
var loadedImages={};
function preloadImage(url){
    let img=new Image();
    img.src=url;
    loadedImages[url]=img;
}
function getImage(url) {
    return loadedImages[url];
}
function getSfx(url) {
    return loadedSfx[url];
}
const preloadImages=[  
    'player.png',
    'weapon0.png',  
];


var loadedSfx={};
const preloadSfxs=[
];
function preloadSfx(url){
    let aud=new Audio();
    aud.src=url;
    loadedSfx[url]=aud;
}
function playSfx(url) {
    loadedSfx[url].play();
}

var player={
    x:320,
    y:320,
    xv:0,
    yv:0,
    weapon:0,
    skin:0,
    rot:0,
    rotv:0,
    kbCD:0,
    bnCD:0,
    gdCD:0,
    guardDir:1,
};
var player2={
    x:0,
    y:0,
    xv:0,
    yv:0,
    weapon:0,
    skin:0,
    rot:0,
    rotv:0,
};
const weapons = [
    {
        name:'Sword',
        maxSpeed:0.25,
        speed:0.05,
        collision:[[0,0,100,100]],
        directionChange:1.5,
        visibleStats:{damage:5,speed:5,area:4,control:6,weight:5},
        guardSpeed:[1,1],
        knockbackGiven:3,
        knockbackTaken:3,
        guardMoveSpeed:0.33,
        guardSwingSpeed:0.5,
        parryFrame:[4],
        guardReduction:0.5,
        damage:5,
    },
    {
        name:'Broadsword',
    },
    {
        name:'Knife',
        maxSpeed:0.3,
        speed:0.1,
        collision:[[0,0,100,100]],
        directionChange:4,
        visibleStats:{damage:7,speed:7,area:2,control:6,weight:2},
        guardSpeed:[2.5,2],
        knockbackGiven:2,
        knockbackTaken:6,
        guardMoveSpeed:0.5,
        guardSwingSpeed:0.7,
        parryFrame:[4],
        guardReduction:0.7,
        damage:7,
    },
    {
        name:'Hammer',
        maxSpeed:0.5,
        speed:0.04,
        collision:[[0,0,100,100]],
        directionChange:0.5,
        visibleStats:{damage:8,speed:6,area:8,control:1,weight:9},
        guardSpeed:[1,0.5],
        knockbackGiven:8,
        knockbackTaken:2,
        guardMoveSpeed:0.2,
        guardSwingSpeed:0.33,
        parryFrame:[3],
        guardReduction:0.35,
        damage:8,
    },
    {
        name:'Shield',
    },
    {
        name:'Dual',
        maxSpeed:0.4,
        speed:0.09,
        collision:[[0,0,100,100]],
        directionChange:0.5,
        visibleStats:{damage:8,speed:6,area:8,control:1,weight:9},
        guardSpeed:[1,0.5],
        knockbackGiven:8,
        knockbackTaken:2,
        guardMoveSpeed:0.2,
        guardSwingSpeed:0.33,
        parryFrame:[3],
        guardReduction:0.35,
        damage:8,
    },
    {
        name:'Flail',
        maxSpeed:0.4,
        speed:0.09,
        collision:[[0,0,100,100]],
        directionChange:0.5,
        visibleStats:{damage:8,speed:6,area:8,control:1,weight:9},
        guardSpeed:[1,0.5],
        knockbackGiven:8,
        knockbackTaken:2,
        guardMoveSpeed:0.2,
        guardSwingSpeed:0.33,
        parryFrame:[3],
        guardReduction:0.35,
        damage:8,
    },



];
var enemies=[];
var keyBinds={
    player:{
        'LEFT':'A',
        'RIGHT':'D',
        'UP':'W',
        'DOWN':'S',
        'SWORDL':'LEFT',
        'SWORDR':'RIGHT',
        'GUARD':'UP',
    },
    player1:{
        'LEFT':'A',
        'RIGHT':'D',
        'UP':'W',
        'DOWN':'S',
        'SWORDL':'C',
        'SWORDR':'B',
    },
    player2:{
        'LEFT':'H',
        'RIGHT':'K',
        'UP':'U',
        'DOWN':'J',
        'SWORDL':'LEFT',
        'SWORDR':'RIGHT',
    },
    'MENU':'ENTER',
    'CANCEL':'ESCAPE',
};
function keyBind(key,maxPlayer,player){
    if (maxPlayer==1){
        return eval('keyBinds.player.'+key);
    }else if (maxPlayer==2){
        return eval('keyBinds.player'+player+'.'+key);
    }
}


//---------------------------------------------------- DRAW -----------------------------------
function draw(){
    if (canvas.getContext) {
        
        const ctx = canvas.getContext("2d");
        function pasteImg(image,x,y,sx,sy,rotation){
            ctx.save();
            ctx.translate(x+(sx/2), y+(sy/2)); // translate to rectangle center
            ctx.rotate(rotation);

            ctx.translate(-x-(sx/2),-y-(sy/2));
            ctx.drawImage(image,x, y,sx,sy);
            ctx.restore();
  
            
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.font = "20px serif";
        ctx.globalAlpha=1;
        //Player
        ctx.drawImage(getImage('player.png'),player.x,player.y,50,50);
        //Weapon
        pasteImg(getImage('weapon'+player.weapon+'.png'),
        player.x-25+50*Math.cos(player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
        player.y-25+50*Math.sin(player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
        100,100,
        player.rot+(player.gdCD*(Math.PI/(1.5*(player.guardDir)))/10));
        
        let movement = 1;
        let swing = 1;
        if (player.gdCD>0){
            movement *= weapons[player.weapon].guardMoveSpeed;
            swing *= weapons[player.weapon].guardSwingSpeed;
        }
        if (player.kbCD<1){
            if (Game.key.pressed(keyBind('RIGHT',1,1)) && player.xv<6*movement){
                player.xv+=movement*0.4*((player.xv<0?1.5:1));
            }
            if (Game.key.pressed(keyBind('LEFT',1,1)) && player.xv>-6*movement){
                player.xv-=movement*0.4*((player.xv>0?1.5:1));
            }
            if (Game.key.pressed(keyBind('DOWN',1,1))  && player.yv<6*movement){
                player.yv+=movement*0.4*((player.xv<0?1.5:1));
            }
            if (Game.key.pressed(keyBind('UP',1,1))  && player.yv>-6*movement){
                player.yv-=movement*0.4*((player.xv>0?1.5:1));
            }
        }
        player.x += player.xv * Game.deltaTime * 40;
        player.y += player.yv * Game.deltaTime * 40;
        player.rot += player.rotv * Game.deltaTime * 40;

        

        if (Game.key.pressed(keyBind('SWORDR',1,1)) && player.rotv<0.25 * swing){
            if (player.rotv<0) swing *= weapons[player.weapon].directionChange;
            if (player.gdCD==0) player.guardDir=1
            player.rotv+=0.05 * swing;
        }
        if (Game.key.pressed(keyBind('SWORDL',1,1)) && player.rotv>-0.25 * swing){
            if (player.rotv>0) swing *= weapons[player.weapon].directionChange;
            if (player.gdCD==0) player.guardDir=-1
            player.rotv-=0.05 * swing;
        }
        if (Game.key.pressed(keyBind('GUARD',1,1))){
            
            player.gdCD+=weapons[player.weapon].guardSpeed[0];
            
            if (player.gdCD>8) player.gdCD=8;
        }
        
        if (Game.collide.rect2D(player.x-25+50*Math.cos(player.rot),player.y-25+50*Math.sin(player.rot),100,100,640,0,1,640)){
            player.x-=player.xv * Game.deltaTime * 40;
            player.xv=-10*(0.2+Math.abs(player.rotv));
            player.kbCD=10;
            player.rot-=player.rotv * Game.deltaTime * 40;
            player.rotv=0;
        }

        if (Game.collide.rect2D(player.x-25+50*Math.cos(player.rot),player.y-25+50*Math.sin(player.rot),100,100,0,0,1,640)){
            player.x-=player.xv * Game.deltaTime * 40;
            player.xv=10*(Math.abs(player.rotv));
            player.kbCD=10;
            player.rot-=player.rotv * Game.deltaTime * 40;
            player.rotv=0;
        }
        if (Game.collide.rect2D(player.x-25+50*Math.cos(player.rot),player.y-25+50*Math.sin(player.rot),100,100,0,0,640,1)){
            player.y-=player.yv * Game.deltaTime * 40;
            player.yv=10*(Math.abs(player.rotv));
            player.kbCD=10;
            player.rot-=player.rotv * Game.deltaTime * 40;
            player.rotv=0;
        }
        if (Game.collide.rect2D(player.x-25+50*Math.cos(player.rot),player.y-25+50*Math.sin(player.rot),100,100,0,639,640,640)){
            player.y-=player.yv * Game.deltaTime * 40;
            player.yv=-10*(Math.abs(player.rotv));
            player.kbCD=10;
            player.rot-=player.rotv * Game.deltaTime * 40;
            player.rotv=0;
        }
        if (true){
            ctx.globalAlpha = 0.3;//Render collision Boxes
            ctx.fillRect(player.x+25+50*Math.cos(player.rot),player.y+50*Math.sin(player.rot),25,25);
        }

        if (player.x>640-50){//Level bounds
            player.x=640-50;
            player.xv=0;
        }
        if (player.x<0){
            player.x=0;
            player.xv=0;
        }
        if (player.y>640-50){
            player.y=640-50;
            player.yv=0;
        }
        if (player.y<0){
            player.y=0;
            player.yv=0;
        }

        if (Game.key.pressed(keyBind('RIGHT',1,1)) || Game.key.pressed(keyBind('LEFT',1,1))){}else{
            player.xv*=0.9;
        }
        if (Game.key.pressed(keyBind('UP',1,1)) || Game.key.pressed(keyBind('DOWN',1,1))){}else{
            player.yv*=0.9;
        }
        if (Game.key.pressed(keyBind('SWORDL',1,1)) || Game.key.pressed(keyBind('SWORDR',1,1))){}else{
            player.rotv*=0.9;
        }
        if (player.kbCD>0) player.kbCD--;
        if (player.bnCD>0) player.bnCD--;
        if (player.gdCD>0 && !Game.key.pressed(keyBind('GUARD',1,1))) player.gdCD-=weapons[player.weapon].guardSpeed[1];
        if (player.gdCD<0) player.gdCD=0;
        
        

    }
}

function tick(){
    draw();
    updateGameSimple();

}

for (var i = 0; i < preloadImages.length; i++){
    preloadImage(preloadImages[i]);
}
for (var i = 0; i < preloadSfxs.length; i++){
    preloadSfx(preloadSfxs[i]);
}





setInterval(tick,1000/60);