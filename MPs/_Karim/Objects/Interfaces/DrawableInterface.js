class DrawableInterface {
    constructor() {
        if (new.target === DrawableInterface) {
            throw new TypeError("Cannot construct DrawableInterface instances directly (abstract class)");
        }
    }

    update(drawable, fullTime, deltaTime) {
        if(!drawable) throw ReferenceError("Null Drawable cannot be updated");
        drawable.vertices = [];
        drawable.colors = [];
        drawable.indices = [];

        this.fillArrays(drawable, fullTime, deltaTime);

        //Converts the values to buffers
        drawable.vertexBuffer = getVertexBufferWithVertices(drawable.vertices);
        drawable.colorBuffer = getVertexBufferWithVertices(drawable.colors);
        drawable.indexBuffer = getIndexBufferWithIndices(drawable.indices);

        //Defines the position matrix of the object
        mat4.identity(drawable.mvMatrix);
        mat4.translate(drawable.mvMatrix, drawable.mvMatrix, vec3.fromValues(drawable.x, drawable.y, drawable.z));
    }

    /**
     * This is where the drawing logic of the children will be
     */
    fillArrays() {
        throw TypeError("function fillArrays shouldn't be executed from abstract class DrawableInterface.");
    }
}
