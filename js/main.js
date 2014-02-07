TrashGame = {};

TrashGame.init = function(){
	$('#loading').hide();
	TrashGame.triggerPause();
	TrashGame.monster.initOffset = TrashGame.monster.domElem.offset().left;
	for(var i = 0; i < TrashGame.trashAmount; i++) {
		var t = $('<img width="'+TrashGame.trashWidth+'" />');
		t.offset({left: TrashGame.initialTrashPosition + i * TrashGame.trashSeparation});
		TrashGame.randomizeTrash(t);
		TrashGame.trashElem.append(t);
	}
	TrashGame.trashElem.children().draggable({ opacity: 0.5, helper: "clone", appendTo: "body", cursor: 'pointer', cursorAt: {left: TrashGame.trashWidth / 2} });
	$('.bin > img').droppable({
		hoverClass: 'onHover',
		activeClass: "onActive",
		drop: function( event, ui ) {
			var parent = $(this).parent(), clickedElem = ui.draggable;
			clickedElem.css('visibility', 'hidden');
			if(clickedElem.hasClass(parent[0].id)) {
				TrashGame.getTrashTypeByKind(parent[0].id).onBin();
			} else {
				$(this).droppable('disable');
				parent.children('.maintenance').show().fadeOut(3000, 'easeInExpo', function(){
					$(this).prev().droppable('enable');
				});
			}
		}
	});
	$(document).keyup(function(e) {
		if(e.which == 80) { //80 is p, for pause
			TrashGame.triggerPause();
		}
	});
	$('.pauseBtn').click(TrashGame.triggerPause);
	TrashGame.monster.run();
	setInterval(TrashGame.draw, TrashGame.frameRate);
};
TrashGame.getTrashTypeByKind = function(kind) {
	for(i = 0, j = TrashGame.trashTypes.length; i < j; i++) {
		if(TrashGame.trashTypes[i].kind === kind) return TrashGame.trashTypes[i];
	}
};

TrashGame.draw = function(){
	if(!TrashGame.paused) {
		//TrashGame.moveBckg(TrashGame.track);
		TrashGame.moveBckg(TrashGame.background);
		TrashGame.bushes.children().each(function(i,e) {
			var elem = $(e);
			var left = elem.position().left - TrashGame.background.speed;
			var stillIn = left >= -TrashGame.bushWidth;
			elem.css('left', left);
			if(!stillIn) {
				elem.remove();
			}
		});
		if(TrashGame.bushes.children().length === 0) TrashGame.monster.acum += TrashGame.monster.speed;
		if(TrashGame.monster.acum >= 1) {
			var monsterOffset = TrashGame.monster.domElem.offset().left;
			TrashGame.monster.domElem.offset({left: monsterOffset+1});
			TrashGame.monster.acum -= 1;
			if(monsterOffset - TrashGame.monster.domElem.parent().offset().left >= TrashGame.monster.threshold) {
				if(confirm('You lose!\n\nReload?')){
					location.reload();
				} else {
					TrashGame.reset();
				}
				//TrashGame.reset();
			}
		}
		TrashGame.trashElem.children().each(function(i,e){
			var elem = $(e);
			var left = elem.position().left - TrashGame.background.speed;
			var stillIn = left >= -TrashGame.trashWidth -20;
			elem.css('left', stillIn ? left : TrashGame.initialTrashPosition + 'px');
			if(!stillIn) {
				TrashGame.randomizeTrash(elem);
			}
		});
	}
};

TrashGame.frameRate = Math.floor(1000 / 30); //time if we want a 30 frameRate
TrashGame.track = {
	domElem: $('#track'),
	speed: 3,
	lastPos: 0
};
TrashGame.background = {
	domElem: $('#main'),
	speed: 3,
	lastPos: 0
};
TrashGame.moveBckg = function(elem) {
	elem.lastPos-= elem.speed;
	yPos = elem.domElem.css('background-position').split(' ')[1];
	elem.domElem.css('background-position', elem.lastPos+'px '+yPos);
};
TrashGame.monster = {
	domElem: $('#monster'),
	speed: 0.2,
	acum: 0,
	threshold: 15,
	initOffset: null,
	images: ['monster+1.gif', 'monster+2.gif'],
	currentImage: 0,
	run: function(){
		setInterval(function(){
			TrashGame.monster.currentImage = (TrashGame.monster.currentImage + 1) % TrashGame.monster.images.length;
			TrashGame.monster.domElem.children().attr('src', 'img/'+TrashGame.monster.images[TrashGame.monster.currentImage]);
		}, TrashGame.frameRate * 5);
	}
};
TrashGame.reset = function() {
	TrashGame.monster.domElem.offset({left: TrashGame.monster.initOffset});
};
TrashGame.trashTypes = [
	{
 		kind: 'paper',
 		imgs: [
 			'http://vector-magz.com/wp-content/uploads/2013/10/juice-box-clip-art1.png',
 			'http://s3.amazonaws.com/rapgenius/1360985415_captain-crunch.jpg',
 			'http://www.staceyreid.com/news/wp-content/uploads/2011/06/milk_carton.png',
 			'img/comics_512x512.png'
 		],
 		onBin: function(){
			TrashGame.score += 5;
			$('#score').children().height(TrashGame.score + '%');
			if(TrashGame.score >= 100) {
				if(confirm('CONGRATULATIONS! You win!\n\nReload?')){
					location.reload();
				} else {
					TrashGame.reset();
				}
			}
 		}
 	},{
		kind: 'organic',
		imgs: [
			'http://images.clipartlogo.com/files/images/19/191023/apple-core_p',
			'http://www.binaryfeast.com/tl_files/binary_feast/sbt_banana.png'
		],
		onBin: function(){
			TrashGame.bushes.append('<img class="bush" src="http://images1.wikia.nocookie.net/__cb20130827065518/clubpenguin/images/c/ca/Bushes-transparent.png", width="'+TrashGame.bushWidth+'" />');
		}
	}
];
TrashGame.trashWidth = 50;
TrashGame.trashSeparation = 150;
TrashGame.trashAmount = Math.ceil($('#main').width() / TrashGame.trashSeparation);
TrashGame.trashElem = $('#trash');
TrashGame.bushes = $('#bushes');
TrashGame.lastTrashPosition = null;
TrashGame.initialTrashPosition = $('#main').width();
TrashGame.paused = false;
TrashGame.score = 0;
TrashGame.bushWidth = 250;
TrashGame.randomizeTrash = function(elem){
	var trashType = TrashGame.trashTypes[Math.round(Math.random())];
	elem.attr({
		'class': trashType.kind,
		'src': trashType.imgs[Math.floor(Math.random() * trashType.imgs.length)]
	});
	elem.css('visibility', 'visible');
};
TrashGame.triggerPause = function() {
	TrashGame.paused = !TrashGame.paused;
	$('#pause').toggle();
};

$( window ).load(function() {
	TrashGame.init();
});
