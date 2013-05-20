var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


var fs = require('fs')
  , gm = require('gm');

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
  var randomColorHex = rgbToHex(randomRed, randomGreen, randomBlue); 

  changeColor(socket.id, randomColorHex);

 
  var player = { id: socket.id ,name: 'Player'+playerList.length, color: randomColor, xPos: 50.0, yPos: 50.0, movevector: {x: 0, y:0}, sprite: 'charGen'+socket.id+'.png', cb: new Date().getTime() };
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
      //socket.emit('changecolor',{color: data.message.substr(7)});
      var newColor = data.message.substr(7);
      for(var i=0; i < playerList.length; i++){
        if(playerList[i].id == socket.id){
          changeColor(socket.id, newColor);
          playerList[i].color = newColor;
          playerList[i].cb = new Date().getTime();
          io.sockets.emit('changecolor',{player:playerList[i], id: socket.id});
          break;
        }
      }
    }
    else{
      io.sockets.emit('message', data);
  }
  });
});

//Image Manipulation
function changeColor(playerId,colorAsHex){
 
  var colorAsRGB = hexToRgb(colorAsHex);
  var randomColorRed =  parseInt(colorAsRGB.r)-22;
  var randomColorGreen = parseInt(colorAsRGB.g)-22;
  var randomColorBlue = parseInt(colorAsRGB.b)-23;

  var randomColorHexDarker = rgbToHex(randomColorRed, randomColorGreen, randomColorBlue);
  
  console.log("Color as HEX: " + colorAsHex);
  console.log("Color as RGB: " + colorAsRGB.r + ','  + colorAsRGB.g + ',' + colorAsRGB.b);
  console.log("Color darker as HEX: " + randomColorHexDarker+ " Red:" + randomColorRed);

  // exchange pixel of color in fill with opaque color
  gm(__dirname + '/public/char.png')
  .fill(colorAsHex)
  .opaque('#E1D082')
  .fill(randomColorHexDarker)
  .opaque('#CBBA6B')
  .write(__dirname + '/public/charGen'+playerId+'.png', function(err){
    if(err){
      console.log('Error while converting image: ' + err);
    }
  });


}


//Utiliy functions
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}