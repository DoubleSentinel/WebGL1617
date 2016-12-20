/**
 * Created by karim on 03.10.2016.
 */

var vertexBufferOuterBoundingBox = null;
var indexBufferOuterBoundingBox = null;
var colorBufferOuterBoundingBox = null;

var vertexBufferInnerBoundingBox = null;
var indexBufferInnerBoundingBox = null;
var colorBufferInnerBoundingBox = null;

var indicesOuterBoundingBox = [];
var verticesOuterBoundingBox = [];
var colorsOuterBoundingBox = [];

var indicesInnerBoundingBox = [];
var verticesInnerBoundingBox = [];
var colorsInnerBoundingBox = [];

var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;

var indices = [];
var vertices = [];
var colors = [];

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translateZ = -10;
var wireframe = true;

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

function initCamera() {
    mat4.identity(mvMatrix);
    mat4.perspective(pMatrix, 45.0, c_width / c_height, 0.1, 10000.0);
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
    createBlockyBoundingBox(0,0,0,Math.random()*10 + 5);

    vertexBufferOuterBoundingBox = getVertexBufferWithVertices(verticesOuterBoundingBox);
    colorBufferOuterBoundingBox = getVertexBufferWithVertices(colorsOuterBoundingBox);
    indexBufferOuterBoundingBox = getIndexBufferWithIndices(indicesOuterBoundingBox);

    vertexBufferInnerBoundingBox = getVertexBufferWithVertices(verticesInnerBoundingBox);
    colorBufferInnerBoundingBox = getVertexBufferWithVertices(colorsInnerBoundingBox);
    indexBufferInnerBoundingBox = getIndexBufferWithIndices(indicesInnerBoundingBox);

    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
}

function createBlockyIceberg(x, y, z, height = Math.floor(Math.random() * 20) + 5) {
    createBlockyBoundingBox(x,y,z,height);

}

function generateHullPoints(vertices){
    var pointsToCreateHullOf = [];
    console.log(vertices.length);
    for(i = 0; i < vertices.length; i+=3){
        pointsToCreateHullOf.push([vertices[i],vertices[i+1],vertices[i+2]])
    }
    return pointsToCreateHullOf;

}

function generateHull(points) {
    var instance = new QuickHull(points);
    instance.build();
    return instance.collectFaces(false);
}

