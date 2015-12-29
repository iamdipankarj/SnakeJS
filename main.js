(function(){

	var Util = {
		COLS : 26,
		ROWS : 26,
		EMPTY : 0,
		SNAKE : 1,
		FRUIT : 2,
		LEFT  : 0,
		UP    : 1,
		RIGHT : 2,
		DOWN  : 3,
		KEY_LEFT : 37,
		KEY_UP : 38,
		KEY_RIGHT : 39,
		KEY_DOWN : 40
	};

	var Game = {
		grid : null,
		width : null,
		height : null,

		init: function(dir, cols, rows) {
			this.width = cols;
			this.height = rows;

			this.grid = [];
			for (var x=0; x < cols; x++) {
				this.grid.push([]);
				for (var y=0; y < rows; y++) {
					this.grid[x].push(dir);
				}
			}
		},

		setGridValue : function(val, x, y) {
			this.grid[x][y] = val;
		},

		getGridValue : function(x, y) {
			return this.grid[x][y];
		},

		setFood : function() {
			var empty = [];
			for (var x=0; x < this.width; x++) {
				for (var y=0; y < this.height; y++) {
					if (this.getGridValue(x, y) === Util.EMPTY) {
						empty.push({x:x, y:y});
					}
				}
			}
			// chooses a random cell
			var newPos = empty[Math.round(Math.random()*(empty.length - 1))];
			this.setGridValue(Util.FRUIT, newPos.x, newPos.y);
		}
	};

	var Snake = {
		direction : null,
		last : null,
		queue : null,

		init: function(dir, x, y) {
			this.direction = dir;
			this.queue = [];
			this.insert(x, y);
		},

		insert: function(x, y) {
			this.queue.unshift({x:x, y:y});
			this.last = this.queue[0];
		},

		remove : function() {
			return this.queue.pop();
		}
	};

	var canvas,
		ctx,
		keystate,
		frames,
		score;

	function run() {
		canvas = document.createElement("canvas");
		canvas.width = Util.COLS*20;
		canvas.height = Util.ROWS*20;
		ctx = canvas.getContext("2d");
		document.body.appendChild(canvas);
		ctx.font = "12px Helvetica";
		frames = 0;
		keystate = {};
		document.addEventListener("keydown", function(evt) {
			keystate[evt.keyCode] = true;
		});
		document.addEventListener("keyup", function(evt) {
			delete keystate[evt.keyCode];
		});
		init();
		loop();
	}

	function init() {
		score = 0;
		Game.init(Util.EMPTY, Util.COLS, Util.ROWS);

		var sp = {
			x : Math.floor(Util.COLS/2), 
			y : Util.ROWS-1
		};

		Snake.init(Util.UP, sp.x, sp.y);
		Game.setGridValue(Util.SNAKE, sp.x, sp.y);
		Game.setFood();
	}

	function loop() {
		update();
		draw();
		window.requestAnimationFrame(loop, canvas);
	}

	function update() {
		frames++;

		if (keystate[Util.KEY_LEFT] && Snake.direction !== Util.RIGHT) {
			Snake.direction = Util.LEFT;
		}
		if (keystate[Util.KEY_UP] && Snake.direction !== Util.DOWN) {
			Snake.direction = Util.UP;
		}
		if (keystate[Util.KEY_RIGHT] && Snake.direction !== Util.LEFT) {
			Snake.direction = Util.RIGHT;
		}
		if (keystate[Util.KEY_DOWN] && Snake.direction !== Util.UP) {
			Snake.direction = Util.DOWN;
		}

		if ( frames % 5 === 0 ) {

			var nx = Snake.last.x;
			var ny = Snake.last.y;

			switch (Snake.direction) {
				case Util.LEFT:
					nx--;
					break;
				case Util.UP:
					ny--;
					break;
				case Util.RIGHT:
					nx++;
					break;
				case Util.DOWN:
					ny++;
					break;
			}

			if (0 > nx || nx > Game.width-1  ||
				0 > ny || ny > Game.height-1 ||
				Game.getGridValue(nx, ny) === Util.SNAKE
			) {
				return init();
			}

			if (Game.getGridValue(nx, ny) === Util.FRUIT) {
				score++;
				Game.setFood();
			} else {
				var tail = Snake.remove();
				Game.setGridValue(Util.EMPTY, tail.x, tail.y);
			}

			Game.setGridValue(Util.SNAKE, nx, ny);
			Snake.insert(nx, ny);
		}
	}

	function draw() {
		var tw = canvas.width/Game.width;
		var th = canvas.height/Game.height;

		for (var x=0; x < Game.width; x++) {
			for (var y=0; y < Game.height; y++) {
				switch (Game.getGridValue(x, y)) {
					case Util.EMPTY:
						ctx.fillStyle = "#fff";
						break;
					case Util.SNAKE:
						ctx.fillStyle = "#0277bd";
						break;
					case Util.FRUIT:
						ctx.fillStyle = "#f44336";
						break;
				}
				ctx.fillRect(x*tw, y*th, tw, th);
			}
		}
		ctx.fillStyle = "#000";
		ctx.fillText("SCORE: " + score, 10, canvas.height-10);
	}

	run();

}());