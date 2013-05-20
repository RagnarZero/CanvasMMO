var pressedKeys = [];

function initInput(){
	$(document.body).keydown(function (e) {
		if(!pressedKeys[e.keyCode]){
			pressedKeys[e.keyCode] = true;
			if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
				updatePlayerMoveVector();
				startMove(player);
			}	
		}
	});

	$(document.body).keyup(function (e) {
		if(pressedKeys[e.keyCode]){
			pressedKeys[e.keyCode] = false;
			if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
				updatePlayerMoveVector();
				endMove(player);
			}			
		}
	});

	$(document.body).keypress(function (e) {
		if(e.keyCode == 13){
			if(!chatWindowVisible){
				chatWindowVisible = true;
				$('#chatInputContainer').show();
				$('#chatInput').focus();	
			}
			else{
				chatWindowVisible = false;
				sendText($('#chatInput').val());
				$('#chatInput').val('');
				$('#chatInputContainer').hide();
				$('#mainCanvas').focus();
			}
			
		}
		
		
	});


}