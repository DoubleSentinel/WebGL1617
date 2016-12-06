/**
 * Created by alexandre on 12.10.2016.
 */

class BaseObject {
    constructor(...args) {
        this._defaultValues = {};
        this.extractObjects(this, args)
    }

    extractObjects(obj, args) {
        var objArgs = {};
        var numArgs = [];
        var i;
        for (i = 0; i < args.length; i++) {
            if (args[i] instanceof Object) Object.assign(objArgs, args[i]);
            else numArgs.push(args[i]);
        }
        $.each(obj._defaultValues, function(attr) {
            if(objArgs[attr] === undefined){
                (numArgs[0] === undefined) ? obj['_' + attr] = obj._defaultValues[attr] : obj['_' + attr] = numArgs.shift();
            }
            else obj['_' + attr] = objArgs[attr]
        });
    }
}