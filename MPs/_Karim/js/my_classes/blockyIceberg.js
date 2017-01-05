/**
 * Created by Karim Luy on 23/12/2016.
 */


class BlockyIceberg extends ProceduralIceberg{
    constructor(x, y, z, height = Math.floor(Math.random() * 20) + 5, numberOfPoints) {
        super();
        this.createBlockyBoundingBox(x, y, z, height);
        this.createBoundPointCloud(numberOfPoints);
        this.createIcebergHull();
    }

    createBlockyBoundingBox(x, y, z, height) {
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
        this.verticesOuterBoundingBox = [];
        this.indicesBoundingBox = [];
        this.colorsOuterBoundingBox = [];

        this.verticesInnerBoundingBox = [];
        this.colorsInnerBoundingBox = [];

        //setting procedural heights
        var d1 = height;
        var D = d1 * 10;
        var H = D * 0.9;
        var h1 = H * ((0.9 - 0.5) * Math.random() + 0.5);

        //now setting procedural rules for quad binding boxes dimensions
        var dimensionTopPlane = (height * ((0.9 - 0.8) * Math.random() + 0.8)) / 2;
        var dimensionWaterPlane = dimensionTopPlane * ((2.5 - 1.1) * Math.random() + 1.1);
        var dimensionIntermediatePlane = dimensionWaterPlane * ((2.5 - 1.1) * Math.random() + 1.1);
        var dimensionBottomPlane = dimensionIntermediatePlane * ((0.9 - 0.6) * Math.random() + 0.6);

        //setting procedural jaggedness {40 - 60}%
        var boundingBoxThickness = ((0.60 - 0.4) * Math.random() + 0.4);

        //now generating points for each plane
        //outer top plane
        this.verticesOuterBoundingBox.push(x + dimensionTopPlane, y + dimensionTopPlane, z + d1);
        this.verticesOuterBoundingBox.push(x - dimensionTopPlane, y - dimensionTopPlane, z + d1);
        this.verticesOuterBoundingBox.push(x - dimensionTopPlane, y + dimensionTopPlane, z + d1);
        this.verticesOuterBoundingBox.push(x + dimensionTopPlane, y - dimensionTopPlane, z + d1);//3
        //inner top plane
        this.verticesInnerBoundingBox.push((x + dimensionTopPlane) * boundingBoxThickness, (y + dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);
        this.verticesInnerBoundingBox.push((x - dimensionTopPlane) * boundingBoxThickness, (y - dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);
        this.verticesInnerBoundingBox.push((x - dimensionTopPlane) * boundingBoxThickness, (y + dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);
        this.verticesInnerBoundingBox.push((x + dimensionTopPlane) * boundingBoxThickness, (y - dimensionTopPlane) * boundingBoxThickness, (z + d1) * boundingBoxThickness);//3

        //top outer plane colorsIceberg
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        //top inner plane colorsIceberg
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

        //outer water level
        this.verticesOuterBoundingBox.push(x + dimensionWaterPlane, y + dimensionWaterPlane, z);
        this.verticesOuterBoundingBox.push(x - dimensionWaterPlane, y - dimensionWaterPlane, z);
        this.verticesOuterBoundingBox.push(x - dimensionWaterPlane, y + dimensionWaterPlane, z);
        this.verticesOuterBoundingBox.push(x + dimensionWaterPlane, y - dimensionWaterPlane, z);//7
        //inner water level
        this.verticesInnerBoundingBox.push((x + dimensionWaterPlane) * boundingBoxThickness, (y + dimensionWaterPlane) * boundingBoxThickness, z);
        this.verticesInnerBoundingBox.push((x - dimensionWaterPlane) * boundingBoxThickness, (y - dimensionWaterPlane) * boundingBoxThickness, z);
        this.verticesInnerBoundingBox.push((x - dimensionWaterPlane) * boundingBoxThickness, (y + dimensionWaterPlane) * boundingBoxThickness, z);
        this.verticesInnerBoundingBox.push((x + dimensionWaterPlane) * boundingBoxThickness, (y - dimensionWaterPlane) * boundingBoxThickness, z);//3

        //outer water plane colorsIceberg
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        //inner water plane colorsIceberg
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

        //outer intermediate level
        this.verticesOuterBoundingBox.push(x + dimensionIntermediatePlane, y + dimensionIntermediatePlane, z - h1);
        this.verticesOuterBoundingBox.push(x - dimensionIntermediatePlane, y - dimensionIntermediatePlane, z - h1);
        this.verticesOuterBoundingBox.push(x - dimensionIntermediatePlane, y + dimensionIntermediatePlane, z - h1);
        this.verticesOuterBoundingBox.push(x + dimensionIntermediatePlane, y - dimensionIntermediatePlane, z - h1);//11
        //inner intermediate level
        this.verticesInnerBoundingBox.push((x + dimensionIntermediatePlane) * boundingBoxThickness, (y + dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
        this.verticesInnerBoundingBox.push((x - dimensionIntermediatePlane) * boundingBoxThickness, (y - dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
        this.verticesInnerBoundingBox.push((x - dimensionIntermediatePlane) * boundingBoxThickness, (y + dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);
        this.verticesInnerBoundingBox.push((x + dimensionIntermediatePlane) * boundingBoxThickness, (y - dimensionIntermediatePlane) * boundingBoxThickness, (z - h1) * boundingBoxThickness);//11

        //outer intermediate plane colorsIceberg
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        //inner intermediate plane colorsIceberg
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

        //outer bottom level
        this.verticesOuterBoundingBox.push(x + dimensionBottomPlane, y + dimensionBottomPlane, z - H);
        this.verticesOuterBoundingBox.push(x - dimensionBottomPlane, y - dimensionBottomPlane, z - H);
        this.verticesOuterBoundingBox.push(x - dimensionBottomPlane, y + dimensionBottomPlane, z - H);
        this.verticesOuterBoundingBox.push(x + dimensionBottomPlane, y - dimensionBottomPlane, z - H);//15
        //inner bottom level
        this.verticesInnerBoundingBox.push((x + dimensionBottomPlane) * boundingBoxThickness, (y + dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
        this.verticesInnerBoundingBox.push((x - dimensionBottomPlane) * boundingBoxThickness, (y - dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
        this.verticesInnerBoundingBox.push((x - dimensionBottomPlane) * boundingBoxThickness, (y + dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));
        this.verticesInnerBoundingBox.push((x + dimensionBottomPlane) * boundingBoxThickness, (y - dimensionBottomPlane) * boundingBoxThickness, (z - H) - (z - H) * (0.9 - boundingBoxThickness));//11

        //outer bottom plane colorsIceberg
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        this.colorsOuterBoundingBox.push(1.0, 0.0, 0.0, 1.0);
        //inner bottom plane colorsIceberg
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);
        this.colorsInnerBoundingBox.push(0.0, 1.0, 0.0, 1.0);

        // var outerHullPoints = generateHullPoints(verticesOuterBoundingBox);
        // var outerhull = generateHull(outerHullPoints);
        // for (i = 0; i < outerhull.length; i++) {
        //     colorsIceberg.push(Math.random(), Math.random(), Math.random(), 0.5);
        //     indicesBoundingBox.push(outerhull[i][0], outerhull[i][1], outerhull[i][2]);
        // }
        //pushing all triangles of the different faces
        this.indicesBoundingBox.push(
            0, 4, 6, //1
            0, 2, 6,
            0, 2, 1, //3
            5, 6, 1,
            2, 6, 1, //5
            3, 0, 1,
            3, 5, 1, //7
            3, 7, 5,
            3, 7, 4, //9
            3, 0, 4,
            8, 7, 4, //11
            8, 11, 7,
            8, 10, 4, //13
            10, 6, 4,
            10, 9, 6, //15
            9, 5, 6,
            9, 11, 7, //17
            9, 5, 7,
            9, 11, 13, //19
            15, 11, 13,
            14, 9, 13, //21
            14, 10, 9,
            14, 13, 12, //23
            14, 10, 12,
            8, 15, 12, //25
            8, 11, 15,
            8, 12, 10, //27
            12, 13, 15
        )
    }
}