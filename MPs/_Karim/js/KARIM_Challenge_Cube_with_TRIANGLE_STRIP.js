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

window.onload = displayTitle("Single Strip Cube");


function initCamera(){
	mat4.identity(mvMatrix);
	mat4.perspective(pMatrix, 45.0, c_width / c_height, 0.1, 100.0);
	
	var rotXQuat = quat.create();
    quat.setAxisAngle(rotXQuat, vec3.fromValues(1, 0, 0), degToRad(-35));

    var rotZQuat = quat.create();
    quat.setAxisAngle(rotZQuat, vec3.fromValues(0, 0, 1), degToRad(-60));
	
	var rotYQuat = quat.create();
    quat.setAxisAngle(rotYQuat, vec3.fromValues(0, 1, 0), degToRad(-60));
	
    var myQuaternion = quat.create();
    quat.multiply(myQuaternion, rotZQuat, rotXQuat, rotYQuat);

    var rotationMatrix = mat4.create();
    mat4.fromQuat(rotationMatrix, myQuaternion);
    mat4.multiply(mvMatrix, rotationMatrix, mvMatrix);
	
	vec3.set (translation, -0.5, 3.0, -5.0);
	mat4.translate (mvMatrix, mvMatrix, translation);
}

function initScene(){
	glContext.clearColor(0.1, 0.1, 0.1, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);

    rotateModelViewMatrixUsingQuaternion(true);

    // mat4.translate(mvMatrix,mvMatrix,vec3(0.5,-3.0,5.0));
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
    createCube();
	
    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors); 
    indexBuffer = getIndexBufferWithIndices(indices);
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
	initScene();
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
	
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
	
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.TRIANGLE_STRIP, indices.length, glContext.UNSIGNED_SHORT, 0);
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