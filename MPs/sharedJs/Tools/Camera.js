/**
 * Created by alexandre on 12.10.2016.
 */

class Camera extends BaseObject {
    constructor(...args){
        super(args);

        this._defaultValues = {
            pos: vec3.fromValues(0.0, -10.0, 0.0),
            speed: 1.0,
            front: vec3.fromValues(0.0, 1.0, 0.0),
            right: vec3.fromValues(-1.0, 0.0, 0.0)
        };

        this._pos = this._defaultValues.pos;
        this._speed = this._defaultValues.speed;
        this._front = this._defaultValues.front;
        this._right = this._defaultValues.right;

        this.extractObjects(this, args);

        this._up = vec3.create();
        this._orientation = quat.create();
        vec3.cross(this._up, this._right, this._front);
    }

    get pos ()          {return this._pos}
    set pos(p)          {this._pos = p}
    get speed ()        {return this._speed}
    set speed(s)        {this._speed = s; this._defaultValues.speed = s;}
    get front()         {return this._front}
    set front(o)        {this._front = o}
    get right()         {return this._right}
    set right(o)        {this._right = o}
    get up()            {return this._up}
    set up(o)           {this._up = o}
    get orientation()   {return this._orientation}
    set orientation(o)  {this._orientation = o}

    setPosFromValues(x, y, z) {this._pos = vec3.fromValues(x, y, z)}
    getX() {return this._pos[0]}
    getY() {return this._pos[1]}
    getZ() {return this._pos[2]}
    setX(x) {this.pos[0] = x}
    setY(y) {this.pos[1] = y}
    setZ(z) {this.pos[2] = z}
    getFastSpeed() {return this._defaultValues.speed * 3}
    getDefaultSpeed() {return this._defaultValues.speed}

    moveFront() {
        this.setX(this.getX() + this.speed*this.front[0]);
        this.setY(this.getY() + this.speed*this.front[1]);
        this.setZ(this.getZ() + this.speed*this.front[2]);
    }

    moveBack() {
        this.setX(this.getX() - this.speed*this.front[0]);
        this.setY(this.getY() - this.speed*this.front[1]);
        this.setZ(this.getZ() - this.speed*this.front[2]);
    }

    moveRight() {
        this.setX(this.getX() + this.speed*this.right[0]);
        this.setY(this.getY() + this.speed*this.right[1]);
        this.setZ(this.getZ() + this.speed*this.right[2]);
    }

    moveLeft() {
        this.setX(this.getX() - this.speed*this.right[0]);
        this.setY(this.getY() - this.speed*this.right[1]);
        this.setZ(this.getZ() - this.speed*this.right[2]);
    }

    moveUp() {
        this.setX(this.getX() + this.speed*this.up[0]);
        this.setY(this.getY() + this.speed*this.up[1]);
        this.setZ(this.getZ() + this.speed*this.up[2]);
    }

    moveDown() {
        this.setX(this.getX() - this.speed*this.up[0]);
        this.setY(this.getY() - this.speed*this.up[1]);
        this.setZ(this.getZ() - this.speed*this.up[2]);
    }

    rotateLeft() {
        var rotQuat = quat.create();
        quat.setAxisAngle(rotQuat, this.front, degToRad(-5));
        this.updateVectorsFromQuat(rotQuat);
    }

    rotateRight() {
        var rotQuat = quat.create();
        quat.setAxisAngle(rotQuat, this.front, degToRad(5));
        this.updateVectorsFromQuat(rotQuat);
    }

    reset() {
        this.pos = vec3.fromValues(0, 0, 0);
        //var rotQuat = quat.create();
        //quat.invert(rotQuat, this.orientation);
        //this.updateVectorsFromQuat(rotQuat);
    }

    updateVectorsFromQuat(quat) {
        vec3.transformQuat(this.front, this.front, quat);
        vec3.transformQuat(this.right, this.right, quat);
        vec3.normalize(this.front, this.front); //just in case
        vec3.normalize(this.right, this.right); //just in case
        vec3.cross(this.up, this.right, this.front);
    }

    update() {
        var rotQuat = rotateModelViewMatrixUsingQuaternion(this);
        this.updateVectorsFromQuat(rotQuat);
        var finalMatrix = mat4.create();
        var lookAt = vec3.create();
        vec3.add(lookAt, this.pos, this.front);
        mat4.lookAt(finalMatrix, this.pos, lookAt, this.up);
        return finalMatrix;
    }
}