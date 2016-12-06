/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the model view (mvMatrix) and for the projection (pMatrix)
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
    
//Creation of a global array to store the objectfs drawn in the scene
var sceneObjects = [];
var skybox;
var skyboxTexID;


//Creation of a global array to store the orbits between planets
var orbits = [];

var progPlanet = null;
var progSkybox = null;
var ptr = new Object();





//Change division slider handler, allows for more vertical slices
function changeSubdivision(elem){
	for(var i = 0;i<sceneObjects.length;i++)
	{
		sceneObjects[i].subdivision = elem.value;
	}
}




function initShaders(){
	
	/*******************************************
	* Inits the shader for the skybox rendering
	*******************************************/
	
	//Selection of the 2 shader texts for the skybox
	var vertexShaderSkybox = getTextContent("shader-vs-skybox"); 
	var fragmentShaderSkybox = getTextContent("shader-fs-skybox");
	//Create the program for the shader 
	progSkybox = createProgram(glContext,vertexShaderSkybox,fragmentShaderSkybox);
	
	
	
	
	/*******************************************
	* Inits the shader for the scene rendering
	*******************************************/
	var vertexShaderScene = getTextContent("shader-vs");
	var fragmentShaderScene = getTextContent("shader-fs");
	progPlanet = createProgram(glContext, vertexShaderScene, fragmentShaderScene);
	
	
	initShaderParameters();
	
	//We define the planet progam as the current program
	glContext.useProgram(progPlanet);
	
}



//Initialisation of the shader parameters, this very important method creates the links between the javascript and the shader.
function initShaderParameters()
{
	
	/*******************************************
	* Inits the pointers for the skybox rendering
	*******************************************/
	
	//Linking the attribute for the cube map coords
	ptr.sbCoordsAttribute = glContext.getAttribLocation(progSkybox, "aCoords");
	glContext.enableVertexAttribArray(ptr.sbCoordsAttribute);
	
	//Linking the uniform model view matrix for the skybox shader
	ptr.sbMVMatrixUniform = glContext.getUniformLocation(progSkybox, "uMVMatrix");
	//Linking the uniform projection matrix for the skybox shader
	ptr.sbPMatrixUniform = glContext.getUniformLocation(progSkybox, "uPMatrix");
	//Linking the uniform texture location for the first skybox
	ptr.cubeTextureUniform1 = glContext.getUniformLocation(progSkybox, "uSkybox1");
	//Linking the uniform texture location for the second skybox
	ptr.cubeTextureUniform2 = glContext.getUniformLocation(progSkybox, "uSkybox2");
	
	
	/*******************************************
	* Inits the pointers for the scene rendering
	*******************************************/
	
	//Linking of the attribute "vertex position"
	ptr.vertexPositionAttribute = glContext.getAttribLocation(progPlanet, "aVertexPosition");
    glContext.enableVertexAttribArray(ptr.vertexPositionAttribute);
	//Linking of the attribute "textureCoord"
    ptr.textureCoordsAttribute  = glContext.getAttribLocation(progPlanet, "aTextureCoord");
    glContext.enableVertexAttribArray(ptr.textureCoordsAttribute);
	//Linking a pointer for the color texture
    ptr.colorTextureUniform     = glContext.getUniformLocation(progPlanet, "uColorTexture");
	//Linking a pointer for the normal texture
    ptr.normalTextureUniform    = glContext.getUniformLocation(progPlanet, "uNormalTexture");
	//Linking a pointer for the specular texture
    ptr.specularTextureUniform  = glContext.getUniformLocation(progPlanet, "uSpecularTexture");
	//Linking a pointer for the night texture
    ptr.earthNight              = glContext.getUniformLocation(progPlanet, "uEarthNight");
	//Linking of the uniform [mat4] for the projection matrix
    ptr.pMatrixUniform          = glContext.getUniformLocation(progPlanet, 'uPMatrix');
	//Linking of the uniform [mat4] for the movement matrix
    ptr.mvMatrixUniform         = glContext.getUniformLocation(progPlanet, 'uMVMatrix');
	//Linking of the uniform [mat4] for the normal matrix
    ptr.nMatrixUniform          = glContext.getUniformLocation(progPlanet, 'uNMatrix');
	//Linking the uniform for the planet radius
    ptr.radius                  = glContext.getUniformLocation(progPlanet, 'radius');
	//Linking the uniform for the planet rotation
    ptr.rotation                = glContext.getUniformLocation(progPlanet, 'rotation');
	//Linking the uniform for the inclination
    ptr.inclination             = glContext.getUniformLocation(progPlanet, 'inclination');
	//Linking the uniform if we use the night texture
    ptr.night                  = glContext.getUniformLocation(progPlanet, 'uBoolNight');
	//Linking the uniform if we use the normal texture
	ptr.normal                  = glContext.getUniformLocation(progPlanet, 'uBoolNormal');
	
	
}

//Initialisation of the static texture ressources for the skybox
function initSkyboxesReferences()
{
	var skyboxes = [];

	skyboxes[0] = [];
	skyboxes[0].push("ressources/skyboxes/skybox2/rightImage.png");
	skyboxes[0].push("ressources/skyboxes/skybox2/leftImage.png");
	skyboxes[0].push("ressources/skyboxes/skybox2/frontImage.png");
	skyboxes[0].push("ressources/skyboxes/skybox2/backImage.png");
	skyboxes[0].push("ressources/skyboxes/skybox2/upImage.png");
	skyboxes[0].push("ressources/skyboxes/skybox2/downImage.png");
	
	skyboxes[1] = [];
	skyboxes[1].push("ressources/skyboxes/skybox5/posx.png");
	skyboxes[1].push("ressources/skyboxes/skybox5/negx.png");
	skyboxes[1].push("ressources/skyboxes/skybox5/posy.png");
	skyboxes[1].push("ressources/skyboxes/skybox5/negy.png");
	skyboxes[1].push("ressources/skyboxes/skybox5/posz.png");
	skyboxes[1].push("ressources/skyboxes/skybox5/negz.png");
	

	return skyboxes;
}



//Initialisation of the scene
function initScene()
{
	//Loading of textures
	var earthTextureTab = [];
	var moonTextureTab = [];
	
	initTextureWithImage("ressources/texMap4k_Earth_main.jpg", earthTextureTab);
	initTextureWithImage("ressources/earth_spec.jpg", earthTextureTab);//[1]
    initTextureWithImage("ressources/texMap4k_Earth_normal.jpg", earthTextureTab);
    initTextureWithImage("ressources/texMap4k_Earth_night.jpg", earthTextureTab);
	
	initTextureWithImage("ressources/moonmap4k.jpg", moonTextureTab); 
    initTextureWithImage("ressources/moonbump4k.jpg", moonTextureTab); 
	
	
	//We init the static skybox array
	var skyboxes = initSkyboxesReferences();
	
	
	
	
	
	//var skybox = new Skybox("Test", skybox11TextureTab);
	skybox = new Skybox("Skybox 0", skyboxes);
	
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
	
	
	mat4.perspective(pMatrix, degToRad(45.0), c_width / c_height, 0.1, 1000.0);
	
	//Sending the new projection matrix to the shaders
	glContext.uniformMatrix4fv(ptr.pMatrixUniform, false, pMatrix);

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
	
	skybox.draw(mvMatrix);
	
	glContext.useProgram(progPlanet);
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
	//Initialisation of the programs
    initShaders();
	//Initialisation of the scene
    initScene();
}

