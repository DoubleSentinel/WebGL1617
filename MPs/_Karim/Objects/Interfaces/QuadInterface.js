class QuadInterface extends DrawableInterface {
    constructor() {
        super();
    }

    fillArrays(quad, fullTime, deltaTime) {
        quad.vertices.push(-quad.width / 2, -quad.height / 2, 0);
        quad.vertices.push(-quad.width / 2, quad.height / 2, 0);
        quad.vertices.push(quad.width / 2, -quad.height / 2, 0);
        quad.vertices.push(quad.width / 2, quad.height / 2, 0);

        for(var i = 0; i < quad.vertices.length / 3; i++) {
            quad.colors.push(quad.r, quad.g, quad.b, 1);
        }

        quad.indices.push(0, 1, 2);
        quad.indices.push(3, 2, 1);

        // glContext.uniform1f(prg.uDeltaTime, deltaTime);
        // glContext.uniform1f(prg.uFullTime, fullTime);
    }
}