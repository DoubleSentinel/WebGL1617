var anim2 = new function () {
    this.circles = [];
    this.vertexName = "shader-vs-animation2";
    this.fragmentName = "shader-fs-animation2";

    this.rayon = 0.1;
    this.deltaRadius = 0.01;
    this.border = 0.975;
    this.minS = 5;
    this.maxS = 20;

    this.cameraFct   = function(){
      translationMat = mat4.create();
      mat4.identity(translationMat);
      if( perspective ){
        mat4.perspective(pMatrix, degToRad(60.0), glContext.canvas.width / glContext.canvas.height, 0.1, 1000.0);
        var tx = 0.0;
        var ty = 0.0;
        var tz = -1.0;
        mat4.translate(translationMat,translationMat, [tx, ty, tz]);
      }
      else{
        mat4.identity(pMatrix);
        mat4.ortho(pMatrix, -1.0, 1.0, -1.0, 1.0 ,1.0, -1.0);
      }
      rotateModelViewMatrixUsingQuaternion(true);
      glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
      glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mat4.multiply(mat4.create(), translationMat, mvMatrix));
    }

    this.initShaderParameters = function(prg){
      prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
      glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
      prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
      glContext.enableVertexAttribArray(prg.colorAttribute);
      prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
      prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
      prg.radiusAttribute = glContext.getAttribLocation(prg, "aRadius");
      prg.centerXAttribute = glContext.getAttribLocation(prg, "aCenterX");
      prg.centerYAttribute = glContext.getAttribLocation(prg, "aCenterY");
      prg.opacityAttribute = glContext.getAttribLocation(prg, 'aOpacity');
      prg.borderAttribute = glContext.getAttribLocation(prg, 'aBorder');
    }

    this.initBuffers = function(){
      if(nb % 3 == 0){
        var somme = 0;
        for (var i = 0; i < frequencyData.length; i++) {
          somme = somme + frequencyData[i];
        }
        var amplitude = somme / frequencyData.length;
        if(amplitude - beforeAmp > this.minS){
            var circle = [0,0, this.rayon, ((amplitude - beforeAmp)/this.maxS)];
            this.circles.push(circle);
        }
        beforeAmp = amplitude;
      }
      nb = nb + 1;
      indices = [];
      colors = [];
      vertices = [];

      if(frequencyData.length > 0)
      {
          modifyColor();
      }
      var i = 0;
      this.circles.forEach(function(circle){
        indices.push(i,i+1,i+3,i+2);
        colors.push(red, green, blue, 1.0);
        colors.push(red, green, blue, 1.0);
        colors.push(red, green, blue, 1.0);
        colors.push(red, green, blue, 1.0);

        vertices.push(circle[0] - circle[2], circle[1] + circle[2], 0.0,
          circle[0] + circle[2], circle[1] + circle[2], 0.0,
          circle[0] + circle[2], circle[1] - circle[2], 0.0,
          circle[0] - circle[2], circle[1] - circle[2], 0.0);
          i += 4;
      });
      vertexBuffer = getVertexBufferWithVertices(vertices);
      indexBuffer = getIndexBufferWithIndices(indices);
      colorBuffer = getVertexBufferWithVertices(colors);
    }

    this.drawScene = function(){
      // Permet de faire grandir les cercles et d'enlever les trop grand.
       this.circles = this.circles.map(e => {
        e[2] += this.deltaRadius;
        return e;
      }).filter(e => e[2] < 1);
      this.initBuffers();

      glContext.clearColor(0.0, 0.0, 0.0, 1.0);
      glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
      glContext.enable(glContext.BLEND);
      glContext.disable(glContext.DEPTH_TEST);
      glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
      glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);

      this.cameraFct(perspective);

      glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
      glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
      glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);

      var offset = 0;
      this.circles.forEach(function(circle){
        glContext.vertexAttrib1f(prg.centerXAttribute, circle[0]);
        glContext.vertexAttrib1f(prg.centerYAttribute, circle[1]);
        glContext.vertexAttrib1f(prg.radiusAttribute, circle[2]);
        glContext.vertexAttrib1f(prg.opacityAttribute, circle[3]);
        glContext.vertexAttrib1f(prg.borderAttribute, this.border);
        if(circle[3] == 0.0){
            glContext.drawElements(glContext.TRIANGLE_STRIP, 4, glContext.UNSIGNED_SHORT, offset);
        }
        offset += 8;
      });
    }
}
