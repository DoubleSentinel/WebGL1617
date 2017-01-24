/**
 * Created by karim on 03.10.2016.
 */

class ProceduralIceberg {
    constructor() {
        this.animationStep = Math.random();
        this.translation = 0;
        this.alpha = 0.05;

        this.vertexBufferOuterBoundingBox = null;
        this.colorBufferOuterBoundingBox = null;

        this.vertexBufferInnerBoundingBox = null;
        this.colorBufferInnerBoundingBox = null;

        this.indexBufferBoundingBox = null;
        this.indicesBoundingBox = [];

        this.verticesOuterBoundingBox = [];
        this.colorsOuterBoundingBox = [];

        this.verticesInnerBoundingBox = [];
        this.colorsInnerBoundingBox = [];

        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
        this.textureCoordsBuffer = null;

        this.texture = [];

        this.indicesIceberg = [];
        this.verticesIceberg = [];
        this.colorsIceberg = [];
        this.textureCoord = [];
    }

    generateHullPoints(vertices) {
        var pointsToCreateHullOf = [];
        for (var i = 0; i < vertices.length; i += 3) {
            pointsToCreateHullOf.push([vertices[i], vertices[i + 1], vertices[i + 2]])
        }
        return pointsToCreateHullOf;

    }

    generateHull(points) {
        var instance = new QuickHull(points);
        instance.build();
        return instance.collectFaces(true);
    }

    generateBoundRandomPoint(innerTriangle, outerTriangle) {
        var a = Math.random();
        var b = (1 - a) * Math.random();
        var innerPoint = trianglePointPick(innerTriangle[0], innerTriangle[1], innerTriangle[2], a, b);
        var outerPoint = trianglePointPick(outerTriangle[0], outerTriangle[1], outerTriangle[2], a, b);
        return add3D(outerPoint, scalar3D(Math.random(), sub3D(innerPoint, outerPoint)));
    }

    createIcebergHull() {
        var hullPoints = this.generateHullPoints(this.verticesIceberg);
        var iceBergHull;
        if (algorithm == 'alpha') {
            iceBergHull = alphaShape(this.alpha, hullPoints);
            for (var i = 0; i < iceBergHull.length; i++) {
                this.indicesIceberg.push(iceBergHull[i][0], iceBergHull[i][1], iceBergHull[i][2]);
            }
        } else if (algorithm == 'convex') {
            console.log(hullPoints);
            iceBergHull = this.generateHull(hullPoints);
            for (i = 0; i < iceBergHull.length; i++) {
                this.indicesIceberg.push(iceBergHull[i][0], iceBergHull[i][1], iceBergHull[i][2]);
            }
        }
    }

    createBoundPointCloud(numberOfPoints) {
        this.verticesIceberg = [];
        this.indicesIceberg = [];
        this.colorsIceberg = [];
        var temp;
        //for each triangle of the bounding box
        for (var i = 0; i < this.indicesBoundingBox.length; i += 3) {
            for (var j = 0; j < numberOfPoints; j++) {
                temp = (this.generateBoundRandomPoint([
                        [
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i] * 3],
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i] * 3 + 1],
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i] * 3 + 2]
                        ],
                        [
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i + 1] * 3],
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i + 1] * 3 + 1],
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i + 1] * 3 + 2]
                        ],
                        [
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i + 2] * 3],
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i + 2] * 3 + 1],
                            this.verticesInnerBoundingBox[this.indicesBoundingBox[i + 2] * 3 + 2]
                        ],
                    ],
                    [
                        [
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i] * 3],
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i] * 3 + 1],
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i] * 3 + 2]
                        ],
                        [
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i + 1] * 3],
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i + 1] * 3 + 1],
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i + 1] * 3 + 2]
                        ],
                        [
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i + 2] * 3],
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i + 2] * 3 + 1],
                            this.verticesOuterBoundingBox[this.indicesBoundingBox[i + 2] * 3 + 2]
                        ],
                    ]));
                this.verticesIceberg.push(temp[0], temp[1], temp[2]);

                this.textureCoord.push(Math.random(),Math.random());
                this.textureCoord.push(Math.random(),Math.random());
                this.textureCoord.push(Math.random(),Math.random());

                if (Math.floor(Math.random() * 10 % 2))
                    this.colorsIceberg.push(0.8, 0.8, 1.0, 1.0);
                else
                    this.colorsIceberg.push(1.0, 1.0, 1.0, 1.0);
            }
        }
    }

    initTexture(){
        initTextureWithImage('./assets/textures/iceberg0.jpg',this.texture);
    }

    initBuffers() {
        this.vertexBufferOuterBoundingBox = getVertexBufferWithVertices(this.verticesOuterBoundingBox);
        this.colorBufferOuterBoundingBox = getVertexBufferWithVertices(this.colorsOuterBoundingBox);
        this.indexBufferBoundingBox = getIndexBufferWithIndices(this.indicesBoundingBox);

        this.vertexBufferInnerBoundingBox = getVertexBufferWithVertices(this.verticesInnerBoundingBox);
        this.colorBufferInnerBoundingBox = getVertexBufferWithVertices(this.colorsInnerBoundingBox);

        this.vertexBuffer = getVertexBufferWithVertices(this.verticesIceberg);
        this.colorBuffer = getVertexBufferWithVertices(this.colorsIceberg);
        this.indexBuffer = getIndexBufferWithIndices(this.indicesIceberg);

        this.textureCoordsBuffer = getVertexBufferWithVertices(this.textureCoord);

    }

    tick(){
        this.animationStep+=0.01;
        this.translation = Math.sin(this.animationStep);
    }

    draw() {
        glContext.useProgram(progIcebergs);
        glContext.uniform1f(ptr.translation,this.translation);
        glContext.uniform1i(ptr.selector,0);
        if (wireframe) {
            glContext.uniform1i(ptr.colorselector, 2);
            //outer wireframe
            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBufferOuterBoundingBox);
            glContext.vertexAttribPointer(ptr.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBufferOuterBoundingBox);
            glContext.vertexAttribPointer(ptr.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBufferBoundingBox);
            glContext.drawElements(glContext.LINE_STRIP, this.indicesBoundingBox.length, glContext.UNSIGNED_SHORT, 0);
            //inner wireframe
            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBufferInnerBoundingBox);
            glContext.vertexAttribPointer(ptr.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBufferInnerBoundingBox);
            glContext.vertexAttribPointer(ptr.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBufferBoundingBox);
            glContext.drawElements(glContext.LINE_STRIP, this.indicesBoundingBox.length, glContext.UNSIGNED_SHORT, 0);
        }
        //------------------------------TEXTURE WORK----------------------------------------
        //We enable the Texture0 slot
        glContext.activeTexture(glContext.TEXTURE0);
        //We store the colorTexture pointer(already on the GPU) in the Texture0 slot
        glContext.bindTexture(glContext.TEXTURE_2D, this.texture[0]);
        //We inform that our colorTexture is placed in the Texture0 slot
        glContext.uniform1i(ptr.colorTextureUniform, 0);

        //We define how to use the texture
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.REPEAT);

        //Transfer of the colors for the iceberg
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textureCoordsBuffer);
        glContext.vertexAttribPointer(ptr.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0 );
        //------------------------------------------------------------------------------------

        glContext.uniform1i(ptr.colorselector, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(ptr.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
        glContext.vertexAttribPointer(ptr.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        glContext.drawElements(glContext.TRIANGLES, this.indicesIceberg.length, glContext.UNSIGNED_SHORT, 0);
    }

    exportOBJ() {
        var iceberg = {'vertices': this.vertices, 'indices': this.indices, 'colors': this.colors}
    }
}