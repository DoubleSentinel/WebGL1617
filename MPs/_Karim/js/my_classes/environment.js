/**
 * Created by Karim Luy on 04/01/2017.
 */


var watervertexBuffer = null;
var waterindexBuffer = null;
var watercolorBuffer = null;

var waterindices = [];
var watervertices = [];
var watercolors = [];

//Initialisation of the static texture ressources for the skybox
function initSkyboxesReferences()
{
    var skyboxes = [];

    skyboxes[0] = [];
    skyboxes[0].push("./assets/skybox/TropicalSunnyDayRight2048.png");
    skyboxes[0].push("./assets/skybox/TropicalSunnyDayLeft2048.png");
    skyboxes[0].push("./assets/skybox/TropicalSunnyDayFront2048.png");
    skyboxes[0].push("./assets/skybox/TropicalSunnyDayBack2048.png");
    skyboxes[0].push("./assets/skybox/TropicalSunnyDayUp2048.png");
    skyboxes[0].push("./assets/skybox/TropicalSunnyDayDown2048.png");

    return skyboxes;
}

function initSkybox(){
    glContext.useProgram(progSkybox);
    //We init the static skybox array
    skyboxes = initSkyboxesReferences();
    skybox = new Skybox("Skybox 0", skyboxes);
}

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
    glContext.useProgram(progIcebergs);
    watervertexBuffer = getVertexBufferWithVertices(watervertices);
    watercolorBuffer = getVertexBufferWithVertices(watercolors);
    waterindexBuffer = getIndexBufferWithIndices(waterindices);
}

function draw_water(){
    glContext.useProgram(progIcebergs);
    glContext.uniform1i(ptr.colorselector, 2);
    glContext.uniform1i(ptr.selector, 2);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, watervertexBuffer);
    glContext.vertexAttribPointer(ptr.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, watercolorBuffer);
    glContext.vertexAttribPointer(ptr.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, waterindexBuffer);
    glContext.drawElements(glContext.TRIANGLES, waterindices.length, glContext.UNSIGNED_SHORT, 0);
}