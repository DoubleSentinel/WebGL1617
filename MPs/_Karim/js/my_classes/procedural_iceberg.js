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
var wireframe = true;

var el = document.getElementById("clickMe");
if (el)
    el.addEventListener("click", initBuffers, false);
else if (el)
    el.attachEvent('onclick', initBuffers);

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
    createBlockyIceberg(0, 0, 0, Math.random() * 10 + 10, 20);
    vertexBufferOuterBoundingBox = getVertexBufferWithVertices(verticesOuterBoundingBox);
    colorBufferOuterBoundingBox = getVertexBufferWithVertices(colorsOuterBoundingBox);
    indexBufferBoundingBox = getIndexBufferWithIndices(indicesBoundingBox);

    vertexBufferInnerBoundingBox = getVertexBufferWithVertices(verticesInnerBoundingBox);
    colorBufferInnerBoundingBox = getVertexBufferWithVertices(colorsInnerBoundingBox);

    vertexBuffer = getVertexBufferWithVertices(verticesIceberg);
    colorBuffer = getVertexBufferWithVertices(colorsIceberg);
    indexBuffer = getIndexBufferWithIndices(indicesIceberg);
}

function createBlockyIceberg(x, y, z, height = Math.floor(Math.random() * 20) + 5, numberOfPoints) {
    createBlockyBoundingBox(x, y, z, height);
    createBoundPointCloud(numberOfPoints);
    createIcebergHull();
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

function add3D(v, u) {
    return [v[0] + u[0], v[1] + u[1], v[2] + u[2]];
}
function sub3D(v, u) {
    return [v[0] - u[0], v[1] - u[1], v[2] - u[2]];
}
function scalar3D(a, v) {
    return [a * v[0], a * v[1], a * v[2]];
}

function trianglePointPick(v1, v2, v3, a, b) {
    //finding point in a  triangle with verticesIceberg v1,v2,v3:
    // _   _      _    _       _    _
    // x = v1 + a(v2 - v1) + b(v3 - v1)
    return add3D(v1, add3D(scalar3D(a, sub3D(v2, v1)), scalar3D(b, sub3D(v3, v1))));
}

function generateBoundRandomPoint(innerTriangle, outerTriangle) {
    var a = (0.7-0.4)*Math.random()+0.4;
    var b = (1-a)*Math.random();
    var innerPoint = trianglePointPick(innerTriangle[0], innerTriangle[1], innerTriangle[2], a, b);
    var outerPoint = trianglePointPick(outerTriangle[0], outerTriangle[1], outerTriangle[2], a, b);
    return add3D(outerPoint, scalar3D(Math.random(), sub3D(innerPoint, outerPoint)));
}

function createIcebergHull(){
    var outerHullPoints = generateHullPoints(verticesIceberg);
    var iceBergHull = generateHull(outerHullPoints);
    for (i = 0; i < iceBergHull.length; i++) {
        indicesIceberg.push(iceBergHull[i][0], iceBergHull[i][1], iceBergHull[i][2]);
    }
}

function createBoundPointCloud(numberOfPoints) {
    verticesIceberg = [];
    indicesIceberg = [];
    colorsIceberg = [];
    var temp;
    //for each triangle of the bounding box
    for (i = 0; i < indicesBoundingBox.length; i+=3) {
        for(j=0;j<numberOfPoints;j++) {
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
            colorsIceberg.push(Math.random(), Math.random(), Math.random(), 0.5);
        }
    }

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
    indicesBoundingBox = [];
    colorsOuterBoundingBox = [];

    verticesInnerBoundingBox = [];
    colorsInnerBoundingBox = [];

    //setting procedural heights
    var d1 = height;
    var D = d1 * 10;
    var H = D * 0.9;
    var h1 = H * ((0.9 - 0.5) * Math.random() + 0.5);

    //now setting procedural rules for quad binding boxes dimensions
    var dimensionTopPlane = (height * ((0.95-0.75)* Math.random()+0.75)) / 2;
    var dimensionWaterPlane = dimensionTopPlane * ((4.9 - 1.1) * Math.random() + 1.1);
    var dimensionIntermediatePlane = dimensionWaterPlane * ((1.8 - 0.9) * Math.random() + 0.9);
    var dimensionBottomPlane = dimensionIntermediatePlane * ((0.9 - 0.6) * Math.random() + 0.6);

    //setting procedural jaggedness {40 - 60}%
    var boundingBoxThickness = ((0.60 - 0.4) * Math.random() + 0.4);

    //now generating points for each plane
    //outer top plane
    verticesOuterBoundingBox.push(x + dimensionTopPlane, y + dimensionTopPlane, z + d1);
    verticesOuterBoundingBox.push(x - dimensionTopPlane, y - dimensionTopPlane, z + d1);
    verticesOuterBoundingBox.push(x - dimensionTopPlane, y + dimensionTopPlane, z + d1);
    verticesOuterBoundingBox.push(x + dimensionTopPlane, y - dimensionTopPlane, z + d1);//3
    //inner top plane
    verticesInnerBoundingBox.push((x + dimensionTopPlane) * boundingBoxThickness, (y + dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionTopPlane) * boundingBoxThickness, (y - dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionTopPlane) * boundingBoxThickness, (y + dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x + dimensionTopPlane) * boundingBoxThickness, (y - dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);//3

    //top outer plane colorsIceberg
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //top inner plane colorsIceberg
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
    verticesInnerBoundingBox.push((x + dimensionWaterPlane) * boundingBoxThickness, (y + dimensionWaterPlane) * boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x - dimensionWaterPlane) * boundingBoxThickness, (y - dimensionWaterPlane) * boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x - dimensionWaterPlane) * boundingBoxThickness, (y + dimensionWaterPlane) * boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x + dimensionWaterPlane) * boundingBoxThickness, (y - dimensionWaterPlane) * boundingBoxThickness, z);//3

    //outer water plane colorsIceberg
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //inner water plane colorsIceberg
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
    verticesInnerBoundingBox.push((x + dimensionIntermediatePlane) * boundingBoxThickness, (y + dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionIntermediatePlane) * boundingBoxThickness, (y - dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionIntermediatePlane) * boundingBoxThickness, (y + dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x + dimensionIntermediatePlane) * boundingBoxThickness, (y - dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);//11

    //outer intermediate plane colorsIceberg
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //inner intermediate plane colorsIceberg
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
    verticesInnerBoundingBox.push((x + dimensionBottomPlane) * boundingBoxThickness, (y + dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
    verticesInnerBoundingBox.push((x - dimensionBottomPlane) * boundingBoxThickness, (y - dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
    verticesInnerBoundingBox.push((x - dimensionBottomPlane) * boundingBoxThickness, (y + dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
    verticesInnerBoundingBox.push((x + dimensionBottomPlane) * boundingBoxThickness, (y - dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));//11

    //outer bottom plane colorsIceberg
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
    //inner bottom plane colorsIceberg
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
    colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

    // var outerHullPoints = generateHullPoints(verticesOuterBoundingBox);
    // var outerhull = generateHull(outerHullPoints);
    // for (i = 0; i < outerhull.length; i++) {
    //     colorsIceberg.push(Math.random(), Math.random(), Math.random(), 0.5);
    //     indicesBoundingBox.push(outerhull[i][0], outerhull[i][1], outerhull[i][2]);
    // }
    //pushing all triangles of the different faces
    indicesBoundingBox.push(
        0,4,6, //1
        0,2,6,
        0,2,1, //3
        5,6,1,
        2,6,1, //5
        3,0,1,
        3,5,1, //7
        3,7,5,
        3,7,4, //9
        3,0,4,
        8,7,4, //11
        8,11,7,
        8,10,4, //13
        10,6,4,
        10,9,6, //15
        9,5,6,
        9,11,7, //17
        9,5,7,
        9,11,13, //19
        15,11,13,
        14,9,13, //21
        14,10,9,
        14,13,12, //23
        14,10,12,
        8,12,15, //25
        8,11,15,
        8,12,10,
        12,13,15, //27
        12,14,13
    )
}

function drawScene() {
    glContext.clearColor(0.1, 0.1, 0.1, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
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