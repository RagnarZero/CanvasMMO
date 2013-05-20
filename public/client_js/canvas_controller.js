
var windowHeight;
var windowWidth;
var ctx;
var blockSize = 50;

function initCanvas(canvasId){
	var c = document.getElementById(canvasId);
				
	ctx=c.getContext("2d");
	
	windowHeight = $(window).height();
	windowWidth = $(window).width();

	$('#'+canvasId).attr('height',windowHeight);
	$('#'+canvasId).attr('width',windowWidth);

	

	window.requestAnimFrame = (
		function(callback) {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
				function(callback) {
  					window.setTimeout(callback, 1000 / 60);
				};
		}
	)();

  	function animate() {
        
  		handleMovement();

        // clear
        ctx.clearRect(0, 0, windowWidth, windowHeight);

        //Main draw loop
		for(var i = 0; i < gameObjectList.length; i++){

			//drawRect(gameObjectList[i].xPos, gameObjectList[i].yPos, blockSize, blockSize, 0,gameObjectList[i].color, 100);
			drawChar(gameObjectList[i].sprite,gameObjectList[i].xPos, gameObjectList[i].yPos, gameObjectList[i].cb);
			drawText(gameObjectList[i].name,gameObjectList[i].xPos + (blockSize/2), gameObjectList[i].yPos - 10);

			if(typeof gameObjectList[i].chatMessage !== undefined && gameObjectList[i].chatMessage != null){
				if(gameObjectList[i].chatMessage.ttl > 0){
					drawText(gameObjectList[i].chatMessage.message,gameObjectList[i].xPos + (blockSize/2), gameObjectList[i].yPos + blockSize+ 20);
					gameObjectList[i].chatMessage.ttl--;
				}
				else{
					gameObjectList[i].chatMessage = null;								
				}
			}
        }

        
   
    // request new frame
    requestAnimFrame(function() {
      animate();
    });
	}
	animate();
}

function drawText(text, xPos, yPos){
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
    ctx.font = "bold 16px Arial";
    ctx.fillText(text, xPos, yPos);
}

function drawRect(xPos, yPos, rectWidth, rectHeight, roundRadius, color, opacity){
	ctx.beginPath();		
	ctx.fillStyle = "rgba("+color.red+", "+color.green+", "+color.blue+", "+opacity/100+")";    
    ctx.strokeStyle = "rgba(0, 0, 0, "+opacity/100+")";   
    ctx.lineWidth = 7;
    ctx.moveTo(xPos + roundRadius, yPos);
    ctx.lineTo(xPos+rectWidth - roundRadius, yPos);
    ctx.quadraticCurveTo(xPos + rectWidth, yPos, xPos + rectWidth, yPos + roundRadius);
    ctx.lineTo(xPos + rectWidth, yPos + rectHeight - roundRadius);
    ctx.quadraticCurveTo(xPos + rectWidth , yPos+ rectHeight , xPos + rectWidth - roundRadius, yPos + rectHeight);
    ctx.lineTo(xPos + roundRadius, yPos + rectHeight );
	ctx.quadraticCurveTo(xPos , yPos+ rectHeight , xPos , yPos + rectHeight- roundRadius);
	ctx.lineTo(xPos, yPos + roundRadius );
	ctx.quadraticCurveTo(xPos , yPos , xPos + roundRadius, yPos );
    ctx.closePath();
    ctx.fill();  
   	ctx.stroke();
}

function drawChar(objSprite,xPos, yPos, cb){
	var sprite = new Image();
	//Use cachebuster to determine redraw
	sprite.src = objSprite + "?" + cb;		
	ctx.drawImage(sprite, xPos, yPos);
}

