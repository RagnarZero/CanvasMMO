var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


app.use(express.static(__dirname + '/public'));
server.listen(4242);



var playerList = new Array();
var playerMoveMap = new Array();

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});



io.sockets.on('connection', function (socket) {

  var randomRed = Math.floor((Math.random()*255)+0);
  var randomGreen = Math.floor((Math.random()*255)+0);
  var randomBlue = Math.floor((Math.random()*255)+0); 

  var randomColor = {red: randomRed, blue: randomBlue, green: randomGreen};

  var player = { id: socket.id ,name: 'Player'+playerList.length, color: randomColor, xPos: 50.0, yPos: 50.0, movevector: {x: 0, y:0}, sprite: "char.png" };
  var playerMove = {player: player, ts: 0};

  playerList.push(player);
  playerMoveMap.push(playerMove);




  console.log("A player joined: " + socket.id);

  socket.emit('login', playerList);
  
  io.sockets.emit('playerjoined', playerList[playerList.length-1]);

  socket.on('disconnect', function(){
    
    console.log("A PLAYER IS disconnecting!!!");

    for(var k= 0; k < playerList.length; k++){
        console.log('PlayerId: ' + playerList[k].id);
        console.log('SocketId:' + socket.id);

        if(playerList[k].id == socket.id){
          console.log("A player left: " + socket.id);
          playerList.splice(k, 1);
          playerMoveMap.splice(k, 1);
          break;
        }
    }
     

    io.sockets.emit('updateplayerlist', playerList);

  });


  //Broadcast player move

  socket.on('move', function (player){

    for(var i=0; i < playerList.length; i++){
      if(playerList[i].id == player.id){
        playerList[i].xPos = player.xPos;
        playerList[i].yPos = player.yPos;
        break;
      }
    }

    io.sockets.emit('move', player);
  });

  socket.on('movestart', function(player){
    var startMoveTime = new Date().getTime();
    console.log(player.name + " started move at " + startMoveTime);
    console.log("Player X is " + player.xPos);
    

    for(var i=0; i < playerMoveMap.length; i++){
      if(playerMoveMap[i].player.id == player.id){
           playerList[i] = player;
          var playerMove = {player: playerList[i], ts: startMoveTime};
          playerMoveMap[i] = playerMove;
           io.sockets.emit('playervectorchange', playerList[i]);
           break;
      }
    }
    
   

  });

  socket.on('moveend', function(player){
    var endMoveTime = new Date().getTime();
    console.log(player.name + " stopped the move at " + endMoveTime);



    for(var i=0; i < playerMoveMap.length; i++){
      if(playerMoveMap[i].player.id == player.id){

         var timeDiff = endMoveTime - playerMoveMap[i].ts;

         playerList[i] = player;
         playerList[i].xPos = player.xPos + Math.floor( (playerMoveMap[i].player.movevector.x * (timeDiff/300) ));
         playerList[i].yPos = player.yPos + Math.floor( (playerMoveMap[i].player.movevector.y * (timeDiff/300) ));

         console.log('Server: Player moved for' + timeDiff + 'ms');

         playerMoveMap[i].player = playerList[i];
         io.sockets.emit('playervectorchange', playerList[i]);
        break;
      }
    }

  });

  socket.on('message', function (data) {
    if(data.message.substr(0, 6) == '/name '){
      var newName = data.message.substr(6);
      for(var i=0; i < playerList.length; i++){
        if(playerList[i].id == socket.id){
          playerList[i].name = newName;
          io.sockets.emit('changename',{name: newName, id: socket.id});
          break;
        }
      }
      
    }
    else if(data.message.substr(0, 7) == '/color '){
      socket.emit('changecolor',{color: data.message.substr(7)});
    }
    else{
      io.sockets.emit('message', data);
  }
  });
});