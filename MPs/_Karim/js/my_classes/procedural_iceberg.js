/**
 * Created by karim on 03.10.2016.
 */

var vertexBufferOuterBoundingBox = null;
var colorBufferOuterBoundingBox = null;

var vertexBufferInnerBoundingBox = null;
var colorBufferInnerBoundingBox = null;

var indexBufferBoundingBox = null;
var indicesBoundingBox = [];

var verticesOuterBoundingBox = [];
var colorsOuterBoundingBox = [];

var verticesInnerBoundingBox = [];
var colorsInnerBoundingBox = [];

var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;

var indicesIceberg = [];
var verticesIceberg = [];
var colorsIceberg = [];

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translateZ = -10;
var wireframe = false;
var water = true;
var algorithm = 'convex';

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

function AlgorithmSelector(name){
    algorithm = name;
}

function initCamera() {
    mat4.identity(mvMatrix);
    mat4.perspective(pMatrix, 45.0, c_width / c_height, 0.1, 1000.0);
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
    createBlockyIceberg(0, 0, 0, Math.random() * 10 + 10, 50);
    createWater();
    vertexBufferOuterBoundingBox = getVertexBufferWithVertices(verticesOuterBoundingBox);
    colorBufferOuterBoundingBox = getVertexBufferWithVertices(colorsOuterBoundingBox);
    indexBufferBoundingBox = getIndexBufferWithIndices(indicesBoundingBox);

    vertexBufferInnerBoundingBox = getVertexBufferWithVertices(verticesInnerBoundingBox);
    colorBufferInnerBoundingBox = getVertexBufferWithVertices(colorsInnerBoundingBox);

    vertexBuffer = getVertexBufferWithVertices(verticesIceberg);
    colorBuffer = getVertexBufferWithVertices(colorsIceberg);
    indexBuffer = getIndexBufferWithIndices(indicesIceberg);

    initWaterBuffers();
}

function generateHullPoints(vertices) {
    var pointsToCreateHullOf = [];
    for (i = 0; i < vertices.length; i += 3) {
        pointsToCreateHullOf.push([vertices[i], vertices[i + 1], vertices[i + 2]])
    }
    return pointsToCreateHullOf;

}

function generateHull(points) {
    var instance = new QuickHull(points);
    instance.build();
    return instance.collectFaces(true);
}

function generateBoundRandomPoint(innerTriangle, outerTriangle) {
    var a =  Math.random();
    var b = (1 - a) * Math.random();
    var innerPoint = trianglePointPick(innerTriangle[0], innerTriangle[1], innerTriangle[2], a, b);
    var outerPoint = trianglePointPick(outerTriangle[0], outerTriangle[1], outerTriangle[2], a, b);
    return add3D(outerPoint, scalar3D(Math.random(), sub3D(innerPoint, outerPoint)));
}

function createIcebergHull() {
    var hullPoints = generateHullPoints(verticesIceberg);
    var iceBergHull;
    if (algorithm == 'alpha') {
        iceBergHull = alphaShape(Math.random()/10, hullPoints);
        for (i = 0; i < iceBergHull.length; i++) {
            indicesIceberg.push(iceBergHull[i][0], iceBergHull[i][1], iceBergHull[i][2]);
        }
    } else if (algorithm == 'convex') {
        iceBergHull = generateHull(hullPoints);
        for (i = 0; i < iceBergHull.length; i++) {
            indicesIceberg.push(iceBergHull[i][0], iceBergHull[i][1], iceBergHull[i][2]);
        }
    }
}

function createBoundPointCloud(numberOfPoints) {
    verticesIceberg = [];
    indicesIceberg = [];
    colorsIceberg = [];
    var temp;
    //for each triangle of the bounding box
    for (i = 0; i < indicesBoundingBox.length; i += 3) {
        for (j = 0; j < numberOfPoints; j++) {
            temp = (generateBoundRandomPoint([
                    [
                        verticesInnerBoundingBox[indicesBoundingBox[i] * 3],
                        verticesInnerBoundingBox[indicesBoundingBox[i] * 3 + 1],
                        verticesInnerBoundingBox[indicesBoundingBox[i] * 3 + 2]
                    ],
                    [
                        verticesInnerBoundingBox[indicesBoundingBox[i + 1] * 3],
                        verticesInnerBoundingBox[indicesBoundingBox[i + 1] * 3 + 1],
                        verticesInnerBoundingBox[indicesBoundingBox[i + 1] * 3 + 2]
                    ],
                    [
                        verticesInnerBoundingBox[indicesBoundingBox[i + 2] * 3],
                        verticesInnerBoundingBox[indicesBoundingBox[i + 2] * 3 + 1],
                        verticesInnerBoundingBox[indicesBoundingBox[i + 2] * 3 + 2]
                    ],
                ],
                [
                    [
                        verticesOuterBoundingBox[indicesBoundingBox[i] * 3],
                        verticesOuterBoundingBox[indicesBoundingBox[i] * 3 + 1],
                        verticesOuterBoundingBox[indicesBoundingBox[i] * 3 + 2]
                    ],
                    [
                        verticesOuterBoundingBox[indicesBoundingBox[i + 1] * 3],
                        verticesOuterBoundingBox[indicesBoundingBox[i + 1] * 3 + 1],
                        verticesOuterBoundingBox[indicesBoundingBox[i + 1] * 3 + 2]
                    ],
                    [
                        verticesOuterBoundingBox[indicesBoundingBox[i + 2] * 3],
                        verticesOuterBoundingBox[indicesBoundingBox[i + 2] * 3 + 1],
                        verticesOuterBoundingBox[indicesBoundingBox[i + 2] * 3 + 2]
                    ],
                ]));
            verticesIceberg.push(temp[0], temp[1], temp[2]);
            if(Math.floor(Math.random()*10%2))
                colorsIceberg.push(0.8, 0.8, 1.0, 1.0);
            else
                colorsIceberg.push(1.0, 1.0, 1.0, 1.0);
        }
    }

}

function drawScene() {
    glContext.clearColor(0.1, 0.1, 0.1, 1.0);
    glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.enable(glContext.BLEND);
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

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBufferBoundingBox);
        glContext.drawElements(glContext.LINE_STRIP, indicesBoundingBox.length, glContext.UNSIGNED_SHORT, 0);
        //inner wireframe
        glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBufferInnerBoundingBox);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBufferInnerBoundingBox);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBufferBoundingBox);
        glContext.drawElements(glContext.LINE_STRIP, indicesBoundingBox.length, glContext.UNSIGNED_SHORT, 0);
    }

    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.TRIANGLES, indicesIceberg.length, glContext.UNSIGNED_SHORT, 0);

    if(water){
        draw_water();
    }

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