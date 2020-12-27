/*
pl32.js Framework v0.40, 2020 PocketNES Software. Under GNU Lesser GPL v2.1
Object header
*/

// plObject class: contains functions and methods for objects and prefab-ed configurations of texturized objects
var plObject = {
	checkOverlap : function(obj1, obj2, obj1Dims, obj2Dims){
		var obj1x = obj1.coords[0], obj2x = obj2.coords[0], obj1y = obj1.coords[1], obj2y = obj2.coords[1];

		if((obj1x + obj1Dims[0] >= obj2x) && (obj1x <= obj2x + obj2Dims[0]) && (obj1y <= obj2y + obj2Dims[1]) && (obj1y + obj1Dims[1] >= obj2y)){
			return true;
		}
		return false;
	},

	collide : function(obj1, obj2, obj1Dims, obj2Dims){
		if(plObject.checkOverlap(obj1, obj2, obj1Dims, obj2Dims)){
			obj1.speed[0] = 0;
			obj1.speed[1] = 0;
			return true;
		}
		return false;
	},

	bounce : function(obj1, obj2, obj1Dims, obj2Dims, type){
		if(plObject.checkOverlap(obj1, obj2, obj1Dims, obj2Dims)){
			switch(type){
				case 1:
					obj1.speed[0] = -obj1.speed[0];
					break;
				case 2:
					obj1.speed[1] = -obj1.speed[1];
					break;
				default:
					obj1.speed[0] = -obj1.speed[0];
					obj1.speed[1] = -obj1.speed[1];
			}
			return true;
		}
		return false;
	},

	objectSystem : class {
		constructor(x = (plSystem.systemMain.canvasObj.canvas.width/2), y = (plSystem.systemMain.canvasObj.canvas.height/2)){this.coords = [ x, y ];
			this.speed = [ 0, 0 ];
		}

		move(x, y){
			this.coords[0] = x;
			this.coords[1] = y;
		}

		moveRel(){
			this.coords[0] += this.speed[0];
			this.coords[1] += this.speed[1];
		}
	},

	charSystem : class {
		constructor(x, y, animSysParams = [ "", "frame", ".png", 60, 64, 48 ]){
			this.objectObj = new plObject.objectSystem(x, y);
			this.animationObj = new plGraphics.animationSystem(animSysParams[0], animSysParams[1], animSysParams[2], animSysParams[3], animSysParams[4], animSysParams[5]);
		}

		rotate(degrees){
			this.animationObj.textureObj.rotate(this.object.coords[0], this.object.coords[1], degrees);
		}

		draw(){
			this.animationObj.draw(this.object.coords[0], this.object.coords[1]);
		}
	},

	itemSystem : class {
		constructor(textureParams = [ "sprite.png", 32, 32 ]){
			this.objectObj = new plObject.objectSystem();
			this.textureObj = new plGraphics.textureSystem(textureParams[0], textureParams[1], textureParams[2]);
		}

		draw(){
			this.textureObj.draw(this.objectObj.coords[0], this.objectObj.coords[1]);
		}
	}
};
