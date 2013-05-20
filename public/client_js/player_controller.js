var player = null;
var currentIntervalTS = 0;
var lastIntervalTS = 0;


function addChatMessage(data){
	console.log("adding chat message")
	for(var i = 0; i < gameObjectList.length; i++){
		if(gameObjectList[i].id == data.sender.id){
			console.log("for player " + gameObjectList[i].id);
			gameObjectList[i].chatMessage = {message: data.message, ttl: 500};
			break;
		}
	}
}


function updatePlayerMoveVector(){

    if(pressedKeys[37]) {
   		player.movevector.x = - 8;
    }
    else if(pressedKeys[39]) {
    	
    	debugTrackPlayerMove = true;
    	debugPlayerMoveStart = new Date().getTime();

        player.movevector.x =  8;
    }
    else{
    	debugTrackPlayerMove = false;
    	player.movevector.x = 0;
    }

    if(pressedKeys[38]) {
        player.movevector.y = - 8;
    }
    else if(pressedKeys[40]) {
        player.movevector.y =  8;
    }
    else{
    	player.movevector.y = 0;
    }
}

function handleMovement(){
	currentIntervalTS = new Date().getTime();

	var intervalDif = (currentIntervalTS -lastIntervalTS);

	intervalDif = 0;

	for(var i= 0; i < gameObjectList.length; i++){

		gameObjectList[i].xPos = gameObjectList[i].xPos + gameObjectList[i].movevector.x;
		gameObjectList[i].yPos = gameObjectList[i].yPos + gameObjectList[i].movevector.y;
		
		if(gameObjectList[i].id == player.id){
			player.xPos = gameObjectList[i].xPos;							
			player.yPos = gameObjectList[i].yPos;
			player.name = gameObjectList[i].name;
			player.chatMessage = gameObjectList[i].chatMessage;
		}

	}
	
	lastIntervalTS = new Date().getTime();		
}