function createBlockyBoundingBox(x, y, z, height) {
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
    //resetting tabs
    verticesOuterBoundingBox = [];
    indicesOuterBoundingBox = [];
    colorsOuterBoundingBox = [];

    verticesInnerBoundingBox = [];
    indicesInnerBoundingBox = [];
    colorsInnerBoundingBox = [];

    //setting procedural heights
    var d1 = height;
    var D = d1 * 10;
    var H = D * 0.9;
    var h1 = H * ((0.9 - 0.5) * Math.random() + 0.5);

    //now setting procedural rules for quad binding boxes dimensions
    var dimensionTopPlane = (height * (0.5 * Math.random() + 1)) / 2;
    var dimensionWaterPlane = dimensionTopPlane * ((2.9 - 1.1) * Math.random() + 1.1);
    var dimensionIntermediatePlane = dimensionWaterPlane * ((1.8 - 0.9) * Math.random() + 0.9);
    var dimensionBottomPlane = dimensionTopPlane * ((0.9 - 0.6) * Math.random() + 0.6);

    //setting procedural jaggedness {10 - 30}%
    var boundingBoxThickness = ((0.90 - 0.7) * Math.random() + 0.7);

    //now generating points for each plane
    //outer top plane
    verticesOuterBoundingBox.push(x + dimensionTopPlane, y + dimensionTopPlane, z + d1);
    verticesOuterBoundingBox.push(x - dimensionTopPlane, y - dimensionTopPlane, z + d1);
    verticesOuterBoundingBox.push(x - dimensionTopPlane, y + dimensionTopPlane, z + d1);
    verticesOuterBoundingBox.push(x + dimensionTopPlane, y - dimensionTopPlane, z + d1);//3
    //inner top plane
    verticesInnerBoundingBox.push((x + dimensionTopPlane)*boundingBoxThickness, (y + dimensionTopPlane)*boundingBoxThickness, (z + d1)*boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionTopPlane)*boundingBoxThickness, (y - dimensionTopPlane)*boundingBoxThickness, (z + d1)*boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionTopPlane)*boundingBoxThickness, (y + dimensionTopPlane)*boundingBoxThickness, (z + d1)*boundingBoxThickness);
    verticesInnerBoundingBox.push((x + dimensionTopPlane)*boundingBoxThickness, (y - dimensionTopPlane)*boundingBoxThickness, (z + d1)*boundingBoxThickness);//3

    //top outer plane colors
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //top inner plane colors
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

    //outer water level
    verticesOuterBoundingBox.push(x + dimensionWaterPlane, y + dimensionWaterPlane, z);
    verticesOuterBoundingBox.push(x - dimensionWaterPlane, y - dimensionWaterPlane, z);
    verticesOuterBoundingBox.push(x - dimensionWaterPlane, y + dimensionWaterPlane, z);
    verticesOuterBoundingBox.push(x + dimensionWaterPlane, y - dimensionWaterPlane, z);//7
    //inner water level
    verticesInnerBoundingBox.push((x + dimensionWaterPlane)*boundingBoxThickness, (y + dimensionWaterPlane)*boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x - dimensionWaterPlane)*boundingBoxThickness, (y - dimensionWaterPlane)*boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x - dimensionWaterPlane)*boundingBoxThickness, (y + dimensionWaterPlane)*boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x + dimensionWaterPlane)*boundingBoxThickness, (y - dimensionWaterPlane)*boundingBoxThickness, z);//3

    //outer water plane colors
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //inner water plane colors
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

    //outer intermediate level
    verticesOuterBoundingBox.push(x + dimensionIntermediatePlane, y + dimensionIntermediatePlane, z - h1);
    verticesOuterBoundingBox.push(x - dimensionIntermediatePlane, y - dimensionIntermediatePlane, z - h1);
    verticesOuterBoundingBox.push(x - dimensionIntermediatePlane, y + dimensionIntermediatePlane, z - h1);
    verticesOuterBoundingBox.push(x + dimensionIntermediatePlane, y - dimensionIntermediatePlane, z - h1);//11
    //inner intermediate level
    verticesInnerBoundingBox.push((x + dimensionIntermediatePlane)*boundingBoxThickness, (y + dimensionIntermediatePlane)*boundingBoxThickness, (z - h1)*boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionIntermediatePlane)*boundingBoxThickness, (y - dimensionIntermediatePlane)*boundingBoxThickness, (z - h1)*boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionIntermediatePlane)*boundingBoxThickness, (y + dimensionIntermediatePlane)*boundingBoxThickness, (z - h1)*boundingBoxThickness);
    verticesInnerBoundingBox.push((x + dimensionIntermediatePlane)*boundingBoxThickness, (y - dimensionIntermediatePlane)*boundingBoxThickness, (z - h1)*boundingBoxThickness);//11

    //outer intermediate plane colors
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //inner intermediate plane colors
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

    //outer bottom level
    verticesOuterBoundingBox.push(x + dimensionBottomPlane, y + dimensionBottomPlane, z - H);
    verticesOuterBoundingBox.push(x - dimensionBottomPlane, y - dimensionBottomPlane, z - H);
    verticesOuterBoundingBox.push(x - dimensionBottomPlane, y + dimensionBottomPlane, z - H);
    verticesOuterBoundingBox.push(x + dimensionBottomPlane, y - dimensionBottomPlane, z - H);//15
    //inner bottom level
    verticesInnerBoundingBox.push((x + dimensionBottomPlane)*boundingBoxThickness, (y + dimensionBottomPlane)*boundingBoxThickness, (z - H*boundingBoxThickness));
    verticesInnerBoundingBox.push((x - dimensionBottomPlane)*boundingBoxThickness, (y - dimensionBottomPlane)*boundingBoxThickness, (z - H*boundingBoxThickness));
    verticesInnerBoundingBox.push((x - dimensionBottomPlane)*boundingBoxThickness, (y + dimensionBottomPlane)*boundingBoxThickness, (z - H*boundingBoxThickness));
    verticesInnerBoundingBox.push((x + dimensionBottomPlane)*boundingBoxThickness, (y - dimensionBottomPlane)*boundingBoxThickness, (z - H*boundingBoxThickness));//11

    //outer bottom plane colors
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //inner bottom plane colors
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

    var outerHullPoints = generateHullPoints(verticesOuterBoundingBox);
    var innerHullPoints = generateHullPoints(verticesInnerBoundingBox);
    var outerhull = generateHull(outerHullPoints);
    var innerhull = generateHull(innerHullPoints);
    for (i = 0; i < outerhull.length; i++) {
        colors.push(Math.random(), Math.random(), Math.random(), 0.5);
        indicesOuterBoundingBox.push(outerhull[i][0], outerhull[i][1], outerhull[i][2]);
        indicesInnerBoundingBox.push(innerhull[i][0], innerhull[i][1], innerhull[i][2]);
    }
    console.log()
}

function drawScene() {
    glContext.clearColor(0.1, 0.1, 0.1, 1.0);
    glContext.disable(glContext.DEPTH_TEST);
    glContext.disable(glContext.BLEND);
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

    if (wireframe) {
        //outer wireframe
        glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBufferOuterBoundingBox);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBufferOuterBoundingBox);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBufferOuterBoundingBox);
        glContext.drawElements(glContext.LINE_STRIP, indicesOuterBoundingBox.length, glContext.UNSIGNED_SHORT, 0);
        //inner wireframe
        glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBufferInnerBoundingBox);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBufferInnerBoundingBox);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBufferInnerBoundingBox);
        glContext.drawElements(glContext.LINE_STRIP, indicesInnerBoundingBox.length, glContext.UNSIGNED_SHORT, 0);
    }

    // glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    // glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
    //
    // glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    // glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
    //
    // glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
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