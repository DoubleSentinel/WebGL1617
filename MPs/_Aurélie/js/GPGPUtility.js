//From : http://www.vizitsolutions.com/portfolio/webgl/gpgpu/implementation.html (14.12.16)
GPGPUtility = function(width,height,attributes_){
  var attributes;
  var canvas;
  var gl;
  var canvasHeight, canvasWidth;
  var problemHeight, problemWidth;
  var standardVertexShader;
  var standardVertices;
  var textureFloat;

  textureFloat = gl.getExtension('OES_texture_floate');

  this.isFloatingTexture = function(){
    return textureFloat != null;
  };

  this.makeTexture = function(gl, width, height, type, data){
    var texture;

    texture = gl.createTexture();
    //Bind texture
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, data);

    //Unbind texture
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
  };

  this.makeGPCanvas = function(width, height){
    var canvas;
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    return canvas;
  };

  this.getStandardGeometry = function(){
    return new Float32Array([-1.0,  1.0, 0.0, 0.0, 1.0,  // upper left
                           -1.0, -1.0, 0.0, 0.0, 0.0,  // lower left
                            1.0,  1.0, 0.0, 1.0, 1.0,  // upper right
                            1.0, -1.0, 0.0, 1.0, 0.0]); //lower right
  };

  this.attachFrameBuffer = function(gl, texture){
    var frameBuffer;

    frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    return frameBuffer;
  };

  this.framBufferIsComplete = function(){
    var message;
    var status;
    var value;

    status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

    switch(status){
      case gl.FRAMEBUFFER_COMPLETE:
        value = true;
        break;
      case gl.FRAMEBUFFER_UNSUPPORTED:
        message = "Framebuffer is unsupported";
        value = false;
        break;
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        message = "Framebuffer incomplete attachment";
        //Plus d'autres encore
    }
    return {isComplete: value, message: message};
  };

  canvasHeight = height;
  problemHeight = canvasHeight;
  canvasWidth = width;
  problemWidth = canvasWidth;
  attributes = typeof attributes_ === 'undefined' ? ns.GPGPUtility.STANDARD_CONTEXT_ATTRIBUTES : attributes_;
  canvas = this.makeGPCanvas(canvasWidth, canvasHeight);
  gl = this.getGLContext();//A cause de ce qu'on utilise.
  //Activation de l'extension.
  textureFloat = gl.getExtension('OES_texture_floate');

};
//Features not use
GPGPUtility.STANDARD_CONTEXT_ATTRIBUTES = {alpha: false, depth: false, antialias: false};

this.getGLContext = function(){
  if(!gl){
    gl = canvas.getContext("webgl",attributes) || canvas.getContext('experimental-webgl',attributes);
  }
  return gl;
};
