var anim3 = new function () {
    this.forms = [];
    this.vertexName = "shader-vs-animation3";
    this.fragmentName = "shader-fs-animation3";
    this.rayon = 0.1;
    this.deltaRadius = 0.01;
    this.border = 0.975;
    this.minS = 5;
    this.maxS = 20;
    this.rotation = false;
    var division = 3;

    this.changeDivision = function(value){
      division = value;
    }

    this.cameraFct = function(){
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
      //Linking of the attribute "vertex position"
      prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    	//Linking of the attribute "color"
    	prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    	glContext.enableVertexAttribArray(prg.colorAttribute);
    	//Linking of the uniform [mat4] for the projection matrix
    	prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    	//Linking of the uniform [mat4] for the movement matrix
    	prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');

            prg.opacityAttribute = glContext.getAttribLocation(prg, 'aOpacity');
    }

    this.initBuffers = function(){
      if(nb % 3 == 0){
        var somme = 0;
        for (var i = 0; i < frequencyData.length; i++) {
          somme = somme + frequencyData[i];
        }
        var amplitude = somme / frequencyData.length;
        if(amplitude - beforeAmp > this.minS){
            var form = [0,0, this.rayon, ((amplitude - beforeAmp)/this.maxS)];
            this.forms.push(form);
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
      var j = 0;
      this.forms.forEach(function(form){
        for(var i = 0;i<360;i+=(360/division))
        {
          vertices.push(form[2] * Math.sin(glMatrix.toRadian(i)), form[2] * Math.cos(glMatrix.toRadian(i)),(form[3]*0.1));
          colors.push(red, green, blue, form[3]);
          indices.push(j);
          j++;
        }
      });

      vertexBuffer = getVertexBufferWithVertices(vertices);
      colorBuffer  = getVertexBufferWithVertices(colors);
      indexBuffer  = getIndexBufferWithIndices(indices);
    }

    this.drawScene = function(){
      if(this.rotation){
        rx = degToRad(1);
        ry = degToRad(0);

        rotXQuat = quat.create();
        quat.setAxisAngle(rotXQuat, [0, 0, 1], rx);

        rotYQuat = quat.create();
        quat.setAxisAngle(rotYQuat, [0, 1, 0], ry);

        myQuaternion = quat.create();
        quat.multiply(myQuaternion, rotYQuat, rotXQuat);

        rotationMatrix = mat4.create();
        mat4.identity(rotationMatrix);
        mat4.fromQuat(rotationMatrix, myQuaternion);
        mat4.multiply(mvMatrix, rotationMatrix, mvMatrix);

      }
      // Permet de faire grandir les cercles et d'enlever les trop grand.
       this.forms = this.forms.map(e => {
        e[2] += this.deltaRadius;
        return e;
      }).filter(e => e[2] < 2);
      this.initBuffers();

      glContext.clearColor(0.0, 0.0, 0.0, 1.0);
      //Sends the mvMatrix to the shader
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
      glContext.vertexAttrib1f(prg.opacityAttribute, 0.5);

      var offset = 0;
      this.forms.forEach(function(form){
        glContext.drawElements(glContext.LINE_LOOP, division, glContext.UNSIGNED_SHORT,offset);
        offset += (2*division);
      });
    }
}
