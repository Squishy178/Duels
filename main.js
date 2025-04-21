if (true){
    var keyCodesToKeys={//I would not touch this. I would also advise you not to use the control.
        "A":65,"B":66,"C":67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90,'0':96,'1':97,'2':98,'3':99,'4':100,'5':101,'6':102,'7':103,'8':104,'9':105,'SPACE':32,'ENTER':13,'SHIFT':16,'CONTROL':17,'ALT':18,'ESCAPE':27,'DELETE':46,'LEFT':37,'UP':38,'RIGHT':39,'DOWN':40,'BACKSPACE':8,'TAB':9,'F1':112,'F2':113,'F3':114,'F4':115,'F5':116,'F6':117,'F7':118,'F8':119,'F9':120,'F10':121,'F11':122,'F12':123
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
    Game.distance2D=function(x1,y1,x2,y2){return Math.sqrt((x1-x2)**2+(y1-y2)**2);}
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
    'img/weapon8.png',

    'img/enemy.png', 
    'img/shadow.png',
    'img/healthbarGreen.png',
    'img/healthbarRed.png',
    'img/healthbarWhite.png',
    'img/costume/costume0-0.png',
    'img/costume/costume0-1.png',
    'img/costume/costume0-2.png',
    'img/costume/costume0-3.png',
    'img/costume/costume0-4.png',
    'img/costume/costume0-5.png',
    'img/costume/costume0-6.png',

    'img/costume/costume1-0.png',
    'img/costume/costume1-1.png',
    'img/background.png',
    'img/border.png',
    'img/menu/island0.png',
    'img/particle0.png',
    'img/particle1.png',
];

var levelState = {
    score:0,
    stage:0,
    time:0,
    freezeFrame:0,
    state:'play',
}

var loadedSfx={};
const preloadSfxs=[
    'sfx/menu.mp3'
];
function preloadSfx(url){
    let aud=new Audio();
    aud.src=url;
    loadedSfx[url]=aud;
}
function playSfx(url) {
    loadedSfx[url].play();
}
function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}


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
    blink:120,
    jabCD:0,
    statusEffects:[],
};

var enemies = [];

var saveData={
    tokens:10,
    gems:10,
    boxes:{
        normal:1,
        big:0,
        large:0,
        grand:0
    },
    costumes:[0],
    weapons:[
        {
            unlocked:true,
            v1:false,
            v2:false,
            v3:false,
        },
        {
            unlocked:false,
            v1:false,
            v2:false,
            v3:false,
        },
        {
            unlocked:false,
            v1:false,
            v2:false,
            v3:false,
        },
    ],
    lastReward:10,

}
var particles = [];

const particleData = [
    {//Sparks
        rndX:5,
        rndY:5,
        direction:0,
        rndDirection:Math.PI*2,
        speed:1,
        rndSpeed:1,
        art:0,
        duration:30,
        rndDuration:20,
        gravityX:0,
        rndGravityX:0,
        gravityY:0.05,
        rndGravityY:0.1,
        color:0,
        rndColor:0,
        endColor:0,
        rndEndColor:0,
        size:15,
        rndSize:10,
        endSize:10,
        rndEndSize:10,
        alpha:0.75,
        rndAlpha:0.5,
        endAlpha:0,
        rndEndAlpha:0,
    },
    {//Hurt
        rndX:0,
        rndY:40,
        direction:-Math.PI/2,
        rndDirection:Math.PI/3,
        speed:2,
        rndSpeed:1,
        art:1,
        duration:40,
        rndDuration:20,
        gravityX:0,
        rndGravityX:0,
        gravityY:0.15,
        rndGravityY:0.05,
        color:0,
        rndColor:0,
        endColor:0,
        rndEndColor:0,
        size:120,
        rndSize:60,
        endSize:5,
        rndEndSize:2,
        alpha:1,
        rndAlpha:0,
        endAlpha:1,
        rndEndAlpha:0,
    }
];
function newParticle(x2,y2,type2,count){
    function rnd(item){
        let rand = Math.random();
        if (Math.random()<0.5){
            return rand*eval('particleData['+type2+'].'+item)/2;
        }else{
            return rand*eval('particleData['+type2+'].'+item)/-2;
        }
        
    }
    for (var i = 0; i < count; i++){
        let speed = particleData[type2].speed+rnd('rndSpeed');
        let dir = particleData[type2].direction+rnd('rndDirection');
        particles.push({
            x:x2+rnd('rndX'),
            y:y2+rnd('rndY'),
            type:type2,
            duration:particleData[type2].duration+rnd('rndDuration'),
            maxDuration:particleData[type2].duration+rnd('rndDuration'),
            size:particleData[type2].size+rnd('rndSize'),
            endSize:particleData[type2].endSize+rnd('rndEndSize'),
            alpha:particleData[type2].alpha+rnd('rndAlpha'),
            endAlpha:particleData[type2].endAlpha+rnd('rndEndAlpha'),
            gravityX:particleData[type2].gravityX+rnd('rndGravityX'),
            gravityY:particleData[type2].gravityY+rnd('rndGravityY'),
            color:particleData[type2].color+rnd('rndColor'),
            endColor:particleData[type2].endColor+rnd('rndEndColor'),
            direction:dir,
            xv:speed*Math.cos(dir),
            yv:speed* Math.sin(dir),
        });
    }
}

