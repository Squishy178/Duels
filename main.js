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
    Game.deltaTime=0;

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
    'img/player.png',
    'img/weapon0.png', 
    'img/weapon1.png',
    'img/weapon2.png',
    'img/weapon3.png',
    'img/weapon4.png',
    'img/weapon5.png',
    'img/weapon6.png',
    'img/weapon7.png',
    'img/enemy.png', 
    'img/shadow.png',
    'img/healthbarGreen.png',
    'img/healthbarRed.png',
    'img/healthbarWhite.png',
    'img/costume/costume0-0.png',
    'img/costume/costume0-1.png',
    'img/costume/costume1-0.png',
    'img/costume/costume1-1.png',

];
var levelState = {
    score:0,
    stage:0,
    time:0,
    freezeFrame:0,
}

var loadedSfx={};
const preloadSfxs=[
    //Insert SFX
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
    blockCD:0,
    health:25,
    maxHealth:25,
    iframe:0,
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
var enemies = [];
//Sword, Knife, Hammer, *Flail*, Double, Shield, *Whip*, Spear, *Gun*

//Sword: Medium Stats  ***
//Knife: Fast and dangerous  ***
//Hammer: Heavy and slow  ***

//Double: bladestorm!!  ***
//Shield: Excellent Guarding  ***
//Spear: Tiny point of great damage  ***

//<> Flail: Delayed attacks
//<> Whip: Dynamic range and damage
//<> Pistol: Insane damage and Range  ***

//<> Scythe: One side damage, One side guarding
//Axe: Lots of damage, but prone to attacks  ***
//Lance: Lots of damage when stabbing and high pushback  ***
const weapons = [
    {
        name:'Sword',
        maxSpeed:0.17,
        speed:0.015,//Collision boxes. Distance from player, Box size, and if they hurt. 
        collision:[[50,30,false],[70,20,true],[90,18,true]],
        directionChange:2,
        visibleStats:{damage:5,speed:5,area:4,control:6,weight:5,guard:6},
        guardSpeed:[1,1],
        knockbackGiven:1,
        knockbackTaken:1,
        guardMoveSpeed:0.33,
        guardSwingSpeed:0.5,
        parryFrame:[4],
        guardReduction:0.5,
        damage:5,
        variants:[],
    },
    {
        name:'Knife',
        maxSpeed:0.2,
        speed:0.03,
        collision:[[50,30,false],[75,15,true]],
        directionChange:4,
        visibleStats:{damage:7,speed:7,area:2,control:6,weight:2,guard:3},
        guardSpeed:[2,2],
        knockbackGiven:0.4,
        knockbackTaken:1.2,
        guardMoveSpeed:0.5,
        guardSwingSpeed:0.7,
        parryFrame:[4],
        guardReduction:0.7,
        damage:7,
        variants:[],
    },
    {
        name:'Hammer',
        maxSpeed:0.25,
        speed:0.01,
        collision:[[45,15,false],[60,15,false],[85,40,true]],
        directionChange:0.5,
        visibleStats:{damage:8,speed:6,area:8,control:1,weight:9,guard:2},
        guardSpeed:[0.5,0.25],
        knockbackGiven:2,
        knockbackTaken:0.6,
        guardMoveSpeed:0.2,
        guardSwingSpeed:0.33,
        parryFrame:[3],
        guardReduction:0.4,
        damage:8,
    },
    {
        name:'Shield',
        maxSpeed:0.19,
        speed:0.04,
        collision:[[50,40,true]],
        directionChange:0.5,
        visibleStats:{damage:1,speed:7,area:2,control:7,weight:8,guard:10},
        guardSpeed:[2,2],
        knockbackGiven:0.8,
        knockbackTaken:0.1,
        guardMoveSpeed:1,
        guardSwingSpeed:1.25,
        parryFrame:[2,4],
        guardReduction:3,
        damage:1.5,
        variants:[],
    },
    {
        name:'Double',
        maxSpeed:0.25,
        speed:0.01,
        collision:[[50,35,false],[70,20,true],[90,18,true],[-50,35,false],[-70,20,true],[90,18,true]],
        directionChange:0.4,
        visibleStats:{damage:5,speed:5,area:4,control:6,weight:5,guard:8},
        guardSpeed:[0.75,0.75],
        knockbackGiven:1,
        knockbackTaken:0.2,
        guardMoveSpeed:0.33,
        guardSwingSpeed:0.5,
        parryFrame:[4],
        guardReduction:0.65,
        damage:3,
        variants:[],
    },
    {
        name:'Lance',
        maxSpeed:0.1,
        speed:0.005,
        collision:[[50,35,false],[70,20,true],[90,18,true],[110,15,true]],
        directionChange:0.5,
        visibleStats:{damage:8,speed:2,area:8,control:3,weight:9,guard:3},
        guardSpeed:[1,0.5],
        knockbackGiven:8,
        knockbackTaken:2,
        guardMoveSpeed:0.2,
        guardSwingSpeed:0.33,
        parryFrame:[3],
        guardReduction:0.35,
        damage:8,
        variants:[],
    },
    {
        name:'Axe',//Needs update
        maxSpeed:0.15,
        speed:0.015,
        collision:[[45,15,false],[60,15,false],[80,40,true]],
        directionChange:0.5,
        visibleStats:{damage:9,speed:4,area:6,control:3,weight:7,guard:5},
        guardSpeed:[1,0.75],
        knockbackGiven:8,
        knockbackTaken:2,
        guardMoveSpeed:0.2,
        guardSwingSpeed:0.33,
        parryFrame:[3],
        guardReduction:0.35,
        damage:9,
        variants:[],
    },
    {
        name:'Spear',//Needs update
        maxSpeed:0.1,
        speed:0.01,
        collision:[[45,15,false],[60,15,false],[75,15,false],[100,20,true],[115,15,true]],
        directionChange:0.5,
        visibleStats:{damage:6,speed:5,area:2,control:4,weight:2,guard:4},
        guardSpeed:[1.5,0.5],
        knockbackGiven:2,
        knockbackTaken:0.6,
        guardMoveSpeed:0.2,
        guardSwingSpeed:0.33,
        parryFrame:[3],
        guardReduction:0.4,
        damage:6,
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
function newEnemy(){
    enemies.push({x:400,y:500,weapon:0,id:0,xv:0,yv:0,rot:Math.PI,rotv:0,ai:[0,0],});
}
newEnemy();
function playerWeaponCollision(x,y,sx,sy,hurt){
    for (var i = 0; i < weapons[player.weapon].collision.length; i++){
        let weapon = weapons[player.weapon].collision;

        if (Game.collide.rect2D(
            player.x-(weapon[i][1]/2)+weapon[i][0]*Math.cos(player.rot),
            player.y-(weapon[i][1]/2)+weapon[i][0]*Math.sin(player.rot),
            weapon[i][1],weapon[i][1],
            x,y,
            sx,sy)
        && (weapon[i][2] || !hurt)) return true;
    }
    return false
}

//---------------------------------------------------- DRAW -----------------------------------
function draw(){
    if (canvas.getContext) {
        
        const ctx = canvas.getContext("2d");
        function pasteImg(image,x,y,sx,sy,rotation){
            ctx.save();
            ctx.translate(x+(sx/4), y+(sy/4)); // translate to rectangle center
            ctx.rotate(rotation);

            ctx.translate(-x,-y);
            centerImage(image,x, y,sx,sy);
            ctx.restore();
  
            
        }
        function centerImage(image,x,y,sx,sy){
            ctx.drawImage(image,x-(sx/2),y-(sy/2),sx,sy);

        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.font = "20px serif";
        ctx.globalAlpha=0.3;
        centerImage(getImage('img/shadow.png'),player.x,player.y+22,50,50);
        ctx.globalAlpha=1;
        
        for (var i = 0; i < enemies.length; i++){
            ctx.globalAlpha=0.3;//Render enemy
            centerImage(getImage('img/shadow.png'),enemies[i].x,enemies[i].y+22,50,50);
            ctx.globalAlpha=1;
            centerImage(getImage('img/costume/costume1-0.png'),enemies[i].x,enemies[i].y,50,50);
            centerImage(getImage('img/costume/costume1-1.png'),
                enemies[i].x+(8*Math.cos((Math.PI/-2)+Game.directionFrom(enemies[i].x,enemies[i].y,player.x,player.y))),
                enemies[i].y+(8*Math.sin((Math.PI/-2)+Game.directionFrom(enemies[i].x,enemies[i].y,player.x,player.y))),
                50,50);
            //Render enemy weapon
            pasteImg(getImage('img/weapon'+enemies[i].weapon+'.png'),
            enemies[i].x-(150/4)+50*Math.cos(enemies[i].rot),
            enemies[i].y-(150/4)+50*Math.sin(enemies[i].rot),
            150,150,
            enemies[i].rot);
            
        }
        //document.querySelector('#test').innerHTML=player.rot+', '+enemies[0].rot;
        //Player
        
        //Math.max(10,(Math.sqrt(((player.x-enemies[0].x)^2)+((player.y-enemies[0].y)^2))));
        centerImage(getImage('img/costume/costume0-0.png'),player.x,player.y,50,50);
        centerImage(getImage('img/costume/costume0-1.png'),
            player.x+(8*Math.cos((Math.PI/-2)+Game.directionFrom(player.x,player.y,enemies[0].x,enemies[0].y))),
            player.y+(8*Math.sin((Math.PI/-2)+Game.directionFrom(player.x,player.y,enemies[0].x,enemies[0].y))),
            50,50);
        //Weapon
        pasteImg(getImage('img/weapon'+player.weapon+'.png'),
        player.x-(150/4)+50*Math.cos(player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
        player.y-(150/4)+50*Math.sin(player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
        150,150,
        player.rot+(player.gdCD*(Math.PI/(1.5*(player.guardDir)))/10));
        if (player.weapon==4 || weapons[4].variants.includes(player.weapon)){
            pasteImg(getImage('img/weapon'+player.weapon+'.png'),
                player.x-(150/4)+50*Math.cos(Math.PI+player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
                player.y-(150/4)+50*Math.sin(Math.PI+player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
                150,150,
                Math.PI+player.rot+(player.gdCD*(Math.PI/(1.5*(player.guardDir)))/10));
        }
        if (false){//Draw weapon collision. Debug purposes
            for (var i = 0; i < weapons[player.weapon].collision.length; i++){
                let weapon = weapons[player.weapon].collision[i];
                ctx.globalAlpha = 0.4;
                ctx.fillRect(
                    player.x-(weapon[1]/2)+(weapon[0]*Math.cos(player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/-5))),
                    player.y-(weapon[1]/2)+(weapon[0]*Math.sin(player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/-5)))
                    ,weapon[1],weapon[1]);
            }
            for (var ii = 0; ii < enemies.length; ii++){
                for (var i = 0; i < weapons[enemies[ii].weapon].collision.length; i++){
                    let weapon = weapons[enemies[ii].weapon].collision[i];
                    ctx.globalAlpha = 0.4;
                    ctx.fillRect(
                        enemies[ii].x-(weapon[1]/2)+(weapon[0]*Math.cos(enemies[ii].rot)),
                        enemies[ii].y-(weapon[1]/2)+(weapon[0]*Math.sin(enemies[ii].rot))
                        ,weapon[1],weapon[1]);
                }
            }
            
            
        }
        //Healthbars
        ctx.globalAlpha=1;
        if (player.iframe==0){
            centerImage(getImage('img/healthbarGreen.png'),player.x,player.y-40,60,60);
        }else{
            centerImage(getImage('img/healthbarWhite.png'),player.x,player.y-40,60,60);
        }
        for (var i = 0; i < enemies.length; i++){
            centerImage(getImage('img/healthbarGreen.png'),enemies[i].x,enemies[i].y-40,60,60);
        }
        if (player.health<=0){
            centerImage(getImage('img/healthbarRed.png'),player.x,player.y-40,60,60);
        }else{
            ctx.drawImage(
            getImage('img/healthbarRed.png'),
            54+(540*(player.health/player.maxHealth)),
            0,
            640,
            640,
            player.x-24+50*(player.health/player.maxHealth),
            player.y-40-30,
            60,
            60);
        }
        

    }
}
function logic(){
    let movement = 1;
    let swing = 1;
    let right = false;
    let left = false;
    let up = false;
    let down = false;
    let swordR = false;
    let swordL = false;

    if (player.gdCD>0){
        movement *= weapons[player.weapon].guardMoveSpeed;
        swing *= (weapons[player.weapon].guardSwingSpeed*(player.gdCD))/(8);
    }

    

    if (player.kbCD<1){
        if (Game.key.pressed(keyBind('RIGHT',1,1)) && player.xv<6*movement){
            player.xv+=movement*0.4*((player.xv<0?1.5:1));
            right = true;
        }
        if (Game.key.pressed(keyBind('LEFT',1,1)) && player.xv>-6*movement){
            player.xv-=movement*0.4*((player.xv>0?1.5:1));
            left = true;
        }
        if (Game.key.pressed(keyBind('DOWN',1,1))  && player.yv<6*movement){
            player.yv+=movement*0.4*((player.xv<0?1.5:1));
            down = true;
        }
        if (Game.key.pressed(keyBind('UP',1,1))  && player.yv>-6*movement){
            player.yv-=movement*0.4*((player.xv>0?1.5:1));
            up = true;
        }
    }

    
    if (player.blockCD<1){
        if (Game.key.pressed(keyBind('SWORDR',1,1)) && player.rotv<weapons[player.weapon].maxSpeed * swing){
            //if (player.rotv<0) swing *= weapons[player.weapon].directionChange;
            if (player.gdCD==0) player.guardDir=1
            player.rotv+=weapons[player.weapon].speed * swing;
            swordR = true;
        }
        if (Game.key.pressed(keyBind('SWORDL',1,1)) && player.rotv>-weapons[player.weapon].maxSpeed * swing){
            //if (player.rotv>0) swing *= weapons[player.weapon].directionChange;
            if (player.gdCD==0) player.guardDir=-1
            player.rotv-=weapons[player.weapon].speed * swing;
            swordL = true;
        }
}
    if (player.rotv>weapons[player.weapon].maxSpeed * swing) player.rotv=weapons[player.weapon].maxSpeed * swing;
    if (player.rotv<-weapons[player.weapon].maxSpeed * swing) player.rotv=-weapons[player.weapon].maxSpeed * swing;
    if (Game.key.pressed(keyBind('GUARD',1,1))){
        
        player.gdCD+=weapons[player.weapon].guardSpeed[0];
        
        if (player.gdCD>8) player.gdCD=8;
    }

    player.x += player.xv * Game.deltaTime * 40;
    player.y += player.yv * Game.deltaTime * 40;
    player.rot += player.rotv * Game.deltaTime * 40;
    
    if (playerWeaponCollision(640,0,1,640,false)){
        player.x-=player.xv * Game.deltaTime * 40;
        player.xv=-10*(0.2+Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv=0;
    }

    if (playerWeaponCollision(0,0,1,640,false)){
        player.x-=player.xv * Game.deltaTime * 40;
        player.xv=10*(Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv=0;
    }
    if (playerWeaponCollision(0,0,640,1,false)){
        player.y-=player.yv * Game.deltaTime * 40;
        player.yv=10*(Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv=0;
    }
    if (playerWeaponCollision(0,640,640,1,false)){
        player.y-=player.yv * Game.deltaTime * 40;
        player.yv=-10*(Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv=0;
    }
    

    if (player.x>640-25){//Level bounds
        player.x=640-25;
        player.xv=0;
    }
    if (player.x<25){
        player.x=25;
        player.xv=0;
    }
    if (player.y>640-25){
        player.y=640-25;
        player.yv=0;
    }
    if (player.y<25){
        player.y=25;
        player.yv=0;
    }
    for (var i = 0; i < enemies.length; i++){
        enemies[i].x += enemies[i].xv * Game.deltaTime * 40;
        enemies[i].y += enemies[i].yv * Game.deltaTime * 40;
        enemies[i].rot += enemies[i].rotv * Game.deltaTime * 40;
        for (var ii = 0; ii < weapons[enemies[i].weapon].collision.length; ii++){
            let weapon = weapons[enemies[i].weapon].collision;
            if (playerWeaponCollision(
                enemies[i].x-(weapon[ii][1]/2)+weapon[ii][0]*Math.cos(enemies[i].rot),
                enemies[i].y-(weapon[ii][1]/2)+weapon[ii][0]*Math.sin(enemies[i].rot),
                weapon[ii][1],weapon[ii][1]))
            {//Weapon Collision
                player.blockCD=15;
                enemies[i].blockCD=15;
                player.rot-=player.rotv;
                enemies[i].rot-=enemies[i].rotv;

                let knockback = weapons[player.weapon].knockbackTaken*weapons[enemies[i].weapon].knockbackGiven;
                player.rotv*=-knockback;//Player

                if (player.rotv>0){
                    player.xv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(player.rot-Math.PI/2);
                    player.yv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(player.rot-Math.PI/2);
 
                }else{
                    player.xv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(player.rot+Math.PI/2);
                    player.yv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(player.rot+Math.PI/2);
                }

                knockback = weapons[player.weapon].knockbackGiven*weapons[enemies[i].weapon].knockbackTaken;
                enemies[i].rotv*=-knockback;//Enemy

                if (enemies[i].rotv>0){
                    enemies[i].xv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(enemies[i].rot-Math.PI/2);
                    enemies[i].yv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(enemies[i].rot-Math.PI/2);
 
                }else{
                    enemies[i].xv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(enemies[i].rot+Math.PI/2);
                    enemies[i].yv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(enemies[i].rot+Math.PI/2);
                }

                
                enemies[i].rotv*=-1*weapons[enemies[i].weapon].knockbackTaken;
                    
            }else if (Game.collide.rect2D(
                enemies[i].x-(weapon[ii][1]/2)+weapon[ii][0]*Math.cos(enemies[i].rot),
                enemies[i].y-(weapon[ii][1]/2)+weapon[ii][0]*Math.sin(enemies[i].rot),
                weapon[ii][1],weapon[ii][1],
                player.x-25,player.y-25,50,50
            )){
                if (player.iframe==0){
                    
                    if (weapon[ii][2]){
                        player.health-=weapons[enemies[i].weapon].damage;
                        levelState.freezeFrame=10;
                        player.iframe=Math.floor(8/weapons[enemies[i].weapon].maxSpeed);
                    }
                }
            }

        }
        enemies[i].xv*=0.9;
        enemies[i].yv*=0.9;
        enemies[i].rotv*=0.9;
        if (enemies[i].x>640-25){//Level bounds
            enemies[i].x=640-25;
            enemies[i].xv=0;
        }
        if (enemies[i].x<25){
            enemies[i].x=25;
            enemies[i].xv=0;
        }
        if (enemies[i].y>640-25){
            enemies[i].y=640-25;
            enemies[i].yv=0;
        }
        if (enemies[i].y<25){
            enemies[i].y=25;
            enemies[i].yv=0;
        }
    }



    if (right || left){}else{
        player.xv*=0.9;
    }
    if (up || down){}else{
        player.yv*=0.9;
    }
    if (swordR || swordL){}else{
        player.rotv*=0.9;
    }
    if (player.kbCD>0) player.kbCD--;
    if (player.bnCD>0) player.bnCD--;
    if (player.gdCD>0 && !Game.key.pressed(keyBind('GUARD',1,1))) player.gdCD-=weapons[player.weapon].guardSpeed[1];
    if (player.gdCD<0) player.gdCD=0;
    if (player.blockCD>0) player.blockCD--;
    if (player.iframe>0) player.iframe--;
    
}
function tick(){
    if (levelState.freezeFrame < 1){
        logic();
    }else{
        levelState.freezeFrame--;
    }
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