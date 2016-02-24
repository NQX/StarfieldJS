		MAX_DEPTH = 64;  //64

		var startzone = 150; //100

		var canvas, ctx;
		var stars = new Array(2048);  //1024 // 2048

		var cursorX, cursorY = 100;
		

		var moveModifier = 0.2;

		var halfWidth, halfHeight;
		

		var speed = 0.2;

		var colors = [ '#FFAAAA',
						'#AAFFAA',
						'#AAAAFF',
						'#FFAAFF',
						'#FFFFFF',
						'#FFFF00'
					];

					

	function vec2(x, y){
		this.x = x;
		this.y = y;
	}

	function vec4(x, y, z, w){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w; 
	}


		function init(){
			canvas = document.getElementById("myCanvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			halfWidth = canvas.width / 2;
			halfHeight = canvas.height / 2;

			if(canvas && canvas.getContext){
				ctx = canvas.getContext("2d");
				initStars();
				//setInterval(loop, 17);
				requestAnimationFrame(loop);
			}
			
		}

		document.onmousemove = function(e){
			cursorX = -(e.pageX);
			cursorY = -(e.pageY);
		}

		function randomRange(minVal, maxVal){
			return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
		}

		function initStars(){
			for(var i = 0; i < stars.length; i++){
				stars[i] = new Star();
			}
		}


		function Star(){
			this.x = randomRange(-startzone, startzone);
			this.y = randomRange(-startzone, startzone);
			this.z = randomRange(1, MAX_DEPTH);
			
			var color = hexToRGB(colors[randomRange(0, colors.length)]);

			this.r = color.r;
			this.g = color.g;
			this.b = color.b;

			this.size = randomRange(3, 6);
		}


		function loop(){
			var mousePos = setMousePos();

			//Clear Screen
			clearScreen();

			for(var i = 0; i < stars.length; i++){
				stars[i].z -= speed;

				if(stars[i].z <= 0){
					stars[i].x = randomRange(-startzone, startzone);
					stars[i].y = randomRange(-startzone, startzone);
					stars[i].z = randomRange(1, MAX_DEPTH);
				}

				var k = 128.0 / stars[i].z;	
				var px = stars[i].x * k + halfWidth + mousePos.x;
				var py = stars[i].y * k + halfHeight + mousePos.y;

				if(px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height){
					var size = (1 -stars[i].z / MAX_DEPTH) * stars[i].size; //3/
					var shade = parseInt((1 - stars[i].z / MAX_DEPTH) * 255);
					//ctx.fillStyle = "rgba(" + shade + "," + shade + "," + shade + "," + shade + ")";
					ctx.fillStyle = "rgba(" + stars[i].r + "," + stars[i].g + "," + stars[i].b + "," + shade + ")";
					ctx.fillRect(px, py, size, size);
				}
			}

			requestAnimationFrame(loop);
		}


		function hexToRGB(hex){
			var hex2 = hex.replace("#", "");
			
			var r = hex2.slice(0,2);
			var g = hex2.slice(2,4);
			var b = hex2.slice(4,6);

			r = parseInt(r, 16);
 			g = parseInt(g, 16);
 			b = parseInt(b, 16);


			return {'r' : r,
					'g' : g,
					'b' : b
				};
		}

		function clearScreen(){
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		function setMousePos(){
			var x = (cursorX + halfWidth) * moveModifier;
			var y = (cursorY + halfHeight) * moveModifier;

			if(isNaN(x)){
				x = 0;	
			}

			if(isNaN(y)){
				y = 0;
			}

			return {'x' : x,
					'y' : y 
				   };
		}