var enemies=[];
var keyBinds={
    player:{
        'LEFT':'A',
        'RIGHT':'D',
        'UP':'W',
        'DOWN':'S',
        'SWORDL':'LEFT',
        'SWORDR':'RIGHT',
        'GUARD':'DOWN',
        'JAB':'UP',
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
function newEnemy(x2,y2,weapon2){
    enemies.push({x:x2,y:y2,weapon:weapon2,id:0,xv:0,yv:0,rot:Math.PI,rotv:0,ai:[0,0],health:25,maxHealth:25,iframe:0,blink:0});
}
newEnemy(400,500,0);
newEnemy(200,500,0);

function range(start,end,duration,maxDuration){
    return (start*(duration/maxDuration))+(end)*((maxDuration-duration)/maxDuration)
}


function weaponArt(target){
    let art2 = -1
    for (var ii = 0; ii < weapons[target.weapon].art.length; ii++){
        if (art2 == -1 && weapons[target.weapon].art[ii].cond(target) ){
            art2 = weapons[target.weapon].art[ii].a;
        }
    }
    if (art2 == -1) art2 = 0;
    return art2;
}

function playerWeaponCollision(x,y,sx,sy,hurt){
    for (var i = 0; i < weapons[player.weapon].collision.length; i++){
        let weapon = weapons[player.weapon].collision[i];

        weapon[3] = weapon[3] || 0;
        if (weapon[0]<0){
            if (Game.collide.rect2D(
                player.x-(weapon[1]/2)+weapon[0]*Math.cos(player.rot)+(weapon[3]*Math.cos(player.rot+Math.PI/2))-((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.cos(player.rot),
                player.y-(weapon[1]/2)+weapon[0]*Math.sin(player.rot)+(weapon[3]*Math.sin(player.rot+Math.PI/2))-((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.sin(player.rot),
                weapon[1],weapon[1],
                x,y,
                sx,sy)
            && (weapon[2]>0 || !hurt)) return true;
        }else{
            if (Game.collide.rect2D(
                player.x-(weapon[1]/2)+weapon[0]*Math.cos(player.rot)+(weapon[3]*Math.cos(player.rot+Math.PI/2))+((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.cos(player.rot),
                player.y-(weapon[1]/2)+weapon[0]*Math.sin(player.rot)+(weapon[3]*Math.sin(player.rot+Math.PI/2))+((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.sin(player.rot),
                weapon[1],weapon[1],
                x,y,
                sx,sy)
            && (weapon[2]>0 || !hurt)) return true;
        }

        
    }
    
    return false
}

//---------------------------------------------------- DRAW -----------------------------------
function draw(){
    if (canvas.getContext) {
        
        const ctx = canvas.getContext("2d");
        ctx.filter = 'none';
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
        if (levelState.state == 'play'){
            centerImage(getImage('img/background.png'),320,320,640,640);
            
            ctx.font = "20px serif";
            ctx.globalAlpha = 0.4;
            ctx.filter = 'blur(2px)';
            centerImage(getImage('img/shadow.png'),player.x,player.y+10,65,65);
            ctx.globalAlpha=1;
            ctx.filter = 'none'
            centerImage(getImage('img/border.png'),320,320,640,640);

            let art = 0;
            for (var i = 0; i < enemies.length; i++){
                enemies[i].blink--;
                if (enemies[i].blink<0){
                    let min = 160;
                    let max = 240;
                    
                    min *= 0.33+0.66*(enemies[i].health/enemies[i].maxHealth); max *= 0.33+0.66*(player.health/player.maxHealth);
                    enemies[i].blink = min + Math.random()*(max-min)
                    
                }
                ctx.globalAlpha=0.4;//Render enemy
                ctx.filter = 'blur(2px)';
                centerImage(getImage('img/shadow.png'),enemies[i].x,enemies[i].y+10,65,65);
                ctx.filter = 'none';
                ctx.globalAlpha = 1;
                if (enemies[i].iframe>0) ctx.filter = 'brightness(150%)';
                centerImage(getImage('img/costume/costume1-0.png'),enemies[i].x,enemies[i].y,50,50);
                centerImage(getImage('img/costume/costume1-1.png'),
                    enemies[i].x+(8*Math.cos((Math.PI/-2)+Game.directionFrom(enemies[i].x,enemies[i].y,player.x,player.y))),
                    enemies[i].y+(8*Math.sin((Math.PI/-2)+Game.directionFrom(enemies[i].x,enemies[i].y,player.x,player.y))),
                    50,50);
                //Render enemy weapon
                ctx.filter = 'none';
                art = weaponArt(enemies[i]);
                pasteImg(getImage('img/weapon'+art+'.png'),
                enemies[i].x-(150/4)+50*Math.cos(enemies[i].rot),
                enemies[i].y-(150/4)+50*Math.sin(enemies[i].rot),
                150,150,
                enemies[i].rot);
                if (enemies[i].weapon==4 || weapons[4].variants.includes(enemies[i].weapon)){
                    pasteImg(getImage('img/weapon'+art+'.png'),
                    enemies[i].x-(150/4)+50*Math.cos(Math.PI+enemies[i].rot),
                    enemies[i].y-(150/4)+50*Math.sin(Math.PI+enemies[i].rot),
                    150,150,
                    Math.PI+enemies[i].rot);
                }
                ctx.filter = 'none';
            }

            //Player
            
            //Math.max(10,(Math.sqrt(((player.x-enemies[0].x)^2)+((player.y-enemies[0].y)^2))));
            //ctx.filter = 'hue-rotate('+((Date.now()*0.75)%360)+'deg)';
            if (player.iframe>0) ctx.filter = 'brightness(150%)';
            centerImage(getImage('img/costume/costume0-0.png'),player.x,player.y,50,50);
            let src = 1;
            
            src = 1;
            //Kinda stupid, but here is the BLINKING CODE :laughing-crying:
            if (player.blink<10) src = 3;
            player.blink--;
            if (player.blink<0){
                let min = 160;
                let max = 240;
                
                min *= 0.33+0.66*(player.health/player.maxHealth); max *= 0.33+0.66*(player.health/player.maxHealth);
                player.blink = min + Math.random()*(max-min)
                
            }

            //Find the closest Enemy and look at them!
            let closest = 9999;
            let closestI = 0;
            for (var i = 0; i < enemies.length; i++){
                if (closest > Game.distance2D(player.x,player.y,enemies[i].x,enemies[i].y)){
                    closest = Game.distance2D(player.x,player.y,enemies[i].x,enemies[i].y);
                    closestI = i;
                }
            }
            
            
            centerImage(getImage('img/costume/costume0-'+src+'.png'),
                player.x+(8*Math.cos((Math.PI/-2)+Game.directionFrom(player.x,player.y,enemies[closestI].x,enemies[closestI].y))),
                player.y+(8*Math.sin((Math.PI/-2)+Game.directionFrom(player.x,player.y,enemies[closestI].x,enemies[closestI].y))),
                75,75);

            centerImage(getImage('img/costume/costume0-'+4+'.png'),
                player.x+(8*Math.cos((Math.PI/-2)+Game.directionFrom(player.x,player.y,enemies[closestI].x,enemies[closestI].y))),
                player.y+(8*Math.sin((Math.PI/-2)+Game.directionFrom(player.x,player.y,enemies[closestI].x,enemies[closestI].y))),
                75,75);
            //Weapon
            ctx.filter = 'none';

            art = weaponArt(player);
            let dir = player.rot+(player.gdCD*(Math.PI/(-weapons[player.weapon].guardOffset[0]*player.guardDir))/10);
            let dir2 = player.rot+(player.gdCD*(Math.PI/(weapons[player.weapon].guardOffset[1]*player.guardDir))/10)
            
            if (weapons[player.weapon].parryFrame.includes(player.gdCD)) ctx.filter = 'brightness(300%)';

            pasteImg(getImage('img/weapon'+art+'.png'),
                player.x-(150/4)+((1+(weapons[player.weapon].jabDistance*player.jabCD/12))*50)*Math.cos(dir),
                player.y-(150/4)+((1+(weapons[player.weapon].jabDistance*player.jabCD/12))*50)*Math.sin(dir),
                150,150,
                dir2);
                
            
            if (player.weapon==4 || weapons[4].variants.includes(player.weapon)){
                pasteImg(getImage('img/weapon'+art+'.png'),
                    player.x-(150/4)+((1+(weapons[player.weapon].jabDistance*player.jabCD/12))*50)*Math.cos(Math.PI+player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
                    player.y-(150/4)+((1+(weapons[player.weapon].jabDistance*player.jabCD/12))*50)*Math.sin(Math.PI+player.rot+(player.gdCD*(Math.PI/(-10*player.guardDir))/10)),
                    150,150,
                    Math.PI+player.rot+(player.gdCD*(Math.PI/(1.5*(player.guardDir)))/10));
            }
            ctx.filter = 'none';

            if (false){
                //Draw weapon collision. Debug purposes
                for (var i = 0; i < weapons[player.weapon].collision.length; i++){
                    let weapon = weapons[player.weapon].collision[i];
                    weapon[3]=weapon[3] || 0;
                    ctx.globalAlpha = 0.9;
                    let direction = player.rot+(player.gdCD*(Math.PI/(-weapons[player.weapon].guardOffset[0]*player.guardDir))/10);

                    ctx.strokeRect(
                        player.x-(weapon[1]/2)+(weapon[0]*Math.cos(direction))+(weapon[3]*Math.cos(direction+Math.PI/2))+((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.cos(direction),
                        player.y-(weapon[1]/2)+(weapon[0]*Math.sin(direction))+(weapon[3]*Math.sin(direction+Math.PI/2))+((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.sin(direction),
                        weapon[1],weapon[1]);
                }
                if (player.weapon==4 || weapons[4].variants.includes(player.weapon)){
                    for (var i = 0; i < weapons[player.weapon].collision.length; i++){
                        let weapon = weapons[player.weapon].collision[i];
                        weapon[3]=weapon[3] || 0;
                        ctx.globalAlpha = 0.9;
                        let direction = player.rot+(player.gdCD*(Math.PI/(-weapons[player.weapon].guardOffset[0]*player.guardDir))/10);
    
                        ctx.strokeRect(
                            player.x-(weapon[1]/2)+(-weapon[0]*Math.cos(direction))+(weapon[3]*Math.cos(direction+Math.PI/2))-((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.cos(direction),
                            player.y-(weapon[1]/2)+(-weapon[0]*Math.sin(direction))+(weapon[3]*Math.sin(direction+Math.PI/2))-((weapons[player.weapon].jabDistance*player.jabCD/12)*50)*Math.sin(direction),
                            weapon[1],weapon[1]);
                    }
                }
                for (var ii = 0; ii < enemies.length; ii++){
                    for (var i = 0; i < weapons[enemies[ii].weapon].collision.length; i++){
                        let weapon = weapons[enemies[ii].weapon].collision[i];
                        weapon[3] = weapon[3] || 0;
                        let direction = enemies[ii].rot;

                        ctx.globalAlpha = 0.9;
                        ctx.strokeRect(
                            enemies[ii].x-(weapon[1]/2)+(weapon[0]*Math.cos(direction))+(weapon[3]*Math.cos(direction+Math.PI/2)),
                            enemies[ii].y-(weapon[1]/2)+(weapon[0]*Math.sin(direction))+(weapon[3]*Math.sin(direction+Math.PI/2))
                            ,weapon[1],weapon[1]);
                    }
                }
                
                
            }
            //Healthbars
            ctx.globalAlpha=1;
            if (player.iframe<=0){
                centerImage(getImage('img/healthbarGreen.png'),player.x,player.y-40,60,60);
            }else{
                centerImage(getImage('img/healthbarWhite.png'),player.x,player.y-40,60,60);
            }

            for (var i = 0; i < enemies.length; i++){
                if (enemies[i].iframe<=0){
                    centerImage(getImage('img/healthbarGreen.png'),enemies[i].x,enemies[i].y-40,60,60);
                }else{
                    centerImage(getImage('img/healthbarWhite.png'),enemies[i].x,enemies[i].y-40,60,60);
                }
                if (enemies[i].health<=0){
                    centerImage(getImage('img/healthbarRed.png'),enemies[i].x,enemies[i].y-40,60,60);
                }else{
                    ctx.drawImage(
                    getImage('img/healthbarRed.png'),
                    54+(540*(enemies[i].health/enemies[i].maxHealth)),
                    0,
                    640,
                    640,
                    enemies[i].x-24+50*(enemies[i].health/enemies[i].maxHealth),
                    enemies[i].y-40-30,
                    60,
                    60);
                }
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
            //Particles Yay!
            for (var i = 0; i < particles.length; i++){
                ctx.globalAlpha = range(particles[i].alpha,particles[i].endAlpha,particles[i].duration,particles[i].maxDuration);
                
                centerImage(
                    getImage('img/particle'+particleData[particles[i].type].art+'.png'),
                    particles[i].x,particles[i].y,
                    range(particles[i].size,particles[i].endSize,particles[i].duration,particles[i].maxDuration),
                    range(particles[i].size,particles[i].endSize,particles[i].duration,particles[i].maxDuration));
                ctx.globalAlpha = 1;
            }
        }
        if (levelState.state == 'menu'){
            ctx.fillStyle = "rgba(50,200,250)";
            ctx.fillRect(0,0,640,640);
            ctx.fillStyle = "rgba(200,250,255)";
            ctx.fillRect(0,0,640,175);

            let interval = (Math.PI/10)*Math.sin(Date.now()/800);

            centerImage(getImage('img/menu/island0.png'),320,380,320,320);
            centerImage(getImage('img/menu/island0.png'),175,443,240,240);
            centerImage(getImage('img/menu/island0.png'),500,443,120,120);
            ctx.globalAlpha = 0.4;
            ctx.filter = 'blur(2px)';
            centerImage(getImage('img/shadow.png'),(interval*40)+320,265,120,40);
            ctx.globalAlpha = 1;
            ctx.filter = 'none';
            pasteImg(getImage('img/player.png'),(interval*40)+320-(96/4),220-(96/4),96,96,interval);
            
        }

    }
    
}
//----------------------------------------------------  LOGIC -------------------------------

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
        movement *= (8/Math.max(8,player.gdCD))*weapons[player.weapon].guardMoveSpeed;
        swing *= (8/Math.max(8,player.gdCD))*weapons[player.weapon].guardSwingSpeed;
    }
    if (player.jabCD>0){
        movement *= (8/Math.max(8,player.jabCD))*weapons[player.weapon].jabMoveSpeed;
        swing *= (8/Math.max(8,player.jabCD))*weapons[player.weapon].jabSwingSpeed;
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
        if (Game.key.pressed(keyBind('SWORDR',1,1))){
            //if (player.rotv<0) swing *= weapons[player.weapon].directionChange;
            if (player.gdCD==0) player.guardDir=1
            player.rotv+=weapons[player.weapon].speed * swing;
            swordR = true;
        }
        if (Game.key.pressed(keyBind('SWORDL',1,1))){
            //if (player.rotv>0) swing *= weapons[player.weapon].directionChange;
            if (player.gdCD==0) player.guardDir=-1
            player.rotv-=weapons[player.weapon].speed * swing;
            swordL = true;
        }
}
    if (player.rotv>weapons[player.weapon].maxSpeed * swing) player.rotv=weapons[player.weapon].maxSpeed * swing;
    if (player.rotv<-weapons[player.weapon].maxSpeed * swing) player.rotv=-weapons[player.weapon].maxSpeed * swing;
    if (Game.key.pressed(keyBind('GUARD',1,1)) && player.jabCD < 5){
        
        player.gdCD+=weapons[player.weapon].guardSpeed[0];
        
        if (player.gdCD>8) player.gdCD=8;
    }else if (Game.key.pressed(keyBind('JAB',1,1)) && player.gdCD < 5){
        player.jabCD += weapons[player.weapon].jabSpeed[0];
        
        if (player.jabCD>8) player.jabCD=8;
    }

    player.x += player.xv * Game.deltaTime * 40;
    player.y += player.yv * Game.deltaTime * 40;
    player.rot += player.rotv * Game.deltaTime * 40;
    
    if (playerWeaponCollision(614,0,1,615,false)){
        player.x-=player.xv * Game.deltaTime * 40;
        player.xv=-10*(Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv*=0.05;
    }

    if (playerWeaponCollision(0,0,26,615,false)){//Weapon colliding with the border
        player.x-=player.xv * Game.deltaTime * 40;
        player.xv=10*(Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv=0;
    }
    if (playerWeaponCollision(0,24,640,1,false)){
        player.y-=player.yv * Game.deltaTime * 40;
        player.yv=10*(Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv=0;
    }
    if (playerWeaponCollision(0,614,615,1,false)){
        player.y-=player.yv * Game.deltaTime * 40;
        player.yv=-10*(Math.abs(player.rotv));
        player.kbCD=10;
        player.rot-=player.rotv * Game.deltaTime * 40;
        player.rotv=0;
    }
    

    if (player.x>615-25){//Level bounds
        player.x=615-25;
        player.xv=0;
    }
    if (player.x<50){
        player.x=50;
        player.xv=0;
    }
    if (player.y>615-25){
        player.y=615-25;
        player.yv=0;
    }
    if (player.y<50){
        player.y=50;
        player.yv=0;
    }
    for (var i = 0; i < enemies.length; i++){
        enemies[i].x += enemies[i].xv * Game.deltaTime * 40;
        enemies[i].y += enemies[i].yv * Game.deltaTime * 40;
        enemies[i].rot += enemies[i].rotv * Game.deltaTime * 40;

        //Colliding with other entities
        if (Game.distance2D(player.x,player.y,enemies[i].x,enemies[i].y)<50){
            enemies[i].x -= enemies[i].xv * Game.deltaTime * 20;
            enemies[i].y -= enemies[i].yv * Game.deltaTime * 20;

            player.x -= player.xv * Game.deltaTime * 20;
            player.y -= player.yv * Game.deltaTime * 20;

            enemies[i].xv+=0.5*Math.cos(Math.PI/2+Game.directionFrom(enemies[i].x,enemies[i].y,player.x,player.y));
            enemies[i].yv+=0.5*Math.sin(Math.PI/2+Game.directionFrom(enemies[i].x,enemies[i].y,player.x,player.y));
            player.xv+=0.5*Math.cos(Math.PI/2+Game.directionFrom(player.x,player.y,enemies[i].x,enemies[i].y));
            player.yv+=0.5*Math.sin(Math.PI/2+Game.directionFrom(player.x,player.y,enemies[i].x,enemies[i].y));
        }
        for (var ii = 0; ii < enemies.length; ii++){
            if (Game.distance2D(enemies[ii].x,enemies[ii].y,enemies[i].x,enemies[i].y)<50 && ii!=i){
                enemies[i].x -= enemies[i].xv * Game.deltaTime * 20;
                enemies[i].y -= enemies[i].yv * Game.deltaTime * 20;
    
                enemies[ii].x -= enemies[ii].xv * Game.deltaTime * 20;
                enemies[ii].y -= enemies[ii].yv * Game.deltaTime * 20;
    
                enemies[i].xv+=0.5*Math.cos(Math.PI/2+Game.directionFrom(enemies[i].x,enemies[i].y,enemies[ii].x,enemies[ii].y));
                enemies[i].yv+=0.5*Math.sin(Math.PI/2+Game.directionFrom(enemies[i].x,enemies[i].y,enemies[ii].x,enemies[ii].y));
                enemies[ii].xv+=0.5*Math.cos(Math.PI/2+Game.directionFrom(enemies[ii].x,enemies[ii].y,enemies[i].x,enemies[i].y));
                enemies[ii].yv+=0.5*Math.sin(Math.PI/2+Game.directionFrom(enemies[ii].x,enemies[ii].y,enemies[i].x,enemies[i].y));
            }
        }


        for (var ii = 0; ii < weapons[enemies[i].weapon].collision.length; ii++){
            let weapon = weapons[enemies[i].weapon].collision[ii];

            weapon[3] = weapon[3] || 0;
            
            // for (var iii = 0; iii < weapons[enemies[ii].weapon].collision.length; iii++){
            //     let weapon2 = weapons[enemies[i].weapon].collision[ii];
            
            // }

            let cond = playerWeaponCollision(
                enemies[i].x-(weapon[1]/2)+(weapon[0]*Math.cos(enemies[i].rot))+(weapon[3]*Math.cos(enemies[i].rot+Math.PI/2)),
                enemies[i].y-(weapon[1]/2)+(weapon[0]*Math.sin(enemies[i].rot))+(weapon[3]*Math.sin(enemies[i].rot+Math.PI/2)),
                weapon[1],weapon[1]);


            if (cond)
            {//Weapon Collision
    
                newParticle(enemies[i].x-(weapon[1]/2)+(weapon[0]*Math.cos(enemies[i].rot))+(weapon[3]*Math.cos(enemies[i].rot+Math.PI/2)),enemies[i].y-(weapon[1]/2)+(weapon[0]*Math.sin(enemies[i].rot))+(weapon[3]*Math.sin(enemies[i].rot+Math.PI/2)),0,5);
                weapons[player.weapon].triggers.onCollide();
                player.rotv+=0.1*Math.sign((player.rotv==0?1:player.rotv));
                enemies[i].rotv+=0.1*Math.sign((enemies[i].rotv==0?1:enemies[i].rotv));
    
                player.blockCD=15;
                enemies[i].blockCD=15;
                player.rot-=player.rotv;
                enemies[i].rot-=enemies[i].rotv;
    
                let knockback = weapons[player.weapon].knockbackTaken*weapons[enemies[i].weapon].knockbackGiven;
                player.rotv*=-knockback;//Player
                if (!weapons[player.weapon].parryFrame.includes(player.gdCD)){
                    if (player.rotv<0){
                        player.xv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(player.rot-Math.PI/2);
                        player.yv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(player.rot-Math.PI/2);
    
                    }else{
                        player.xv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(player.rot+Math.PI/2);
                        player.yv=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(player.rot+Math.PI/2);
                    }
                }
    
                knockback = weapons[player.weapon].knockbackGiven*weapons[enemies[i].weapon].knockbackTaken;
                enemies[i].rotv*=-knockback;//Enemy
                if (weapons[player.weapon].parryFrame.includes(player.gdCD)) knockback *= 2;
    
                if (enemies[i].rotv>0){
                    enemies[i].xv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(enemies[i].rot-Math.PI/2);
                    enemies[i].yv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(enemies[i].rot-Math.PI/2);
    
                }else{
                    enemies[i].xv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.cos(enemies[i].rot+Math.PI/2);
                    enemies[i].yv-=knockback*25*Math.abs(player.rotv+enemies[i].rotv)*Math.sin(enemies[i].rot+Math.PI/2);
                }
    
                
                enemies[i].rotv*=-1*weapons[enemies[i].weapon].knockbackTaken*-player.rotv;
                    
            }else if (Game.collide.rect2D(
                enemies[i].x-(weapon[1]/2)+weapon[0]*Math.cos(enemies[i].rot),
                enemies[i].y-(weapon[1]/2)+weapon[0]*Math.sin(enemies[i].rot),
                weapon[1],weapon[1],
                player.x-25,player.y-25,50,50
            )){
                if (player.iframe<=0){
                    player.health-=weapons[enemies[i].weapon].damage*weapon[2];
                    levelState.freezeFrame=10;
                    player.iframe=Math.floor(8/weapons[enemies[i].weapon].maxSpeed);
                    player.blink = 9;
                    newParticle(player.x,player.y,1,6);
                }
            }  
        }
        if (enemies[i].iframe>0) enemies[i].iframe--;
            if (
                playerWeaponCollision(enemies[i].x-25,enemies[i].y-25,50,50)
            ){
                if (enemies[i].iframe<=0){
                    enemies[i].health-=weapons[player.weapon].damage;
                    levelState.freezeFrame=10;
                    enemies[i].iframe=Math.floor(8/weapons[player.weapon].maxSpeed);
                    enemies[i].blink = 9;
                    newParticle(enemies[i].x,enemies[i].y,1,6);
                }
            }
        
        // enemies[i].rotv+=0.02
        enemies[i].xv *= 0.9 * Game.deltaTime * 60;
        enemies[i].yv *= 0.9 *  Game.deltaTime * 60;
        enemies[i].rotv *= 0.9 *  Game.deltaTime * 60;
        if (enemies[i].x > 615-25){//Level bounds
            enemies[i].x = 615-25;
            enemies[i].xv = 0;
        }
        if (enemies[i].x < 50){
            enemies[i].x = 50;
            enemies[i].xv = 0;
        }
        if (enemies[i].y > 615-25){
            enemies[i].y = 615-25;
            enemies[i].yv = 0;
        }
        if (enemies[i].y < 50){
            enemies[i].y = 50;
            enemies[i].yv = 0;
        }
    }


    if (right || left){}else{
        player.xv*=0.9 *  Game.deltaTime * 60;
    }
    if (up || down){}else{
        player.yv*=0.9 *  Game.deltaTime * 60;
    }
    if (swordR || swordL){}else{
        player.rotv*=0.9 *  Game.deltaTime * 60;
    }
    if (player.kbCD>0) player.kbCD-=Game.deltaTime * 60;
    if (player.bnCD>0) player.bnCD-=Game.deltaTime * 60;
    if (player.gdCD>0 && !Game.key.pressed(keyBind('GUARD',1,1))) player.gdCD-=weapons[player.weapon].guardSpeed[1] * Game.deltaTime * 60;
    if (player.gdCD<0) player.gdCD=0;
    if (player.blockCD>0) player.blockCD-=Game.deltaTime * 60;
    if (player.iframe>0) player.iframe-=Game.deltaTime * 60;   
    if (player.jabCD>0 && !Game.key.pressed(keyBind('JAB',1,1))) player.jabCD-=weapons[player.weapon].jabSpeed[1] * Game.deltaTime * 60;
    if (player.jabCD<0) player.jabCD = 0;

    
}
function tick(){
    if (levelState.freezeFrame < 1 && levelState.state == 'play'){
        logic();
    }else{
        levelState.freezeFrame--;
    }
    var toDelete = [];
    for (var i = 0; i < particles.length; i++){
        particles[i].x += particles[i].xv * Game.deltaTime * 60;
        particles[i].y += particles[i].yv * Game.deltaTime * 60;
        particles[i].duration -=  Game.deltaTime * 60;
        toDelete.push(particles[i].duration<=0);
        particles[i].xv += particles[i].gravityX * Game.deltaTime * 60;
        particles[i].yv += particles[i].gravityY * Game.deltaTime * 60;
    }
    for (var i = 0; i < toDelete.length; i++){
        if (toDelete[i]) particles.splice(i,1);
    }
    toDelete = [];

    draw();
    updateGameSimple(); 
    ticks++;
    if (ticks > tickRate) ticks = 0;
}
function reload(){
    const ctx = canvas.getContext("2d");
    

    let len = preloadSfxs.length+preloadImages.length;

    for (var i = 0; i < preloadImages.length; i++){
        preloadImage(preloadImages[i]);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,640,640);
        ctx.fillStyle = "yellow";
        ctx.fillRect(240,300,160*((1+i)/len),40);
        
    }
    for (var i = 0; i < preloadSfxs.length; i++){
        preloadSfx(preloadSfxs[i]);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,640,640);
        ctx.fillStyle = "yellow";
        ctx.fillRect(240,300,160*((preloadImages.length+1+i)/len),40);
    }
}

reload();



var tickRate =  60;
var ticks = 0;

setInterval(tick,1000/tickRate);