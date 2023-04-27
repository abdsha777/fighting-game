const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width,canvas.height);

const gravity = 0.7;


//Drawing background

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:"./gameAssets/background.png"
})

//shop
const shop = new Sprite({
    position:{
        x:615,
        y:135
    },
    imageSrc:"./gameAssets/shop.png",
    scale:2.7,
    framesMax:6
})


// player.draw();

const player = new Fighter({
    position:{
        x:100,
        y:0
    },
    velocity:{
        x:0,
        y:3
    },
    imageSrc:"./gameAssets/samuraiMack/idle.png",
    framesMax:8,
    scale:2,
    offset:{
        x:180,
        y:97
    },
    sprites:{
        idle:{
            imageSrc:"./gameAssets/samuraiMack/Idle.png",
            framesMax:8
        },
        run:{
            imageSrc:"./gameAssets/samuraiMack/Run.png",
            framesMax:8
        },
        jump:{
            imageSrc:"./gameAssets/samuraiMack/Jump.png",
            framesMax:2
        },
        fall:{
            imageSrc:"./gameAssets/samuraiMack/Fall.png",
            framesMax:2
        },
        attack1:{
            imageSrc:"./gameAssets/samuraiMack/Attack1.png",
            framesMax:6
        },
        takeHit:{
            imageSrc:"./gameAssets/samuraiMack/take Hit - white silhouette.png",
            framesMax:4
        },
        death:{
            imageSrc:"./gameAssets/samuraiMack/Death.png",
            framesMax:6
        }
    },
    attackbox:{
        offset:{
            x:65,
            y:50
        },
        width:130,
        height:60
    }
});


const enemy = new Fighter({
    position:{
        x:760,
        y:100
    },
    velocity:{
        x:0,
        y:3
    },
    imageSrc:"./gameAssets/kenji/idle.png",
    framesMax:4,
    scale:2,
    offset:{
        x:180,
        y:105
    },
    sprites:{
        idle:{
            imageSrc:"./gameAssets/kenji/Idle.png",
            framesMax:4
        },
        run:{
            imageSrc:"./gameAssets/kenji/Run.png",
            framesMax:8
        },
        jump:{
            imageSrc:"./gameAssets/kenji/Jump.png",
            framesMax:2
        },
        fall:{
            imageSrc:"./gameAssets/kenji/Fall.png",
            framesMax:2
        },
        attack1:{
            imageSrc:"./gameAssets/kenji/Attack1.png",
            framesMax:4
        },
        takeHit:{
            imageSrc:"./gameAssets/kenji/take hit.png",
            framesMax:3
        },
        death:{
            imageSrc:"./gameAssets/kenji/Death.png",
            framesMax:7
        }
    },
    attackbox:{
        offset:{
            x:-140,
            y:65
        },
        width:120,
        height:60
    }
});
// enemy.draw();
// console.log(player);

const keys = {
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    w:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowUp:{
        pressed:false
    }
}



decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle="black";
    c.fillRect(0,0,canvas.width,canvas.height);

    background.update(); //background
    shop.update(); //shop
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();
    
    player.velocity.x=0;
    enemy.velocity.x=0;
    //Player
    

    if (keys.a.pressed && player.lastKey=='a'){
        player.velocity.x=-5;
        player.switchSprite('run');
    }
    else if(keys.d.pressed && player.lastKey=='d'){
        player.velocity.x=5;
        player.switchSprite('run');
    }
    else{
        player.switchSprite('idle');
    }

    // player jump
    if(player.velocity.y<0 ){
        player.switchSprite('jump');
    }
    else if(player.velocity.y>0){
        player.switchSprite('fall');
    }

    //enemy
    if (keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
        enemy.velocity.x=-5;
        enemy.switchSprite('run');
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight'){
        enemy.velocity.x=5;
        enemy.switchSprite('run');
    }
    else{
        enemy.switchSprite('idle');
    }

    // enemy jump
    if(enemy.velocity.y<0 ){
        enemy.switchSprite('jump');
    }
    else if(enemy.velocity.y>0){
        enemy.switchSprite('fall');
    }

    //detect collision and hitts

    if(rectgularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.framesCurrent===4){
        enemy.takeHit();
        player.isAttacking=false;
        document.querySelector('.enemyHealthInner').style.width = enemy.health+'%';
    }

    //if player misses
    if(player.isAttacking &&  player.framesCurrent===4){
        player.isAttacking=false;
    }

    if(rectgularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isAttacking && enemy.framesCurrent==2){
        enemy.isAttacking=false;
        player.takeHit()
        document.querySelector('.playerHealthInner').style.width = player.health+'%';
    }

    //if enemy misses
    if(enemy.isAttacking &&  enemy.framesCurrent===2){
        enemy.isAttacking=false;
    }

    //ending the game via health
    if(enemy.health<=0 || player.health<=0){
        determineWinner({player,enemy,timerId});
    }
}

animate();

window.addEventListener('keydown',(event)=>{
    // console.log(event.key) 
    if(!player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed=true;
                player.lastKey='d';
            break;
            case 'a':
                keys.a.pressed=true;
                player.lastKey='a';
            break;
            case 'w':
                player.velocity.y = -20;
            break;
    
            //attacks
            case ' ':
                player.attack();
            break;
        }
    }
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed=true;
                enemy.lastKey='ArrowRight';
            break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed=true;
                enemy.lastKey='ArrowLeft';
            break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
            break;
            case 'ArrowDown':
                enemy.attack();
            break;
        }
    }   
})
window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed=false;
        break;
        case 'a':
            keys.a.pressed=false;
        break;
    }

    //enemy
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed=false;
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false;
        break;
    }
})