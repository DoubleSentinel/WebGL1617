class Planet{
	constructor(name, radius, color, x, y, z)
	{
		this.name = name;
		this.radius = radius;
		this.color = color;
		//Initialisation of the buffers within the object for the render area
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.colorBuffer = null;	
		
		
		//Defines the vertical slice value
		this._verticalSlices = 20;
				
		this.x = x;
		this.y = y;
		this.z = z;
		
		//Static definition of the subdivision of the perimeter of the planet to creater the various points for the verticies
		this._division = 20;
		
		//Creation of a model view matrix specific for the object
		this.mvMatrix = mat4.create();
		
		
		
		//Call of the initialisation method
		this.init();
		
	}

	
	//Getter/setter for division
	set division(div){
		this._division = div;
		this.init();
	}
	
	get division(){
		return this._division;
	}
	
	//Getter/setter for vertical slice
	set verticalSlices(verticalSlices){
		this._verticalSlices = verticalSlices;
		this.init();
	}
	
	get verticalSlices(){
		return this._verticalSlices;
	}
	
	//Initialisation method of a planet object
	init()
	{	
	
		this.clearBuffers();
	
		//Initialisation of the arrays used to construct the object		
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		//Generation of points in circle to render the circles based on. Play with this to better understand how it works
		for (var i = 0.0; i <= this._division; i++){
			//this.vertices.push(1.0/this._division * i, 0, 0);
			this.vertices.push(1.0/this._division * i, 0, 0);
			this.indices.push(i);
			this.colors.push(this.color.r, this.color.g, this.color.b, 1.0);
		}
		
		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer = getVertexBufferWithVertices(this.colors);
		this.indexBuffer = getIndexBufferWithIndices(this.indices);
		
		
		this.initCatmull();
	}
	
	//Initialisation of the cattmull points
	initCatmull()
	{
		//Initialisation of the arrays used to calculate catmull rom
		this.points = [];
		this.colorPoints = [];
		this.indicesPoints = [];
		
		this.angleMatrixTab = [];
		//Creation of the values to render the cattmull rom circle
		for(var i = 0;i<360;i+=360/this._division)
		{
			this.points.push(this.radius * Math.sin(glMatrix.toRadian(i)), this.radius * Math.cos(glMatrix.toRadian(i)) / 1.0,0.5);
			this.colorPoints.push(this.color.r, this.color.g, this.color.b, 1.0);
			this.indicesPoints.push(this.indicesPoints.length);
		}
		
		//Calculates the angle to rotate each slice
		var angle = 360/this._verticalSlices;
		
		//Generation of each rotation matrix for the rendering
		for(var i = 0;i<this._verticalSlices;i++)
		{
			//We rotate the object by the angle 
			var angleMatrix = mat4.create(); 
			mat4.rotateY(angleMatrix, angleMatrix, glMatrix.toRadian(angle*i));
			this.angleMatrixTab.push(angleMatrix)
		}
		
		//Push of the first index to complete the circle
		this.indicesPoints.push(0);
		
		//Sets the alpha to 0.5 for catmullrom
		glContext.uniform1f(prg.alpha, 0.5);
	}
	
	//This method clears the buffer
	clearBuffers()
	{
		if(this.vertexBuffer != null)
		{
			glContext.deleteBuffer(this.vertexBuffer);
		}
		if(this.colorBuffer != null)
		{
			glContext.deleteBuffer(this.colorBuffer);
		}
		if(this.indexBuffer != null)
		{
			glContext.deleteBuffer(this.indexBuffer);
		}
	}
	
	
	//Draw curve function to handle cattmull rom drawing
	drawCurve(x0, y0, x1, y1, x2, y2, x3, y3)
	{
		//Definition of each point combinaison
		var p0 = [x0,y0];
		var p1 = [x1,y1];
		var p2 = [x2,y2];
		var p3 = [x3,y3];
		
		//Transfer 4 points to calculate cattmull rom
		glContext.uniform2fv(prg.p0Uniform, p0);
		glContext.uniform2fv(prg.p1Uniform, p1);
		glContext.uniform2fv(prg.p2Uniform, p2);
		glContext.uniform2fv(prg.p3Uniform, p3);	
		

		//For each vertical slices
		for(var i = 0;i<this._verticalSlices;i++)
		{			
			//Transfer the model view with rotation
			glContext.uniformMatrix4fv(prg.rotMatrixUniform, false, this.angleMatrixTab[i]);
			//Draw the object with line_strip
			glContext.drawElements(glContext.LINE_STRIP, this.indices.length, glContext.UNSIGNED_SHORT,0);
		}
		
	}
	//Draw method of the planet object
	draw(mvMatrix)
	{
		//Resets the local model view matrix
		mat4.identity(this.mvMatrix);
		//Translates the mv matrix
		mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(this.x, this.y, this.z));
		//Multiplies the model View matrix of the object with the view matrix of the scene
		mat4.multiply(this.mvMatrix, this.mvMatrix, mvMatrix);
		
		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);
		
		//We activate the render sphere with catmull rom
		glContext.uniform1i (prg.sphereRender , 1); 
		
		
		//Transfer of the vertices for the planet
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
		glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
		//Transfer of the colors for the planet
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
		glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
		//Transfer the indexes for the planet
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		
		
			//If there is at least 3 points, render the begining of the circle and the last division aswell
			if(this.points.length >= 9)
			{
				this.drawCurve(this.points[this.points.length-3], this.points[this.points.length-2], this.points[0], this.points[1], this.points[3], this.points[4], this.points[6], this.points[7]);
				this.drawCurve(this.points[this.points.length-6],this.points[this.points.length-5], this.points[this.points.length-3], this.points[this.points.length-2], this.points[0], this.points[1], this.points[3], this.points[4]);
			}
			//Draws all the middle points
			if (this.points.length >= 12)
			{
				for(var i = 0; i < this.points.length; i += 3)
				{
					this.drawCurve(this.points[i], this.points[i + 1], this.points[i + 3], this.points[i + 4], this.points[i + 6], this.points[i + 7], this.points[i + 9], this.points[i + 10]);
				}
			}
			//Draws the last points
			if(this.points.length >= 9)
			{
				this.drawCurve(this.points[this.points.length - 9], this.points[this.points.length - 8], this.points[this.points.length - 6], this.points[this.points.length - 5], this.points[this.points.length - 3], this.points[this.points.length - 2], this.points[1] + 2.0 * this.points[this.points.length - 3], this.points[1]);
			}
		
		
		//Resets the flag to 0
		glContext.uniform1i (prg.sphereRender , 0); 		
		
	}
}