class Blocky extends Drawable {
    constructor(args = {}) {
        super(args);
        var {
            cloud = [],
            bindingbox = [],
            height = 1,
            width = 1,
            rndseed =  Math.floor(Math.random()*10)
            } = args;
        this._width = width;
        this._height = height;
        this._cloud = cloud;
        this._bindingbox = bindingbox;
        this._rndseed = rndseed;
    }

    get cloud() {return this._cloud}
    set cloud(cloud){this._cloud = cloud}
    get bindingbox() {return this._bindingbox}
    set bindingbox(bbox){this._bindingbox = bbox}
    get width() {return this._width}
    set width(w){this._width = w}
    get height() {return this._height}
    set height(h){this._height = h}
    get seed() {return this._rndseed}
    set seed(h){this._rndseed = h}
}