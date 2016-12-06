/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var pMatrix = mat4.create();
var fullTimeMilliseconds;

//Initialisation of the scene
function Scene_initScene() {
	fullTimeMilliseconds = 0;

	glContext.viewport(0, 0, c_width, c_height);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);

	mat4.perspective(pMatrix, GLTools_degToRad(45), c_width / c_height, 0.1, 10000);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
}

function Scene_drawScene() {
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	var absoluteMatrix = mainCamera.update();

	var toDraw = Controller_getDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		toDraw[i].draw(absoluteMatrix);
	}
}

function Scene_updateScene(deltaTime) {
	fullTimeMilliseconds += deltaTime;
	var fullTimeSeconds = fullTimeMilliseconds / 1000;

	var updater = new QuadInterface();
	var toDraw = Controller_getDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		updater.update(toDraw[i], fullTimeSeconds, deltaTime);
	}
}