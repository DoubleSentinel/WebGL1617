var path = require('path');
var webpack = require('webpack');
 
module.exports = {
    entry: {
        app: 'node_modules/alpha-shape/alpha.js'
    },
    output: {
        libraryTarget: "var",
        library: "alphaShape",
        filename: "alphaShape.js"
    }
};