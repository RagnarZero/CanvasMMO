var socket = io.connect(location.hostname);


//SERVER RESPONSES
//--------------------


//Login success response from server
socket.on('login', function (serverPlayerList) {
	player = serverPlayerList[serverPlayerList.length-1];
	initInput();
	updatePlayerList(serverPlayerList);
	console.log(serverPlayerList);
});


//Notification that a player changed his move vector
socket.on('playervectorchange', function(playerObj){
	for(var i=0; i < gameObjectList.length; i++){
  		if(gameObjectList[i].id == playerObj.id){
    		gameObjectList[i] = playerObj;
  		}
	}
});

//Notification when list of players on server changed
socket.on('updateplayerlist', function(serverPlayerList){
	updatePlayerList(serverPlayerList);
});

//Notification when a player joined the server
socket.on('playerjoined', function (data) {
	addPlayer(data);
});

//Notification when a player changed his name
socket.on('changename', function (data) {
	for(var i=0; i < gameObjectList.length; i++){
    if(gameObjectList[i].id == data.id){
        gameObjectList[i].name = data.name;
    }
}

});

//Notification when a player changed his color
socket.on('changecolor', function (data) {
	for(var i=0; i < gameObjectList.length; i++){
	    if(gameObjectList[i].id == data.id){
	        gameObjectList[i] = data.player;
	        if(data.id == player.id){
	        	player = data.player;
	        }       
	    }
	}
});

//Notification when a message sent by a player is received
socket.on('message', function (data) {
	console.log('received message');
	addChatMessage(data);
});

//CLIENT REQUESTS
//--------------------------------

//Request from player to send out a message
function sendText(messageToSend){
	socket.emit('message', { sender: player, message: messageToSend});
}

//Notification from player that he starts moving
function startMove(player){
	socket.emit('movestart', player);
}

//Notification from player that moving stopped
function endMove(player){
	socket.emit('moveend', player);
}