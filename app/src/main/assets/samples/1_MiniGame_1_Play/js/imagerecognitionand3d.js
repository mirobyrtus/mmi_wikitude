var World = {
	loaded: false,
	rotating: false,
	trackableVisible: false,
    isGameOver: false,
    points: new Date().getTime(),

	init: function initFn() {
		this.createOverlays();
	},

	createOverlays: function createOverlaysFn() {

	    /*
			First an AR.Tracker needs to be created in order to start the recognition engine. It is initialized with a URL specific to the target collection. Optional parameters are passed as object in the last argument. In this case a callback function for the onLoaded trigger is set. Once the tracker is fully loaded the function loadingStep() is called.

			Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
			Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.
		*/
		this.tracker = new AR.Tracker("assets/fearofduck.wtc", { // "assets/tracker.wtc", {
			onLoaded: this.loadingStep
		});

		/*
			3D content within Wikitude can only be loaded from Wikitude 3D Format files (.wt3). This is a compressed binary format for describing 3D content which is optimized for fast loading and handling of 3D content on a mobile device. You still can use 3D models from your favorite 3D modeling tools (Autodesk® Maya® or Blender) but you'll need to convert them into the wt3 file format. The Wikitude 3D Encoder desktop application (Windows and Mac) encodes your 3D source file. You can download it from our website. The Encoder can handle Autodesk® FBX® files (.fbx) and the open standard Collada (.dae) file formats for encoding to .wt3. 

			Create an AR.Model and pass the URL to the actual .wt3 file of the model. Additional options allow for scaling, rotating and positioning the model in the scene.

			A function is attached to the onLoaded trigger to receive a notification once the 3D model is fully loaded. Depending on the size of the model and where it is stored (locally or remotely) it might take some time to completely load and it is recommended to inform the user about the loading time.
		*/
		this.modelCar = new AR.Model("assets/goose.wt3", { // "assets/car.wt3", {
			onLoaded: this.loadingStep,
			scale: {
				x: 0.0,
				y: 0.0,
				z: 0.0
			},
			translate: {
				x: 0.0,
				y: 0.05,
				z: 0.0
			},
			rotate: {
				roll: -25
			}
			/*
            , onClick : function() {
                this.translate.x += 0.1;
            }
            */
		});

        this.imgRotate = new AR.ImageResource("assets/axe.png"); // "assets/rotateButton.png");
        /*
        this.buttonRotate = new AR.ImageDrawable(this.imgRotate, 0.2, {
            offsetX: 0.5,
            offsetY: 0.5
        });
        */

        this.buttonsRotate = [];
        for (i = 0; i < 4; i++) {
            this.buttonsRotate.push(new AR.ImageDrawable(this.imgRotate, 0.2, {
                offsetX: World.getRandomOffset(),
                offsetY: World.getRandomOffset(),
                onClick : function() { // Use Events.Onclick(ARDrawable) instead
                    this.offsetX = World.getRandomOffset();
                    this.offsetY = World.getRandomOffset();
                }
                // TODO: Count clicks and on every X click increment steps to make it harder
            }))
        }

		/*
			As a next step, an appearing animation is created. For more information have a closer look at the function implementation.
		*/
		this.appearingAnimation = this.createAppearingAnimation(this.modelCar, 0.045);

		/*
			To receive a notification once the image target is inside the field of vision the onEnterFieldOfVision trigger of the AR.Trackable2DObject is used. In the example the function appear() is attached. Within the appear function the previously created AR.AnimationGroup is started by calling its start() function which plays the animation once.
		*/
		var trackable = new AR.Trackable2DObject(this.tracker, "*", {
			drawables: {
				cam: this.buttonsRotate.concat([this.modelCar])
			},
			onEnterFieldOfVision: this.appear,
			onExitFieldOfVision: this.disappear
		});
	},

    getRandomOffset: function getRandomOffsetFn() {
        var minDistance = 0.2;
        var randomNum = ((Math.random() * 2) - 1);
        if (randomNum >= 0 && randomNum <= minDistance) {
            randomNum += minDistance;
        }
        if (randomNum < 0 && randomNum >= -1 * minDistance) {
            randomNum -= minDistance;
        }
        return randomNum;
    },

    updateCar: function updateCarFn() {
        if (World.loaded && World.trackableVisible && !World.isGameOver) {

            // World.modelCar.translate.x += 0.001;

            for (i = 0; i < World.buttonsRotate.length; i++) {
                // TODO variable steps
                var stepX = 0.001;
                var stepY = 0.001;

                if (Math.abs(World.buttonsRotate[i].offsetX) <= stepX && Math.abs(World.buttonsRotate[i].offsetY) <= stepY) {
                    World.isGameOver = true;
                    break;
                } else {

                    if (World.buttonsRotate[i].offsetX >= 0) { stepX = stepX * -1; }
                    World.buttonsRotate[i].offsetX += stepX;

                    if (World.buttonsRotate[i].offsetY >= 0) { stepY = stepY * -1; }
                    World.buttonsRotate[i].offsetY += stepY;
                }
            }

            if (World.isGameOver) {

                alert("Game over - " + (new Date().getTime() - World.points) + "points!");
                var confirmed = confirm("Play Again?");
                if (confirmed == true) {
                    World.isGameOver = false;
                    World.points = new Date().getTime();

                    // Reposition Enemies
                    for (i = 0; i < World.buttonsRotate.length; i++) {
                        World.buttonsRotate[i].offsetX = World.getRandomOffset();
                        World.buttonsRotate[i].offsetY = World.getRandomOffset();
                    }

                } else {
                    alert("Good bye!");
                }

            }
        }
    },

	loadingStep: function loadingStepFn() {
		if (!World.loaded && World.tracker.isLoaded() && World.modelCar.isLoaded()) {
			World.loaded = true;
			
			if ( World.trackableVisible && !World.appearingAnimation.isRunning() ) {
				World.appearingAnimation.start();
			}
			
						
			var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
			var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
			document.getElementById('loadingMessage').innerHTML =
				"<div" + cssDivLeft + ">Scan CarAd Tracker Image:</div>" +
				"<div" + cssDivRight + "><img src='assets/car.png'></img></div>";

			// Remove Scan target message after 10 sec.
			setTimeout(function() {
				var e = document.getElementById('loadingMessage');
				e.parentElement.removeChild(e);
			}, 10000);
		}
	},

	createAppearingAnimation: function createAppearingAnimationFn(model, scale) {
		/*
			The animation scales up the 3D model once the target is inside the field of vision. Creating an animation on a single property of an object is done using an AR.PropertyAnimation. Since the car model needs to be scaled up on all three axis, three animations are needed. These animations are grouped together utilizing an AR.AnimationGroup that allows them to play them in parallel.

			Each AR.PropertyAnimation targets one of the three axis and scales the model from 0 to the value passed in the scale variable. An easing curve is used to create a more dynamic effect of the animation.
		*/
		var sx = new AR.PropertyAnimation(model, "scale.x", 0, scale, 1500, {
			type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
		});
		var sy = new AR.PropertyAnimation(model, "scale.y", 0, scale, 1500, {
			type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
		});
		var sz = new AR.PropertyAnimation(model, "scale.z", 0, scale, 1500, {
			type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
		});

		return new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [sx, sy, sz]);
	},

	appear: function appearFn() {
		World.trackableVisible = true;
		if (World.loaded) {
			World.appearingAnimation.start();
		}
	},
	disappear: function disappearFn() {
		World.trackableVisible = false;
	}
};

World.init();

// !!!! Skipped 32 frames!  The application may be doing too much work on its main thread.
// Start the game loop
World._intervalId = setInterval(World.updateCar, 1000 / 50); // Game.fps = 50


// To stop the game, use the following:
// clearInterval(World._intervalId);