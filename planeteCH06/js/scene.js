/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the model view (mvMatrix) and for the projection (pMatrix)
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
    
//Creation of a global array to store the objectfs drawn in the scene
var sceneObjects = [];
//Creation of a global array to store the orbits between planets
var orbits = [];


//Change slider handler to allow for more vertical slices
function changeSlices(elem){
	for(var i = 0;i<sceneObjects.length;i++)
	{
		sceneObjects[i].verticalSlices = elem.value;
	}
}

//Change slider handler to allow for more vertical slices
function changePoints(elem){
	for(var i = 0;i<sceneObjects.length;i++)
	{
		sceneObjects[i].division = elem.value;
	}
}



//Change division slider handler, allows for more vertical slices
function changeSubdivision(elem){
	for(var i = 0;i<sceneObjects.length;i++)
	{
		sceneObjects[i].verticalSlices = elem.value;
	}
}


//Projection type handling, the projection variable defines whether the projection should use perspective or be orthogonal
var projection = 0;
function changeProjection(){
	if(projection)
	{
		//setting the projection in perspective
		mat4.perspective(pMatrix, degToRad(40), c_width / c_height, 0.1, 1000.0);
		projection = 0;
	}	
	else
	{
		//setting the projection in orthogonal
		mat4.ortho(pMatrix, -1.2, 1.2, -1.2, 1.2, 1, 10);
		projection = 1;
	}
	
	//Sending the new projection matrix to the shaders
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
}

//Initialisation of the shader parameters, this very important method creates the links between the javascript and the shader.
function initShaderParameters(prg)
{
	//Linking of the attribute "vertex position"
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	//Linking of the attribute "color"
	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	//Linking of the uniform [mat4] for the projection matrix
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	//Linking of the uniform [mat4] for the movement matrix
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
	//Linking of the uniform [mat4] for the movement matrix
	prg.rotMatrixUniform         = glContext.getUniformLocation(prg, 'uRotMatrix');
	//Linking 4 uniform values to send out the points for Catmull Rom
	prg.p0Uniform = glContext.getUniformLocation(prg, 'uP0');
	prg.p1Uniform = glContext.getUniformLocation(prg, 'uP1');
	prg.p2Uniform = glContext.getUniformLocation(prg, 'uP2');
	prg.p3Uniform = glContext.getUniformLocation(prg, 'uP3');
	//Linking the alpha variable for the Catmull Rom algorithm
	prg.alpha = glContext.getUniformLocation(prg, 'uAlpha');
	//Linking a value to swap render modes within the shader
	prg.sphereRender = glContext.getUniformLocation(prg, 'sphereRender');
}



//Initialisation of the scene
function initScene()
{
	//Creation of the earth instance
    var earth = new Planet("Earth", 0.4, {r:0.14,g:0.29,b:0.65}, 0.0,0.0, -5.0);
	//Creation of the moon instance
	var moon = new Planet("Moon", 0.1, {r:1.0,g:0.96,b:0.83}, 0.0,0.0, 0.0);
	sceneObjects.push(earth);
	sceneObjects.push(moon);
	//Creation of the earth-moon orbit with earth as the anchor 
	var moonEarthOrbit = new Orbit(earth, moon, 1.5, 0.995);
	orbits.push(moonEarthOrbit);
	
	
	//Enabling the depth test
	glContext.enable(glContext.DEPTH_TEST);
	
	//Sets the color black for the clear of the scene
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);
	
	//Setting the projection matrix as an identity matrix
	mat4.identity(pMatrix);
	
	//Defining the viewport as the size of the canvas
	glContext.viewport(0.0, 0.0, c_width, c_height);
	
	//Calling the projection change method and setting it as orthogonal by default
	changeProjection();
	
	//Starts the renderloop
	renderLoop();
}

function drawScene()
{
	//Clearing the previous render based on co
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	
	//Making the orbit "tick" to make it move	
	for(var i = 0;i<orbits.length; i++)
	{
		orbits[i].tick();
	}
	
	
	//Reseting the mvMatrix
	mat4.identity(mvMatrix);
		
	//Handling the mouse rotation on the scene
	rotateModelViewMatrixUsingQuaternion();
	
	//Calling draw for each object in our scene
	for(var i= 0;i<sceneObjects.length;i++)
	{		
		//Calling draw on the object with the model view matrix as parameter
		sceneObjects[i].draw(mvMatrix);
	}

	
}

//Initialisation of the webgl context
function initWebGL()
{
    //Initilisation on the canvas "webgl-canvas"
    glContext = getGLContext('webgl-canvas');
	//Initialisation of the programme
    initProgram();
	//Initialisation of the scene
    initScene();
}

