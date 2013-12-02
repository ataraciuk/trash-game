TrashGame = {};

TrashGame.init = function(){
	TrashGame.monster.initOffset = TrashGame.monster.domElem.offset().left;
	for(var i = 0; i < TrashGame.trashAmount; i++) {
		var t = $('<img width="'+TrashGame.trashWidth+'" />');
		t.offset({left: TrashGame.initialTrashPosition + i * TrashGame.trashSeparation});
		TrashGame.randomizeTrash(t);
		TrashGame.trashElem.append(t);
	}
	TrashGame.trashElem.children().click(function(e){
		e.preventDefault();
		TrashGame.trashElem.children().removeClass('clicked');
		$(this).addClass('clicked');
	})
	$(document).keyup(function(e) {
		if(e.which == 80) { //80 is p, for pause
			TrashGame.triggerPause();
		}
	});
	setInterval(TrashGame.draw, TrashGame.frameRate);
};

TrashGame.draw = function(){
	if(!TrashGame.paused) {
		TrashGame.moveBckg(TrashGame.track);
		TrashGame.moveBckg(TrashGame.background);
		TrashGame.monster.acum += TrashGame.monster.speed;
		if(TrashGame.monster.acum >= 1) {
			var monsterOffset = TrashGame.monster.domElem.offset().left;
			TrashGame.monster.domElem.offset({left: monsterOffset+1});
			TrashGame.monster.acum -= 1;
			if(monsterOffset >= TrashGame.monster.threshold) {
				if(confirm('You lose!\n\nReload?')){
					location.reload();
				} else {

				}
				//TrashGame.reset();
			}
		}
		TrashGame.trashElem.children().each(function(i,e){
			var elem = $(e);
			var left = elem.position().left - TrashGame.track.speed;
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
	speed: 1,
	lastPos: 0
};
TrashGame.moveBckg = function(elem) {
	elem.lastPos-= elem.speed;
	yPos = elem.domElem.css('background-position').split(' ')[1];
	elem.domElem.css('background-position', elem.lastPos+'px '+yPos);
};
TrashGame.monster = {
	domElem: $('#monster'),
	speed: 0.3,
	acum: 0,
	threshold: 415,
	initOffset: null
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
 			'http://yourdesignmagazine.com/wp-content/uploads/2013/02/comics_512x512.png'
 		]
 	},{
		kind: 'organic',
		imgs: [
			'http://images.clipartlogo.com/files/images/19/191023/apple-core_p',
			'http://www.binaryfeast.com/tl_files/binary_feast/sbt_banana.png'
		]
	}
];
TrashGame.trashWidth = 50;
TrashGame.trashSeparation = 150;
TrashGame.trashAmount = Math.ceil($('#main').width() / TrashGame.trashSeparation);
TrashGame.trashElem = $('#trash');
TrashGame.lastTrashPosition = null;
TrashGame.initialTrashPosition = $('#main').width();
TrashGame.paused = false;
TrashGame.score = 0;
TrashGame.randomizeTrash = function(elem){
	var trashType = TrashGame.trashTypes[Math.round(Math.random())];
	elem.attr({
		'class': trashType.kind,
		'src': trashType.imgs[Math.floor(Math.random() * trashType.imgs.length)]
	});
	elem.show();
};
TrashGame.triggerPause = function() {
	TrashGame.paused = !TrashGame.paused;
	$('#pause').toggle();
};

$(function() {
	TrashGame.init();
});
