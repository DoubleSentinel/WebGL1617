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





//Change division slider handler, allows for more vertical slices
function changeSubdivision(elem){
	for(var i = 0;i<sceneObjects.length;i++)
	{
		sceneObjects[i].subdivision = elem.value;
	}
}


//Projection type handling, the projection variable defines whether the projection should use perspective or be orthogonal
var projection = 0;
function changeProjection(){
	if(projection)
	{
		//setting the projection in perspective
		mat4.perspective(pMatrix, degToRad(45.0), c_width / c_height, 0.1, 1000.0);
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
	//Linking of the attribute "textureCoord"
    prg.textureCoordsAttribute  = glContext.getAttribLocation(prg, "aTextureCoord");
    glContext.enableVertexAttribArray(prg.textureCoordsAttribute);
	//Linking a pointer for the color texture
    prg.colorTextureUniform     = glContext.getUniformLocation(prg, "uColorTexture");
	//Linking a pointer for the normal texture
    prg.normalTextureUniform    = glContext.getUniformLocation(prg, "uNormalTexture");
	//Linking a pointer for the specular texture
    prg.specularTextureUniform  = glContext.getUniformLocation(prg, "uSpecularTexture");
	//Linking a pointer for the night texture
    prg.earthNight              = glContext.getUniformLocation(prg, "uEarthNight");
	//Linking of the uniform [mat4] for the projection matrix
    prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	//Linking of the uniform [mat4] for the movement matrix
    prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
	//Linking of the uniform [mat4] for the normal matrix
    prg.nMatrixUniform          = glContext.getUniformLocation(prg, 'uNMatrix');
	//Used to define the radius of the planet on the render
    prg.radius                  = glContext.getUniformLocation(prg, 'radius');
	//Used to rotate the model on itself
    prg.rotation                = glContext.getUniformLocation(prg, 'rotation');
	//Used to inclinate the earth (slightly move the y axis of the model)
    prg.inclination             = glContext.getUniformLocation(prg, 'inclination');
	//Boolean to enable the light rendering
    prg.night                  = glContext.getUniformLocation(prg, 'uBoolNight');
	//Boolean to enable the normal rendering
	prg.normal                  = glContext.getUniformLocation(prg, 'uBoolNormal');
	
}



//Initialisation of the scene
function initScene()
{
	//Loading of textures
	var earthTextureTab = [];
	var moonTextureTab = [];
	
	///Please open the WebglTools.js to see what initTextureWithImage does ! It is a basic procedure to load texture on the GPU
	initTextureWithImage("ressources/texMap4k_Earth_main.jpg", earthTextureTab); //Loads the colorTexture [0]
	initTextureWithImage("ressources/earth_spec.jpg", earthTextureTab);//Loads the specular texture [1]
    initTextureWithImage("ressources/texMap4k_Earth_normal.jpg", earthTextureTab); //Loads the normal texture [2]
    initTextureWithImage("ressources/texMap4k_Earth_night.jpg", earthTextureTab);// Loads the night texture[3]
	
	initTextureWithImage("ressources/moonmap4k.jpg", moonTextureTab); //Loads the colorTexture [0]
    initTextureWithImage("ressources/moonbump4k.jpg", moonTextureTab); //Loads the specular Texture[1]
	
	
	
	//Creation of the earth instance
    var earth = new Planet("Earth", 0.4, 0.0,0.0, -5.0, earthTextureTab[0], earthTextureTab[1], earthTextureTab[2], earthTextureTab[3]);
	
	//Creation of the moon instance
	var moon = new Planet("Moon", 0.1, 0.0,0.0, 0.0, moonTextureTab[0], moonTextureTab[1]);
	sceneObjects.push(earth);
	sceneObjects.push(moon);
	
	//Creation of the earth-moon orbit with earth as the anchor 
	var moonEarthOrbit = new Orbit(earth, moon, 1.5, 0.995);
	
	orbits.push(moonEarthOrbit);
	
	//Enabling the depth test
	glContext.enable(glContext.DEPTH_TEST);
	
	//Sets the color black for the clear of the scene
	glContext.clearColor(0.0, 0.0,0.0, 1.0);
	
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

