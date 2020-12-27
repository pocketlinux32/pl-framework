/*
pl32.js Framework v0.40, (c) 2020 PocketNES Software, Under GNU Lesser GPLv2.1
Main System Header
*/

"use strict";

// plSystem namespace: Contains classes and objects related to basic system functionality
var plSystem = {
	keyboard : [ "", 0, -1 ], // Keyboard input
	milliseconds : 0, // Milliseconds since the program got started
	seconds : 0, // Seconds since the program got started
	systemRuntimeID : undefined, // ID identifying the system chronometer
	/*
	System Flags: Holds flags used by many different methods and functions spanning the entire
	namespace. Here is the key:

	systemFlags[0]: isTermAvailable
	systemFlags[1]: blockMainClear
	systemFlags[2]: blockTermPrint
	systemFlags[3]: is3D
	*/
	systemFlags : [ false, false, false, false ],

	// plSystem.canvasSystem class: Handles canvas related functions
	canvasSystem : class {
		constructor(element){
			this.canvas = element; // Canvas
			this.canvasContext = element.getContext("2d"); // Canvas context
		}

		// plSystem.canvasSystem.clearCanvas(): Clears the canvas
		clearCanvas(camCoords){
			this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		// plSystem.canvasSystem.setTextStyle(): Sets the text's color, font and size
		setTextStyle(color = "#000000", font = "Arial", size = "12px"){
			this.canvasContext.fillStyle = String(color);
			this.canvasContext.font = String(size + " " + font);
		}
	},

	// plSystem.cameraSystem class: Initializes and controls the camera
	cameraSystem : class {
		constructor(ctxRef){
			this.cameraCoords = [ 0, 0, 0 ]; // Camera coords
			this.canvasContextRef = ctxRef; // Canvas context reference
		}

		// plSystem.cameraSystem.move(): Moves the camera to coordinates (x, y, z)
		move(x = 0, y = 0, z = 0){
			this.cameraCoords[0] = x;
			this.cameraCoords[1] = y;
			this.cameraCoords[2] = z;
		}

		// plSystem.cameraSystem.moveRel(): Moves the camera by (x, y, z) relative to current position
		moveRel(x = 0, y = 0, z = 0){
			this.cameraCoords[0] += x;
			this.cameraCoords[1] += y;
			this.cameraCoords[2] += (z/10);
		}

		// plSystem.cameraSystem.getCameraCoords(): Returns the system's camera's coordinates
		getCameraCoords(){
			return this.cameraCoords;
		}

		// plSystem.cameraSystem.confirmMove(): Commits position changes to canvas viewport
		confirmMove(){
			this.canvasContextRef.setTransform(1, 0, 0, 1, this.cameraCoords[0], this.cameraCoords[1]);
		}
	},

	// pkSytem.systemMain namespace: Initializes and manages the render screen
	systemMain : {
		canvasObj : undefined, // canvasSystem instance
		screenCamera : undefined, // cameraSystem instance

		// plSystem.systemMain.init(): Initialize systemMain namespace
		init : function(canvas){
			this.canvasObj = new plSystem.canvasSystem(canvas);
			this.screenCamera = new plSystem.cameraSystem(this.canvasObj.canvasContext);
		},

		// plSystem.systemMain.print(): Prints to the main canvas
		print : function(message, x, y, font, size){
			this.canvasObj.setTextStyle("#000000", font, size);
			this.canvasObj.canvasContext.fillText(message, x, y);
		},

		// plSystem.systemMain.clearScreen(): Wrapper for canvasSystem.clearCanvas() method 
		clearScreen : function(){
			if(!plSystem.systemFlags[2]){
				this.canvasObj.clearCanvas(this.screenCamera.getCameraCoords());
			}
		}
	},

	// pkSytem.systemTerm namespace: Initializes and manages the temrinal buffer
	systemTerm : {
		canvasObj : undefined, // canvasSystem instance
		termCoords : [5, 0], // Cursor coords

		// plSystem.systemTerm.init(): Initializes the systemTerm namespace
		init : function(canvas){
			this.canvasObj = new plSystem.canvasSystem(canvas); 
			this.canvasObj.setTextStyle("#FFFFFF", "Courier New", "10px");
		},

		// plSystem.systemTerm.print(): Prints to the pl32.js terminal buffer/canvas. Falls back to console.log if not initialized/disabled
		print : function(functionName, message){
			if(plSystem.systemFlags[1]){
				return;
			}
			if(this.termCoords[1] < this.canvasObj.canvas.height - 10){
				this.termCoords[1] += 10;
			}else{
				this.termCoords[1] = 10;
				this.canvasObj.clearCanvas();
			}
			if(!plSystem.systemFlags[0] || this.canvasObj === undefined){
      				console.log(functionName + ": " + message);
			}else{
				this.canvasObj.canvasContext.fillText(functionName + ": " + message, this.termCoords[0], this.termCoords[1]);
			}
		}
	},

	// plSystem.init(): Initializes plSystem and its subsystems
	init : function(mCanvas, tCanvas = undefined){
		this.systemMain.init(mCanvas); // The rendering screen

		// If terminal canvas not given, disable pl32.js terminal buffer. Otherwise, create terminal buffer
		if(tCanvas === undefined){
			this.systemFlags[0] = false;
			console.log("plSystem: Initialized basic system");
		}else{
			this.systemFlags[0] = true;
			this.systemTerm.init(tCanvas); // The terminal buffer
		}

		this.systemTerm.print("plSystem", "Initialized basic system");
		this.systemRuntimeID = setInterval(function(){plSystem.seconds++}, 1000);
		this.systemTerm.print("plSystem", "Started system clock");
	},

	// plSystem.keyboardHandler(): Function that handles keyboard input
	keyboardHandler : function(event){
		plSystem.keyboard = [ event.key, event.keyCode, 0 ];
		event.preventDefault();
	},
};

window.addEventListener('keydown', plSystem.keyboardHandler, true); // Keyboard listener
