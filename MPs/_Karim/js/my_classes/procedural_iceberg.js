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
    createBlockyBoundingBox(0, 0, 0, Math.random() * 10 + 10);
    createBoundPointCloud(1);
    vertexBufferOuterBoundingBox = getVertexBufferWithVertices(verticesOuterBoundingBox);
    colorBufferOuterBoundingBox = getVertexBufferWithVertices(colorsOuterBoundingBox);
    indexBufferBoundingBox = getIndexBufferWithIndices(indicesBoundingBox);

    vertexBufferInnerBoundingBox = getVertexBufferWithVertices(verticesInnerBoundingBox);
    colorBufferInnerBoundingBox = getVertexBufferWithVertices(colorsInnerBoundingBox);

    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
}

function createBlockyIceberg(x, y, z, height = Math.floor(Math.random() * 20) + 5) {
    createBlockyBoundingBox(x, y, z, height);

}

function generateHullPoints(vertices) {
    var pointsToCreateHullOf = [];
    // console.log(vertices.length);
    for (i = 0; i < vertices.length; i += 3) {
        pointsToCreateHullOf.push([vertices[i], vertices[i + 1], vertices[i + 2]])
    }
    return pointsToCreateHullOf;

}

function generateHull(points) {
    var instance = new QuickHull(points);
    instance.build();
    return instance.collectFaces(false);
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
    //finding point in a  triangle with vertices v1,v2,v3:
    // _   _      _    _       _    _
    // x = v1 + a(v2 - v1) + b(v3 - v1)
    // console.log(v1,v2,v3);
    // var B = scalar3D(b,sub3D(v3,v1));
    // console.log(sub3D(v3,v1));
    // var A = scalar3D(a,sub3D(v2,v1));
    // console.log(A);
    // var C = add3D(B,A);
    // console.log(C);
    // var out = add3D(v1,C);
    // console.log(out);
    // return out;
    return add3D(v1, add3D(scalar3D(a, sub3D(v2, v1)), scalar3D(b, sub3D(v3, v1))));
}

function generateBoundRandomPoint(innerTriangle, outerTriangle) {
    var a = Math.random();
    var b = Math.random();
    var innerPoint = trianglePointPick(innerTriangle[0], innerTriangle[1], innerTriangle[2], a, b);
    var outerPoint = trianglePointPick(outerTriangle[0], outerTriangle[1], outerTriangle[2], a, b);
    return add3D(innerPoint, scalar3D(0, sub3D(outerPoint, innerPoint)));
}

function createBoundPointCloud(numberOfPoints) {
    // var cloud = []
    vertices = [];
    indices = [];
    colors = [];
    var temp;
    for (j = 0; j < indicesBoundingBox.length; j++) {
        var i = j*3;
        //mpodify this to take correct faces and do as many points as number of points
        temp = (generateBoundRandomPoint([
                                                [
                                                    verticesInnerBoundingBox[indicesBoundingBox[i]],
                                                    verticesInnerBoundingBox[indicesBoundingBox[i]+1],
                                                    verticesInnerBoundingBox[indicesBoundingBox[i]+2]
                                                ],
                                                [
                                                    verticesInnerBoundingBox[indicesBoundingBox[i+1]],
                                                    verticesInnerBoundingBox[indicesBoundingBox[i+1]+1],
                                                    verticesInnerBoundingBox[indicesBoundingBox[i+1]+2]
                                                ],
                                                [
                                                    verticesInnerBoundingBox[indicesBoundingBox[i+2]],
                                                    verticesInnerBoundingBox[indicesBoundingBox[i+2]+1],
                                                    verticesInnerBoundingBox[indicesBoundingBox[i+2]+2]
                                                ],
                                            ],
                                            [
                                                [
                                                    verticesOuterBoundingBox[indicesBoundingBox[i]],
                                                    verticesOuterBoundingBox[indicesBoundingBox[i]+1],
                                                    verticesOuterBoundingBox[indicesBoundingBox[i]+2]
                                                ],
                                                [
                                                    verticesOuterBoundingBox[indicesBoundingBox[i+1]],
                                                    verticesOuterBoundingBox[indicesBoundingBox[i+1]+1],
                                                    verticesOuterBoundingBox[indicesBoundingBox[i+1]+2]
                                                ],
                                                [
                                                    verticesOuterBoundingBox[indicesBoundingBox[i+2]],
                                                    verticesOuterBoundingBox[indicesBoundingBox[i+2]+1],
                                                    verticesOuterBoundingBox[indicesBoundingBox[i+2]+2]
                                                ],
                                            ]));
        vertices.push(temp[0],temp[1],temp[2]);
        indices.push(indices.length);
        colors.push(0.0,0.0,1.0,1.0);
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
    var dimensionTopPlane = (height * (0.7 * Math.random() + 2)) / 2;
    var dimensionWaterPlane = dimensionTopPlane * ((2.9 - 1.1) * Math.random() + 1.1);
    var dimensionIntermediatePlane = dimensionWaterPlane * ((1.8 - 0.9) * Math.random() + 0.9);
    var dimensionBottomPlane = dimensionTopPlane * ((0.9 - 0.6) * Math.random() + 0.6);

    //setting procedural jaggedness {20 - 40}%
    var boundingBoxThickness = ((0.80 - 0.6) * Math.random() + 0.6);

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
    verticesInnerBoundingBox.push((x + dimensionWaterPlane) * boundingBoxThickness, (y + dimensionWaterPlane) * boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x - dimensionWaterPlane) * boundingBoxThickness, (y - dimensionWaterPlane) * boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x - dimensionWaterPlane) * boundingBoxThickness, (y + dimensionWaterPlane) * boundingBoxThickness, z);
    verticesInnerBoundingBox.push((x + dimensionWaterPlane) * boundingBoxThickness, (y - dimensionWaterPlane) * boundingBoxThickness, z);//3

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
    verticesInnerBoundingBox.push((x + dimensionIntermediatePlane) * boundingBoxThickness, (y + dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionIntermediatePlane) * boundingBoxThickness, (y - dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x - dimensionIntermediatePlane) * boundingBoxThickness, (y + dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
    verticesInnerBoundingBox.push((x + dimensionIntermediatePlane) * boundingBoxThickness, (y - dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);//11

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
    verticesInnerBoundingBox.push((x + dimensionBottomPlane) * boundingBoxThickness, (y + dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
    verticesInnerBoundingBox.push((x - dimensionBottomPlane) * boundingBoxThickness, (y - dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
    verticesInnerBoundingBox.push((x - dimensionBottomPlane) * boundingBoxThickness, (y + dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
    verticesInnerBoundingBox.push((x + dimensionBottomPlane) * boundingBoxThickness, (y - dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));//11

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

    // var outerHullPoints = generateHullPoints(verticesOuterBoundingBox);
    // var outerhull = generateHull(outerHullPoints);
    // for (i = 0; i < outerhull.length; i++) {
    //     colors.push(Math.random(), Math.random(), Math.random(), 0.5);
    //     indicesBoundingBox.push(outerhull[i][0], outerhull[i][1], outerhull[i][2]);
    // }
    indicesBoundingBox.push(
        0,1,2,
        0,3,1,
        5,6,4,
        4,7,5,
        9,10,8,
        8,11,9,
        13,14,12,
        12,15,13
    )
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
    glContext.drawElements(glContext.POINTS, indices.length, glContext.UNSIGNED_SHORT, 0);
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