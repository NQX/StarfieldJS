		MAX_DEPTH = 64;  //64

		var startzone = 150; //100

		var canvas, ctx;
		var stars = new Array(2048);  //1024 // 2048

		var cursorX, cursorY;
		var offsetX, offsetY;

		var moveModifier = 0.2;

		var halfWidth, halfHeight;

		var colors = [ '#FFAAAA',
						'#AAFFAA',
						'#AAAAFF',
						'#FFAAFF',
						'#FFFFFF',
						'#FFFF00'
					];

	var colors2 = [ '#FF0000'];
					

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
				stars[i] = {
					x : randomRange(-startzone, startzone),
					y : randomRange(-startzone, startzone),
					z : randomRange(1, MAX_DEPTH),
					color : colors[randomRange(0, colors.length)]
				}
			}
		}

		function loop(){
			setMousePos();
			console.log(cursorX);

			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for(var i = 0; i < stars.length; i++){
				stars[i].z -= 0.2;

				if(stars[i].z <= 0){
					stars[i].x = randomRange(-startzone, startzone);
					stars[i].y = randomRange(-startzone, startzone);
					stars[i].z = randomRange(1, MAX_DEPTH);
				}

				var k = 128.0 / stars[i].z;	
				var px = stars[i].x * k + halfWidth + offsetX;
				var py = stars[i].y * k + halfHeight + offsetY;

				if(px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height){
					var size = (1 -stars[i].z / MAX_DEPTH) * 3; //
					var shade = parseInt((1 - stars[i].z / MAX_DEPTH) * 255);
					ctx.fillStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
					//ctx.fillStyle = 'rgba(' + stars[i].color + 1.0 + ')';
					ctx.fillRect(px, py, size, size);
				}
			}

			requestAnimationFrame(loop);
		}

		function setMousePos(){
			offsetX = (cursorX + halfWidth) * moveModifier;
			offsetY = (cursorY + halfHeight) * moveModifier;

			//startzone = cursorX * 0.1;
			//cursorY * 0.1;


		}