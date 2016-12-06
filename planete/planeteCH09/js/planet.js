class Planet{
	constructor(name, radius, x, y, z, colorTexture,  specularTexture, normalTexture = null, nightTexture = null)
	{
		this.name = name;
		this.radius = radius;
		
		//Initialisation of the buffers within the object for the render area
		this.vertexBuffer = null;
		this.textureCoordsBuffer = null;
		this.indexBuffer = null;
		
		//We take the pointers to the uploaded textures
		this.colorTexture = colorTexture;
		this.normalTexture = normalTexture;
		this.specularTexture = specularTexture;
		this.nightTexture = nightTexture;
		
					
		this.x = x;
		this.y = y;
		this.z = z;
		
		//Static definition of the subdivision of the perimeter of the planet to creater the various points for the verticies
		this._subdivision = 0;
		
		//Creation of a model view matrix specific for the object
		this.mvMatrix = mat4.create();
		this.nMatrix = mat4.create();
		
		
		
		//Call of the initialisation method
		this.init();
		
	}

	
	//Getter/setter for division
	set subdivision(div){
		this._subdivision = div;
		this.init();
	}
	
	get subdivision(){
		return this._subdivision;
	}
		
	//Subdivision function to generate the sphere with an icosahedron	
	fromOneToFourTriangles(v1, v2, v3, depth){
		//Declaration of temporary arrays for each subdivision
		var v12 = [];
		var v23 = [];
		var v31 = [];
		
		
		var tu1 = 0;
		var tv1 = 0;
		var tu2 = 0;
		var tv2 = 0;
		var tu3 = 0;
		var tv3 = 0;
		
		var u1 = 0;
		var v_1 = 0;
		var u2 = 0;
		var v_2 = 0;
		var u3 = 0;
		var v_3 = 0;
		
		
		//If we arrived at the end of the recursive subdivision
		if (depth == 0) {
			//We store all the vertices, colors and indexes
			this.vertices.push( v1[0], v1[1], v1[2] );
			this.indices.push(this.indexCnt);
			this.vertices.push( v2[0], v2[1], v2[2] );
			this.indices.push(this.indexCnt + 1);
			this.vertices.push( v3[0], v3[1], v3[2] );
			this.indices.push(this.indexCnt + 2);
			
			this.indexCnt += 3;
			
			
			/***************************************************
			*	We calculate the texture coordinates for each point
			*	http://vterrain.org/Textures/spherical.html
			*	http://www.progonos.com/furuti/MapProj/Normal/ProjPoly/Foldout/Icosahedron/
			***************************************************/
			tu1 = 0.5 + (Math.atan2(v1[0], v1[2])) / (Math.PI * 2);
			tv1 = 0.5 + (Math.asin(v1[1])) / Math.PI;
			tu2 = 0.5 + (Math.atan2(v2[0], v2[2])) / (Math.PI * 2);
			tv2 = 0.5 + (Math.asin(v2[1])) / Math.PI;
			tu3 = 0.5 + (Math.atan2(v3[0], v3[2])) / (Math.PI * 2);
			tv3 = 0.5 + (Math.asin(v3[1])) / Math.PI;
			
			var ecart = 0.7;
			
			if(Math.abs(tu1 - tu2) > ecart || Math.abs(tu1 - tu3) > ecart || Math.abs(tu2 - tu3) > ecart)
			{
				if(tu1 > ecart){
					if(tu2 > ecart){
						tu3 += 1;
					}
					else if(tu3 > ecart){
						tu2 += 1;
					}
					else{
						tu1 -= 1;
					}
				}
				else if(tu2 > ecart){
					if(tu1 > ecart){
						tu3 += 1;
					}
					else if(tu3 > ecart){
						tu1 += 1;
					}
					else{
						tu2 -= 1;
					}
				}
				else if(tu3 > ecart){
					if(tu1 > ecart){
						tu2 += 1;
					}
					else if(tu2 > ecart){
						tu1 += 1;
					}
					else{
						tu3 -= 1;
					}
				}
			}
			//We push the texture coordinates for each corresponding vertice
			this.textureCoords.push(tu1, tv1);
			this.textureCoords.push(tu2, tv2);
			this.textureCoords.push(tu3, tv3);

		}else{
			//If we are still subdividing
			//We define 3 vectors per component (x,y,z) for each triangle based on the previous one
			for (var i = 0; i < 3; i++) {
				v12.push( (v1[i]+v2[i])/2.0 );
				v23.push( (v2[i]+v3[i])/2.0 );
				v31.push( (v3[i]+v1[i])/2.0 );
			}
			//We normalize the 3 new triangles based on the vectors
			v12 = this.normalize(v12);
			v23 = this.normalize(v23);
			v31 = this.normalize(v31);
			
			//We subdivised our new triangles
			this.fromOneToFourTriangles( v1, v12, v31, depth-1);
			this.fromOneToFourTriangles( v2, v23, v12, depth-1);
			this.fromOneToFourTriangles( v3, v31, v23, depth-1);
			this.fromOneToFourTriangles( v12, v23, v31, depth-1);
		}
	}	
		
	//Function to normalize a vector
	normalize(v, radius = 1.0){
		var d = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
		if (d!=0.0){
		  v[0] = v[0]/ d * radius;
		  v[1] = v[1]/ d * radius;
		  v[2] = v[2]/ d * radius;
		}
		return v;
	}
		
		
	//Initialisation method of a planet object
	init()
	{	
	
		///this.clearBuffers();
	
		//Initialisation of the arrays used to construct the object		
		this.indices = [];
		this.vertices = [];
		this.textureCoords = [];
		
		//We define the index "count" at 0
		this.indexCnt = 0;
		
		
		//Initialisation of the icosahedron
		this.initIcosahedron();
		
		
		
		//We create the buffers on the GPU
		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.textureCoordsBuffer = getVertexBufferWithVertices(this.textureCoords);
		this.indexBuffer = getIndexBufferWithIndices(this.indices);
		
		
		
	}
	
	
	//Initialisation of the icosahedron
	initIcosahedron(){
		//We define the components to draw the base icosahedron, see : 
		//And we take into account the radius of each sphere.
		const X = 0.525731112119133696;
		const Z = 0.850650808352039932;
		//We create each base vertex
		var icosahedronvertex = [];
		icosahedronvertex.push(-X, 0.0, Z);
		icosahedronvertex.push(X, 0.0, Z);
		icosahedronvertex.push(-X, 0.0, -Z);
		icosahedronvertex.push(X, 0.0, -Z);
		icosahedronvertex.push(0.0, Z, X);
		icosahedronvertex.push(0.0, Z, -X);
		icosahedronvertex.push(0.0, -Z, X);
		icosahedronvertex.push(0.0, -Z, -X);
		icosahedronvertex.push(Z, X, 0.0);
		icosahedronvertex.push(-Z, X, 0.0);
		icosahedronvertex.push(Z, -X, 0.0);
		icosahedronvertex.push(-Z, -X, 0.0);
		//We create each base index
		var icosahedrontriangle = [];
		icosahedrontriangle.push(1,4,0);
		icosahedrontriangle.push(4,9,0);
		icosahedrontriangle.push(4,5,9);
		icosahedrontriangle.push(8,5,4);
		icosahedrontriangle.push(1,8,4);
		icosahedrontriangle.push(1,10,8);
		icosahedrontriangle.push(10,3,8);
		icosahedrontriangle.push(8,3,5);
		icosahedrontriangle.push(3,2,5);
		icosahedrontriangle.push(3,7,2);
		icosahedrontriangle.push(3,10,7);
		icosahedrontriangle.push(10,6,7);
		icosahedrontriangle.push(6,11,7);
		icosahedrontriangle.push(6,0,11);
		icosahedrontriangle.push(6,1,0);
		icosahedrontriangle.push(10,1,6);
		icosahedrontriangle.push(11,0,9);
		icosahedrontriangle.push(2,11,9);
		icosahedrontriangle.push(5,2,9);
		icosahedrontriangle.push(11,2,7);
		//Foreach point
		for (var i = 0; i < icosahedrontriangle.length; i+=3){
			//We create 3 empty vectors
			var v1 = [];
			var v2 = [];
			var v3 = [];
			//Retrive the base index
			var vertexIndexStart = icosahedrontriangle[i] * 3;
			//We define v1, a point/vector of the current triangle
			v1.push(icosahedronvertex[vertexIndexStart],
					icosahedronvertex[vertexIndexStart + 1],
					icosahedronvertex[vertexIndexStart + 2]);
			vertexIndexStart = icosahedrontriangle[i+1] * 3;
			//We define v2, a point/vector of the current triangle
			v2.push(icosahedronvertex[vertexIndexStart],
					icosahedronvertex[vertexIndexStart + 1],
					icosahedronvertex[vertexIndexStart + 2]);
			vertexIndexStart = icosahedrontriangle[i+2] * 3;
			//we define v3, a point/vector of the current triangle
			v3.push(icosahedronvertex[vertexIndexStart],
					icosahedronvertex[vertexIndexStart + 1],
					icosahedronvertex[vertexIndexStart + 2]);
			//We start the recursive subdivision of the selected triangle
			this.fromOneToFourTriangles(v1, v2, v3, this._subdivision);
		}
	}
	
	
	
	
	//This method clears the buffer
	clearBuffers()
	{
		if(this.vertexBuffer != null)
		{
			glContext.deleteBuffer(this.vertexBuffer);
		}
		if(this.textureCoordsBuffer != null)
		{
			glContext.deleteBuffer(this.textureCoordsBuffer);
		}
		if(this.indexBuffer != null)
		{
			glContext.deleteBuffer(this.indexBuffer);
		}
		
	}
	
	
	//Draw method of the planet object
	draw(mvMatrix)
	{
		
		
		glContext.useProgram(progPlanet);
		
		//Resets the local model view matrix
		mat4.identity(this.mvMatrix);
		//Translates the mv matrix
		mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(this.x, this.y, this.z));
		//Multiplies the model View matrix of the object with the view matrix of the scene
		mat4.multiply(this.mvMatrix, this.mvMatrix, mvMatrix);
		
		glContext.uniformMatrix4fv(ptr.mvMatrixUniform, false, this.mvMatrix);
			
		//We send the radius
		glContext.uniform1f(ptr.radius, this.radius);
		//We send the rotation
		glContext.uniform1f(ptr.rotation, 0);
		//We send the inclination
		glContext.uniform1f(ptr.inclination, 90);
		
		
		
		
		//We enable the Texture0 slot
		glContext.activeTexture(glContext.TEXTURE0);
		//We store the colorTexture pointer(already on the GPU) in the Texture0 slot
		glContext.bindTexture(glContext.TEXTURE_2D, this.colorTexture);
		//We inform that our colorTexture is placed in the Texture0 slot
		glContext.uniform1i(ptr.colorTextureUniform, 0);
		
		//We define how to use the texture
		glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.REPEAT);
		
		//If there is a normal texture
		if(this.normalTexture != null){
			//We enable the Texture1 slot
			glContext.activeTexture(glContext.TEXTURE1);
			//We store the normalTexture pointer(already on the GPU) in the Texture1 slot
			glContext.bindTexture(glContext.TEXTURE_2D, this.normalTexture);
			//We inform that our normalTexture is placed in the Texture1 slot
			glContext.uniform1i(ptr.normalTextureUniform, 1);
			//We define how to use the texture
			glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.REPEAT);
			//We notify that there is indeed a normal texture to use for rendering
			glContext.uniform1i(ptr.normal, true);
		}
		else
		{
			//We notify that there is no normal texture to use for rendering
			glContext.uniform1i(ptr.normal, false);
		}
		
		if(this.nightTexture != null){
			//We enable the texture3 slot
			glContext.activeTexture(glContext.TEXTURE3);
			//We store the nightTexture pointer(already on the GPU) in the Texture3 slot
			glContext.bindTexture(glContext.TEXTURE_2D, this.nightTexture);
			//We inform that our nightTexture is placed in the Texture3 slot
			glContext.uniform1i(ptr.earthNight, 3);
			//We define how to use the texture
			glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.REPEAT);
			//We notify that there is indeed a night texture to use for rendering
			glContext.uniform1i(ptr.night, true);
			}
		else
		{
			glContext.uniform1i(ptr.night, false);
		}
		
		
			
		//We enable the texture4 slot
		glContext.activeTexture(glContext.TEXTURE4);
		//We store the specularTexture pointer(already on the GPU) in the Texture4 slot
		glContext.bindTexture(glContext.TEXTURE_2D, this.specularTexture);
		//We inform that our specularTexture is placed in the Texture4 slot
		glContext.uniform1i(ptr.specularTextureUniform, 4);
		//We define how to use the texture
		glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.REPEAT);
		
		
		
		//We calculate the transposed matrix 
		mat4.copy(this.nMatrix, this.mvMatrix);
		mat4.invert(this.nMatrix, this.nMatrix);
		mat4.transpose(this.nMatrix, this.nMatrix);
		//And send it to the gpu
		glContext.uniformMatrix4fv(ptr.nMatrixUniform, false, this.nMatrix);
		
		
		
		//Transfer of the vertices for the planet
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
		glContext.vertexAttribPointer(ptr.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
		//Transfer of the colors for the planet
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textureCoordsBuffer);
		glContext.vertexAttribPointer(ptr.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0 );
		//Transfer the indexes for the planet
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		
		//We draw the icosahedron as lines
		glContext.uniform1i(ptr.skybox, false);
		glContext.drawElements(glContext.TRIANGLE_STRIP, this.indices.length, glContext.UNSIGNED_SHORT,0);
		
	}
}