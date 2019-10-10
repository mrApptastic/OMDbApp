var mrSnakey = function (elem, width, height) {
	var mrS = this;
	mrS.elm = document.getElementById(elem);
	mrS.ctx = mrS.elm.getContext("2d");
	mrS.set = { wdt : (width ? width : 800), hgt : (height ? height : 800) };
	mrS.pen = { x : 5, y : 5, mX : true, mY : true, size : 5, step: 1, speed : 5, shift : 500, animation : null, count : 0, path : [] };
	mrS.setBackground = function () {
		mrS.ctx.fillStyle = "#392C10"; 
		mrS.ctx.fillRect(0,0,mrS.set.wdt,mrS.set.hgt); 
		mrS.ctx.fillStyle = "#C6BA73";
	};
	mrS.setStartScreen = function () {
		var offsetX = mrS.set.wdt / 20; 
		var offsetY = mrS.set.hgt / 10; 
		var row = mrS.set.hgt / 20; 
		var middle = mrS.set.wdt / 2;
		var highscore = mrS.getHighScore();	
		mrS.setBackground();			
		mrS.ctx.fillRect(offsetX,offsetX,mrS.set.wdt - 2 * offsetX,mrS.set.hgt - 2 * offsetY);
		mrS.ctx.fillText("Snake Mr. Movie", middle - 160, 30); 
		mrS.ctx.fillStyle = "#392C10";
		mrS.ctx.fillText("Press 's' to start...", middle - 200, row * 4);
		for (let i = 0; i < highscore.length; i++) {
			mrS.ctx.fillText(i + 1 + "- " + highscore[i].Score + " - " + highscore[i].Name, middle - 250, row * (6 + i *2));
		}
	};
	mrS.getHighScore = function () {
		var highscore = new Array();
		var high = localStorage["HighScore"];
		if  (high) {
			highscore = JSON.parse(high);
		}
		return highscore;
	};
	mrS.stopGame = function() {
		mrS.stop();
		let highscore = mrS.getHighScore();
		if (highscore.length < 5 || mrS.pen.count > highscore[4].Score) {
			var name = prompt("Enter Name for High Score");
			highscore.push({"Name" : name, "Score" : mrS.pen.count});
			highscore = highscore.sort(function (x, y) {
				return y.Score - x.Score;
			});			 
			while (highscore.length > 5) {
				highscore.pop();
			}			
			localStorage["HighScore"] = JSON.stringify(highscore);
		}
		mrS.pen = JSON.parse(mrS.copy); 
		mrS.setStartScreen();
	};
	mrS.startGame = function() {
		mrS.setBackground(); 
		mrS.start();
	};
	mrS.copy = JSON.stringify(mrS.pen);
	mrS.draw = function () {
		if (mrS.pen.mX === true) {
			mrS.pen.x += mrS.pen.step;
		}
		else if (mrS.pen.mX === false) {
			mrS.pen.x -= mrS.pen.step;
		}		
		if (mrS.pen.mY === true) {
			mrS.pen.y += mrS.pen.step;
		}
		else if (mrS.pen.mY === false) {
			mrS.pen.y -= mrS.pen.step
		}
		mrS.ctx.fillRect(mrS.pen.x, mrS.pen.y, mrS.pen.size, mrS.pen.size);
		mrS.pen.count++;			
		mrS.check();	
		mrS.pen.path.push({x : mrS.pen.x, y : mrS.pen.y});		
	};
	mrS.check = function () {
		var x = mrS.pen.x; var y = mrS.pen.y; 
		var w = mrS.set.wdt; var h = mrS.set.hgt; 
		var p = mrS.pen.path;	
		if ((p.some(u => (u.x === x) && (u.y === y))) || 
			 x >= w || x <= 0 || y >= h || 	y <= 0) {
				mrS.stopGame();
			}
		if (mrS.pen.animation) {
			if (mrS.pen.speed > 1 && mrS.pen.count % mrS.pen.shift === 0) {
				mrS.stop(); 
				mrS.pen.speed--; 
				mrS.start();			
			}
			else if (mrS.pen.speed === 1 && mrS.pen.count % mrS.pen.shift === 0) {
				mrS.pen.step++; 
				mrS.pen.shift = 1000 * mrS.pen.step;
			}
		}
	};
	mrS.start = function() {
		mrS.pen.animation = setInterval(mrS.draw, mrS.pen.speed); 
	};
	mrS.stop = function() {
		clearInterval(mrS.pen.animation);
	};
	mrS.ini = function () {
		if (width) {
			mrS.elm.width = mrS.set.wdt;
		}
		if (height) {
			mrS.elm.height = mrS.set.hgt;
		}
		mrS.ctx.font = "30px 'DeathStar'";
		mrS.ctx.strokeStyle = "#C6BA73"; 
		mrS.setStartScreen();
		window.onkeydown = function (e) {
			e.preventDefault();			
			if (!mrS.pen.animation && e.keyCode === 83) {
				mrS.startGame();
			}			
			switch (e.keyCode) {
				case 36: mrS.pen.mX = false; mrS.pen.mY = false; break;
				case 38: mrS.pen.mX = null; mrS.pen.mY = false; break;
				case 33: mrS.pen.mX = true; mrS.pen.mY = false; break;
				case 37: mrS.pen.mX = false; mrS.pen.mY = null; break;
				case 39: mrS.pen.mX = true; mrS.pen.mY = null; break;
				case 35: mrS.pen.mX = false; mrS.pen.mY = true; break;
				case 40: mrS.pen.mX = null; mrS.pen.mY = true; break;
				case 34: mrS.pen.mX = true; mrS.pen.mY = true; break;
				default: break;
			}
		};
	};
	mrS.ini();
};