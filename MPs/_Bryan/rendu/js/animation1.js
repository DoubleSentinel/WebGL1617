var anim1 = new function () {
  this.vertexName = "shader-vs-animation1";
  this.fragmentName = "shader-fs-animation1";
  this.verticesTemp = [];
  this.colorsTemp = [];
  this.rowsVertices = [];
  this.rowsColors= [];

    this.initializeArrayTwoDim = function ()
    {
        var i = 0;
        var index = 0;
        var j = 0;
        var pasX = 2.0 / NB_FREQUENCIES;
        var pasZ = 2.0 / NB_ROWS;

        for(i = -1.0; i< 1.0;i+=pasZ)
        {
            this.rowsVertices.push([]);
            this.rowsColors.push([]);
            for(j = -1.0; j< 1.0;j+=pasX)
            {
                this.rowsVertices[index].push(j,-1.0,i);
                this.rowsColors[index].push(0.0,0.0,0.0,1.0);
            }
            index++;
        }

        //Nos indices ne vont jamais bouger donc on peut les initialiser ici
        var nbFreq = NB_FREQUENCIES-2;
        for(i = 0; i<NB_ROWS-2;i++)
        {
            for(j =0;j<nbFreq;j++)
            {
                indices.push(i*NB_FREQUENCIES + j, (i+1)*NB_FREQUENCIES + j, (i+1)*NB_FREQUENCIES + j + 1);
                indices.push(i*NB_FREQUENCIES + j, i*NB_FREQUENCIES + j +1, (i+1)*NB_FREQUENCIES + j + 1);
            }
        }
    }

    this.shiftRows = function(){
      //On déplace toutes nos lignes vers "le bas". On ne change pas la première ligne car elle va être de toute manière changée par la suite
      var pasZ = 2.0 / NB_ROWS;
      var z = -1.0;
      var i = NB_ROWS-1;
      var j = 0;

      for(i = 0; i < NB_ROWS-1;i++)
      {
          this.rowsVertices[i] = [];
          this.rowsVertices[i] = this.rowsVertices[i].concat(this.rowsVertices[i+1]);
          this.rowsColors[i] = [];
          this.rowsColors[i] = this.rowsColors[i].concat(this.rowsColors[i+1]);
          for(j =2; j<this.rowsVertices[i].length;j+=3)
          {
              this.rowsVertices[i][j] =  z;

          }
          z += pasZ;
      }
    }

    this.cameraFct = function(){
      var stretch_width = 0.45;
      translationMat = mat4.create();
      mat4.identity(translationMat);
      //La multiplication par stretch_width permet d'étirer l'affichage sur la largeur
      mat4.perspective(pMatrix, degToRad(40.0), c_width*stretch_width / c_height, 0.1, 10000.0);
      var tx = 0.0;
      var ty = 0.0;
      var tz = -6.0;
      mat4.translate(translationMat,translationMat, [tx, ty, tz]);
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
      this.initializeArrayTwoDim();
    }

    this.initBuffers = function(){
      var index = -1.0;
      var indice = 0;
      var y = 0;
      colors = [];
      vertices = [];

      if(frequencyData.length > 0)
      {
          //On décale nos lignes
          this.shiftRows();
          modifyColor();

          this.rowsVertices[NB_ROWS-1] = [];
          this.rowsColors[NB_ROWS-1] = [];
          var pas = 2.0 / NB_FREQUENCIES;

          for(index = -1.0; index < 1.0;index+=pas)
          {
              y = (frequencyData[indice]/MAX_VALUE)-1.0;

              //On repli des tableaux temporaires afin d'en ajouter 3 à la suite
              //Cela permet d'être sûr qu'on ajoute bien 3 éléments à la fois pour créer des triangles
              this.rowsVertices[NB_ROWS-1].push(index,y,1.0);
              this.rowsColors[NB_ROWS-1].push(red,green,blue,1.0);

              //On remet nos variables servant de file d'attente à zéro
              this.verticesTemp = [];
              this.colorsTemp = [];
              indice++;
          }
      }
      var i = 0;
      for(i = 0 ; i< NB_ROWS;i++)
      {
          vertices = vertices.concat(this.rowsVertices[i]);
          colors = colors.concat(this.rowsColors[i]);
      }
      vertexBuffer = getVertexBufferWithVertices(vertices);
      colorBuffer = getVertexBufferWithVertices(colors);
      indexBuffer = getIndexBufferWithIndices(indices);
    }

    this.drawScene = function(){
      //Evite une erreur avec Chromium car il semble se lancer dans le dessin de la scène avant que le contexte soit crée...
      if(glContext == null)
      {
          return;
      }

      glContext.clearColor(0.0, 0.0, 0.0, 1.0);
      glContext.enable(glContext.DEPTH_TEST);
      glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
      glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
      glContext.depthFunc(glContext.LESS);

      this.cameraFct(perspective);

      glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
      glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
      glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
      glContext.drawElements(glContext.TRIANGLES,indices.length,glContext.UNSIGNED_SHORT,0);
    }
}
