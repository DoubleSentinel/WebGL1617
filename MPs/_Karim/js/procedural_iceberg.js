/**
 * Created by karim on 03.10.2016.
 */

var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null; 

var indices = [];
var vertices = [];
var colors = []; 


var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translation = vec3.create();
var translateZ = -10;

window.onload = displayTitle("Single Strip Cube");
window.onkeydown = function(e) {
    switch(e.keyCode){
        case 87: // w
            translateZ += 1.0;
            break;
        case 83: // s
            translateZ -= 1.0;
            break;
        default:
    }
};

function initCamera(){
	mat4.identity(mvMatrix);
	mat4.perspective(pMatrix, 45.0, c_width / c_height, 0.1, 10000.0);
	
	vec3.set (translation, 0, 0, -5.0);
	mat4.translate (mvMatrix, mvMatrix, translation);
}


function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);

    prg.pMatrixUniform = glContext.getUniformLocation(prg, "uPMatrix");
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, "uMVMatrix");

}

function initBuffers() {
    // createCube();
	createBlockyBindingBox(0,0,0,10);
    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors); 
    indexBuffer = getIndexBufferWithIndices(indices);
}

function createBlockyIceberg(x,y,z){

}

function createBlockyBindingBox(x,y,z, height=Math.floor(Math.random()*20)+5){
    /* To setup procedurally generated blocky-type iceberg, we have to set procedural rules
    * the first one is determining how many sections to the binding box we want to have, this can be parametered/randomized
    * in later development. For now, it is being set as 3 sections, divided by 4 limiting points.
    *                _-first plane = (x,y,waterlevel[2]+height)
    *  d1 = D(0.1) -|_
    *                _-second plane = water level = (x,y,z)
    *  h1 ----------|_
    *  H  = D(0.9)    -third plane === {H(0.5),H(0.9)} <- at random
    *  h2 -----------|
    *                 -fourth plane = H - h1*/
    //setting procedural heights
    var d1 = height;
    var D = d1*10;
    var H = D*0.9;
    var h1 = H*((0.9-0.5)*Math.random()+0.5);

    //now setting procedural rules for quad binding boxes dimensions
    var dimensionTopPlane = (height*(0.5*Math.random()+1))/2;
    var dimensionWaterPlane = dimensionTopPlane*((1.9-1.1)*Math.random()+1.1);
    var dimensionIntermediatePlane = dimensionTopPlane*((1.2-0.9)*Math.random()+0.9);
    var dimensionBottomPlane = dimensionTopPlane*((0.9-0.6)*Math.random()+0.6);

    //now generating points for each plane
    //top plane
    vertices.push(x+dimensionTopPlane,y+dimensionTopPlane,z + d1);
    vertices.push(x-dimensionTopPlane,y-dimensionTopPlane,z + d1);
    vertices.push(x-dimensionTopPlane,y+dimensionTopPlane,z + d1);
    vertices.push(x+dimensionTopPlane,y-dimensionTopPlane,z + d1);//3

    //top plane colors
    colors.push(1.0,0.0,0.0,1.0);
    colors.push(1.0,0.0,0.0,1.0);
    colors.push(1.0,0.0,0.0,1.0);
    colors.push(1.0,0.0,0.0,1.0);

    //water level
    vertices.push(x+dimensionWaterPlane,y+dimensionWaterPlane,z);
    vertices.push(x-dimensionWaterPlane,y-dimensionWaterPlane,z);
    vertices.push(x-dimensionWaterPlane,y+dimensionWaterPlane,z);
    vertices.push(x+dimensionWaterPlane,y-dimensionWaterPlane,z);//7

    //water plane colors
    colors.push(0.0,0.0,1.0,1.0);
    colors.push(0.0,0.0,1.0,1.0);
    colors.push(0.0,0.0,1.0,1.0);
    colors.push(0.0,0.0,1.0,1.0);

    //intermediate level
    vertices.push(x+dimensionIntermediatePlane,y+dimensionIntermediatePlane,z - h1);
    vertices.push(x-dimensionIntermediatePlane,y-dimensionIntermediatePlane,z - h1);
    vertices.push(x-dimensionIntermediatePlane,y+dimensionIntermediatePlane,z - h1);
    vertices.push(x+dimensionIntermediatePlane,y-dimensionIntermediatePlane,z - h1);//11

    //intermediate plane colors
    colors.push(0.0,1.0,0.0,1.0);
    colors.push(0.0,1.0,0.0,1.0);
    colors.push(0.0,1.0,0.0,1.0);
    colors.push(0.0,1.0,0.0,1.0);

    //bottom level
    vertices.push(x+dimensionBottomPlane,y+dimensionBottomPlane,z - H);
    vertices.push(x-dimensionBottomPlane,y-dimensionBottomPlane,z - H);
    vertices.push(x-dimensionBottomPlane,y+dimensionBottomPlane,z - H);
    vertices.push(x+dimensionBottomPlane,y-dimensionBottomPlane,z - H);//15

    //bottom plane colors
    colors.push(1.0,1.0,1.0,1.0);
    colors.push(1.0,1.0,1.0,1.0);
    colors.push(1.0,1.0,1.0,1.0);
    colors.push(1.0,1.0,1.0,1.0);

    indices.push(
                0,1,2,
                0,1,3,
                4,5,6,
                4,5,7,
                8,9,10,
                8,9,11,
                12,13,14,
                12,13,15
                )
}

function createCube() {
    var transparency = 0.5;
	
	//bottom square
	vertices.push(1.0,1.0,0.0);
	vertices.push(-1.0,1.0,0.0);
	vertices.push(-1.0,-1.0,0.0);
	vertices.push(1.0,-1.0,0.0);
	
	//top square
	vertices.push(1.0,1.0,2.0);
	vertices.push(-1.0,1.0,2.0);
	vertices.push(-1.0,-1.0,2.0);
	vertices.push(1.0,-1.0,2.0);
	
	//bottom square colors
    colors.push(1.0, 0.0, 0.0, transparency);
    colors.push(0.9, 0.1, 0.0, transparency);
    colors.push(0.0, 0.1, 0.9, transparency);
    colors.push(0.0, 0.2, 0.8, transparency);
	
	//top square colors
	colors.push(0.0, 0.9, 0.1, transparency);
    colors.push(0.0, 0.8, 0.2, transparency);
    colors.push(0.0, 0.1, 0.9, 1.0);
    colors.push(0.0, 0.1, 0.8, 1.0);
	
	//building cube
	indices.push(0,1,2,6,3,7,4,6,5,1,4,0,3,2);
}

function drawScene() {
    glContext.clearColor(0.1, 0.1, 0.1, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);

    rotateModelViewMatrixUsingQuaternion(true);

    var translationMat = mat4.create();
    mat4.identity(translationMat);
    mat4.translate(translationMat, translationMat, [0.0, 0.0, translateZ]);

    var mvtMatrix = mat4.create();
    mat4.multiply(mvtMatrix, translationMat, mvMatrix);

    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvtMatrix);
	
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
	
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
}

function initWebGL() {
    try {
        glContext = getGLContext('webgl-canvas');
        initProgram();
        initCamera();
        initBuffers();
        renderLoop();
    }
    catch (e) {
        console.error(e)
    }

}