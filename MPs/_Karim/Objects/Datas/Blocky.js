class Blocky extends Drawable {
    constructor(args = {}) {
        super(args);
        var {
            cloud = [],
            bindingbox = []
            } = args;

        this._cloud = cloud;
        this._bindingbox = bindingbox;
    }

    get cloud() {return this._cloud}
    set cloud(w){this._cloud = w}
    get bindingbox() {return this._bindingbox}
    set bindingbox(w){this._bindingbox = w}

}