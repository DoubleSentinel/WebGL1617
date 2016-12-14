class BlockyInterface extends DrawableInterface {
    constructor() {
        super();
    }

    fillArrays(blocky) {



        // quad.vertices.push(-quad.width / 2, -quad.height / 2, 0);
        // quad.vertices.push(-quad.width / 2, quad.height / 2, 0);
        // quad.vertices.push(quad.width / 2, -quad.height / 2, 0);
        // quad.vertices.push(quad.width / 2, quad.height / 2, 0);

        for(var i = 0; i < blocky.vertices.length / 3; i++) {
            blocky.colors.push(blocky.r, blocky.g, blocky.b, 1);
        }

        blocky.indices.push(0, 1, 2);
        blocky.indices.push(3, 2, 1);

    }

    initBlockyCloud(blocky){


    }

    initBindingBox(){
        
    }
}