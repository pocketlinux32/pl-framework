/*
pl32.js Framework v0.40, (g) 2020 PocketNES Software. Under GNU Lesser GPL v2.1
Graphics header
*/

// plGraphics namespace: Contains classes related to graphics management
var plGraphics = {
	// plGraphics.textureSystem class: Handles texture functions
	textureSystem : class {
		constructor(textureUrl, xDim, yDim){
			this.dimensions = [ xDim, yDim ];
			this.img = new Image(xDim, yDim);
			this.img.src = textureUrl;
		}

		// plGraphics.textureSystem.setTexture(): Sets/Changes image URL
		setTexture(textureUrl){
			this.img.src = textureUrl;
		}

		// plGraphics.textureSystem.rotate(): Prepares the canvas to draw an image rotated at that angle
		rotate(x, y, degrees){
			plSystem.systemMain.canvasObj.canvasContext.translate(x + this.dimensions[0], y + this.dimensions[1]);
			plSystem.systemMain.canvasObj.canvasContext.rotate(degrees * (Math.Pi/180));
			plSystem.systemMain.canvasObj.canvasContext.translate(-x - this.dimensions[0], -y - this.dimensions[1]);
		}

		// plGraphics.textureSystem.unrotate(): Returns the canvas to its normal state
		unrotate(x, y, degrees){
			var camCoords = plSystem.systemMain.screenCamera.getCameraCoords();
			plSystem.systemMain.canvasObj.canvasContext.rotate(-degrees * (Math.Pi/180));
			plSystem.systemMain.canvasObj.canvasContext.setTransform(1, 0, 0, 1, camCoords[0], camCoords[1]);
		}
		// plGraphics.textureSystem.draw(): Draws the image onto the canvas
		draw(x, y){
			plSystem.systemMain.canvasObj.canvasContext.drawImage(this.img, x, y);
		}
	},

	// plGraphics.animationSystem class: Wrapper around plGraphics.textureSystem for animations
	animationSystem : class {
		constructor(containerUrl, bName, type, numFrames, xDim, yDim){
			this.contUrl = containerUrl;
			this.baseName = bName;
			this.format = type;
			this.numOfFrames = numFrames;
			this.iterator = 0;
			this.textureObj = [];
			for(let i = 0; i < this.numOfFrames; i++){
				this.textureObj.push(new plGraphics.textureSystem(this.contUrl + "/" + this.baseName + i + this.format, xDim, yDim));
			}
		}

		// plGraphics.animationSystem.changeBaseName(): Changes the frame's base name
		changeBaseName(bName){
			this.baseName = bName;
		}

		// plGraphics.animationSystem.draw(): Draws the current frame at the specified coordinates
		draw(x, y){
			if(this.iterator >= this.numOfFrames - 1){
				this.iterator = 0;
			}else{
				this.iterator++;
			}
			this.textureObj[this.iterator].draw(x, y);
		}
	},
};
