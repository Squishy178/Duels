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

    Game.camera={x:0,y:0}
    Game.globalPos2Dx=function(x){//These functions are for placing coords on the global map, camera included-
        return (x-Game.camera.x);
    }
    Game.globalPos2Dy=function(y){
        return (y-Game.camera.y);
    }
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
    Game.canvas.global.image=function(c,img,x,y,sx,sy,rotation){//c is the ctx. The canvas. Please use that for c
        var image=new Image();
        image.src=img;	
        c.save();
        c.translate(Game.globalPos2Dx(x-(sx/2)), Game.globalPos2Dy(y-(sy/2))); // translate to rectangle center
        c.rotate(rotation); 
        c.drawImage(image, -sx/2, -sy/2,sx,sy);
        c.restore();}//I would use this function. It will help with the camera
    Game.canvas.local.image=function(c,img,x,y,sx,sy,rotation){//c is the ctx. The canvas. Please use that for c
        var image=new Image();
        image.src=img;	
        c.save();
        c.translate(x-(sx/2), y-(sy/2)); // translate to rectangle center
        c.rotate(rotation); 
        c.drawImage(image, -sx/2, -sy/2,sx,sy);
        c.restore();}//I still would use this function. It is best. Sometimes
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

    Game.sample.cameraSmooth2D=function(desiredX,desiredY,ease){
        Game.camera.x+=(desiredX-Game.camera.x)/ease;
        Game.camera.y+=(desiredY-Game.camera.y)/ease;
    }
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
function preloadImage(url)
{
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

//---------------------------------------------------- DRAW -----------------------------------
function draw(){
    if (canvas.getContext) {
        
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.font = "20px serif";
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