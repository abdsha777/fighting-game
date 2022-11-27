function rectgularCollision({rectangle1,rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y +rectangle1.attackBox.height >= rectangle2.position.y 
        && rectangle1.attackBox.position.y <=rectangle2.position.y + rectangle2.height)
    
}

function determineWinner({player,enemy}){
    clearTimeout(timerId)
    if(gameOn){
        if(player.health === enemy.health){
            result.innerHTML="TIE";
        }
        else if(player.health > enemy.health){
            result.innerHTML="Player 1 Wins";
        }
        else if(player.health < enemy.health){
            result.innerHTML="Player 2 Wins";
        }
        gameOn=false;
    }
}
let gameOn=true;
let timer=60;
let timerId;
const result=document.querySelector('.result');
function decreaseTimer(){
    if(timer>0){
        timerId = setTimeout(decreaseTimer,1000);
        timer--;
        document.querySelector('.timer').innerHTML=timer;
    }
    if(timer===0){
        determineWinner({player,enemy,timerId});
    }
}