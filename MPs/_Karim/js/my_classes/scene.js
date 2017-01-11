/**
 * Created by Karim Luy on 05/01/2017.
 */

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translateZ = -100;
var wireframe = false;
var water = true;
var algorithm = 'convex';
var icebergs = [];

var skyboxes = [];
var skybox;

var progIcebergs = null;
var progSkybox = null;
var ptr = new Object();

window.onload = displayTitle("Procedural IceBergs");
window.onkeydown = function (e) {
    switch (e.keyCode) {
        case 87: // w
            translateZ += 1.0;
            break;
        case 83: // s
            translateZ -= 1.0;
            break;
        default:
    }
};

function ViewWireframe() {
    wireframe = !wireframe;
}

function ViewWater() {
    water = !water;
}

function AlgorithmSelector(name) {
    algorithm = name;
}

function initCamera() {
    mat4.identity(mvMatrix);
    mat4.perspective(pMatrix, 45.0, c_width / c_height, 0.1, 10000.0);
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
    progIcebergs = createProgram(glContext, vertexShaderScene, fragmentShaderScene);


    initShaderParametersNew();

    //We define the planet progam as the current program
    glContext.useProgram(progIcebergs);

}

function initShaderParametersNew() {
    /*******************************************
     * Inits the pointers for the scene rendering
     *******************************************/
    ptr.vertexPositionAttribute = glContext.getAttribLocation(progIcebergs, "aVertexPosition");
    glContext.enableVertexAttribArray(ptr.vertexPositionAttribute);

    ptr.colorAttribute = glContext.getAttribLocation(progIcebergs, "aColor");
    glContext.enableVertexAttribArray(ptr.colorAttribute);

    //Linking of the attribute "textureCoord"
    ptr.textureCoordsAttribute = glContext.getAttribLocation(progIcebergs, "aTextureCoord");
    glContext.enableVertexAttribArray(ptr.textureCoordsAttribute);
    //Linking a pointer for the color texture
    ptr.colorTextureUniform = glContext.getUniformLocation(progIcebergs, "uColorTexture");

    //this variable is an object selector for the vertex shader
    ptr.selector = glContext.getUniformLocation(progIcebergs, "uSelector");

    //this variable is a color selector
    ptr.colorselector = glContext.getUniformLocation(progIcebergs, "uTextureSelector");

    //this variable is for the floating animation
    ptr.translation = glContext.getUniformLocation(progIcebergs,"uTranslation");

    ptr.pMatrixUniform = glContext.getUniformLocation(progIcebergs, "uPMatrix");
    ptr.mvMatrixUniform = glContext.getUniformLocation(progIcebergs, "uMVMatrix");

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
    //Linking the uniform texture location for the skybox
    ptr.cubeTextureUniform = glContext.getUniformLocation(progSkybox, "uSkybox");

}

function fillObjectsArray() {
    icebergs = [];
    icebergs.push(
        new BlockyIceberg(0, 0, 0, Math.random() * 10 + 10, 10)
    );
    createWater();
    initSkybox();
}
function updateIcebergs(){
    icebergs = [];
    icebergs.push(
        new BlockyIceberg(0, 0, 0, Math.random() * 10 + 10, 20),
        new BlockyIceberg(30, 30, 0, Math.random() * 10 + 10, 20)
    );
    for (i = 0; i < icebergs.length; i++) {
        icebergs[i].initTexture();
        icebergs[i].initBuffers();
    }
}
function initBuffers() {
    fillObjectsArray();
    glContext.useProgram(progIcebergs);
    for (i = 0; i < icebergs.length; i++) {
        icebergs[i].initTexture();
        icebergs[i].initBuffers();
    }
    initWaterBuffers();
}

function drawScene() {
    glContext.clearColor(0.1, 0.1, 0.1, 1.0);
    glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.enable(glContext.BLEND);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);


    for (i = 0; i < icebergs.length; i++) {
        icebergs[i].tick();
        icebergs[i].draw()
    }

    if (water) {
        draw_water();
    }
    skybox.draw(mvMatrix);

    glContext.useProgram(progIcebergs);
    rotateModelViewMatrixUsingQuaternion(true);

    var translationMat = mat4.create();
    // mat4.identity(translationMat);
    mat4.translate(translationMat, translationMat, [0.0, 0.0, translateZ]);

    var mvtMatrix = mat4.create();
    mat4.multiply(mvtMatrix, translationMat, mvMatrix);

    glContext.uniformMatrix4fv(ptr.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(ptr.mvMatrixUniform, false, mvtMatrix);
}


function initWebGL() {
    try {
        glContext = getGLContext('webgl-canvas');
        initShaders();
        initCamera();
        initBuffers();
        renderLoop();
    }
    catch (e) {
        console.error(e)
    }

}