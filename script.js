		MAX_DEPTH = 64; //64

		var startzone = 150; //100

		var canvas, ctx;
		var stars = new Array(2048); // 2048

		var cursorX, cursorY = 100;
		var mouseX, mouseY = 0;


		var moveModifier = 0.5;
		var speedModifier = 50;


		var modifiedWidth = 0;
		var modifiedHeight = 0;

		var starfieldPos = {
			x: 0,
			y: 0
		};

		var halfWidth, halfHeight;


		var speed = 0.2; //0.2

		var colors = ['#FFAAAA',
			'#AAFFAA',
			'#AAAAFF',
			'#FFAAFF',
			'#FFFFFF',
			'#FFFF00'
		];

		var mapped = {
			x: 0,
			y: 0
		};

		var screenWidth = 0;
		var screenHeight = 0;



		function Vec2(x, y) {
			this.x = x;
			this.y = y;
		}

		function Vec4(x, y, z, w) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}

		window.addEventListener("keydown", function(event){
			if(event.key === "w" || event.key === "ArrowUp") {
				speed += 0.05;
				if(speed >= 1.0) speed = 1.0;
			} else if(event.key === "s" || event.key === "ArrowDown") {
				speed -= 0.05;
				if(speed <= 0.0) speed = 0.0;
			} else if(event.key === " ") {
				console.log('warp')
			}
		})


		var stats = null;


		function init() {
			canvas = document.getElementById("myCanvas");
			screenWidth = canvas.width = window.innerWidth;
			screenHeight = canvas.height = window.innerHeight;

			modifiedWidth = screenWidth * moveModifier;
			modifiedHeight = screenHeight * moveModifier;

			starfieldPos.x = halfWidth = canvas.width / 2;
			starfieldPos.y = halfHeight = canvas.height / 2;

			if (canvas && canvas.getContext) {
				ctx = canvas.getContext("2d");
				initStars();
				setInterval(update, 17); //17
				//requestAnimationFrame(loop);
			}

			//debug stuff
			stats = new Stats();
			stats.setMode(0);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';
			document.body.appendChild(stats.domElement);

		}

		document.onmousemove = function (e) {
			mouseX = cursorX = (e.pageX);
			mouseY = cursorY = (e.pageY);


			if (isNaN(mouseX)) mouseX = 0;
			if (isNaN(mouseY)) mouseY = 0;
		}

		function randomRange(minVal, maxVal) {
			return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
		}

		function initStars() {
			for (var i = 0; i < stars.length; i++) {
				stars[i] = new Star();
			}
		}


		function Star() {
			//create initial Position in 3D space
			this.x = randomRange(-startzone, startzone);
			this.y = randomRange(-startzone, startzone);
			this.z = randomRange(1, MAX_DEPTH);

			var color = hexToRGB(colors[randomRange(0, colors.length)]);
			//var color = hexToRGB('#FFFFFF');

			this.r = color.r;
			this.g = color.g;
			this.b = color.b;

			this.size = randomRange(3, 6);

		}


		function update() {
			stats.begin();


			clearScreen();
			dampMouseInput();
			moveStarfieldMapped();


			for (var i = 0; i < stars.length; i++) {
				stars[i].z -= speed;

				if (stars[i].z <= 0) {
					stars[i].x = randomRange(-startzone, startzone);
					stars[i].y = randomRange(-startzone, startzone);
					stars[i].z = randomRange(50, MAX_DEPTH);
				}

				var k = 128.0 / stars[i].z;
				var px = stars[i].x * k + mapped.x;
				var py = stars[i].y * k + mapped.y;

				if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
					var size = (1 - stars[i].z / MAX_DEPTH) * stars[i].size; //3/
					var shade = parseFloat((1 - stars[i].z / MAX_DEPTH));
					ctx.fillStyle = `rgba(${stars[i].r}, ${stars[i].g}, ${stars[i].b}, ${shade})`;
					ctx.fillRect(px, py, size, size);
					
				}
			}


			stats.end();
		}


		function drawRedDot() {
			//draws red dot in center
			//for debug only
			ctx.fillStyle = "#F00";
			ctx.fillRect(mapped.x, mapped.y, 5, 5);
		}


		function hexToRGB(hex) {
			var hex2 = hex.replace("#", "");

			var r = hex2.slice(0, 2);
			var g = hex2.slice(2, 4);
			var b = hex2.slice(4, 6);

			r = parseInt(r, 16);
			g = parseInt(g, 16);
			b = parseInt(b, 16);


			return {
				'r': r,
				'g': g,
				'b': b
			};
		}

		function clearScreen() {
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		function setMousePos() {
			var x = (cursorX + halfWidth);
			var y = (cursorY + halfHeight);

			if (isNaN(x)) {
				x = 0;
			}

			if (isNaN(y)) {
				y = 0;
			}

			return {
				'x': x,
				'y': y
			};
		}

		function moveStarfieldMapped() {
			//move Starfield with a reduced movement
			mapped.x = map(starfieldPos.x, screenWidth, modifiedWidth); // + halfWidth;
			mapped.y = map(starfieldPos.y, screenHeight, modifiedHeight); // + halfHeight;

		}

		function map(a, b, size) {
			//mapping a values into another scale
			var orgPart = b / 100;
			var mapPart = size / 100.0;
			var countOrg = a / orgPart;
			var mapCount = countOrg * mapPart;

			return mapCount;
		}




		function dampMouseInput() {
			//damp the movement of the mouse, based on old Position (starfieldPos)
			if (isNaN(starfieldPos.x)) starfieldPos.x = 0;
			if (isNaN(starfieldPos.y)) starfieldPos.y = 0;

			var distance = {
				x: 0,
				y: 0
			};

			if (mouseX == undefined) mouseX = halfWidth;
			if (mouseY == undefined) mouseY = halfHeight;

			distance.x = mouseX - starfieldPos.x;
			distance.y = mouseY - starfieldPos.y;

			//center starfield
			distance.x += halfWidth;
			distance.y += halfHeight;

			var speed = {
				x: 0,
				y: 0
			};


			speed.x = Math.floor(distance.x / speedModifier);
			speed.y = Math.floor(distance.y / speedModifier);

			starfieldPos.x += speed.x;
			starfieldPos.y += speed.y;

		}