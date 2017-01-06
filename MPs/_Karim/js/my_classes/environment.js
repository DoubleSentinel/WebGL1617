/**
 * Created by Karim Luy on 04/01/2017.
 */


var watervertexBuffer = null;
var waterindexBuffer = null;
var watercolorBuffer = null;

var waterindices = [];
var watervertices = [];
var watercolors = [];

function createWater(){
    waterindices = [];
    watervertices = [];
    watercolors = [];

    watervertices.push(1000,1000,0);
    watervertices.push(-1000,1000,0);
    watervertices.push(1000,-1000,0);
    watervertices.push(-1000,-1000,0);

    watercolors.push(0.282352,0.819607,0.8,0.9);
    watercolors.push(0.282352,0.819607,0.8,0.9);
    watercolors.push(0.282352,0.819607,0.8,0.9);
    watercolors.push(0.282352,0.819607,0.8,0.9);

    waterindices.push(0,1,2,1,2,3);
}

function initWaterBuffers(){
    watervertexBuffer = getVertexBufferWithVertices(watervertices);
    watercolorBuffer = getVertexBufferWithVertices(watercolors);
    waterindexBuffer = getIndexBufferWithIndices(waterindices);
}

function draw_water(){
    glContext.uniform1i(prg.selector, 2);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, watervertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, watercolorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, waterindexBuffer);
    glContext.drawElements(glContext.TRIANGLES, waterindices.length, glContext.UNSIGNED_SHORT, 0);
}