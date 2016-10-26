/**
* planet.js - class handling the Planet object
*	@params -
*		name[string] - name of the planet
*		radius[float] - radius of the planet
*		color[array(r,g,b)] - color of the planet
*		x[float] - x position of the planet
*		y[float] - y position of the planet
*
**/
class Planet
{
	constructor(name, radius, color, x, y){
		this.name = name;
		this.radius = radius;
		this.color = color;
		//Initialisation of the buffers within the object
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.colorBuffer = null;
		//Initialisation of the arrays used to construct the object
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		this.x = x;
		this.y = y;
		//Static definition of the subdivision of the perimeter of the planet to creater the various points for the verticies
		this.division = 100;
		//Creation of a movement matrix specific for the object
		this.mvMatrix = mat4.create();

		//Call of the initialisation method
		this.init();
	}

	setDivision(value){
		this.division = value;
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		this.init();
	}
	//Initialisation method of a planet object
	init()
	{
		//Defining the center point of the circle
		this.vertices.push(0.0,0.0,0.0);

		//Based on division, generates the various vertices for the circle
		for(var i = 0;i<360;i+=360/this.division)
		{
			this.vertices.push(this.radius * Math.sin(glMatrix.toRadian(i)), this.radius * Math.cos(glMatrix.toRadian(i)),0.0);

		}

		//And defines the same color for each of the vertices
		for(var i =0;i<this.division+1;i++)
		{
			this.colors.push(this.color.r, this.color.g, this.color.b, 1.0);
		}

		//Definies the indexes for the objects, used to link each point
		for(var i=0;i<this.division-1;i++)
		{
			this.indices.push(0,i+1,i+2);
		}
		//and links the last vertices
		this.indices.push(0,this.division,1);

		//Converts the values to buffers
		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer  = getVertexBufferWithVertices(this.colors);
		this.indexBuffer  = getIndexBufferWithIndices(this.indices);

		//Defines the position matrix of the object
		mat4.identity(this.mvMatrix);
		mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(this.x, this.y, 0.0));
	}
	//Draw method of the planet object
	draw()
	{
		//Sends the mvMatrix to the shader
		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);
		//Links and sends the vertexBuffer to the shader, defining the format to send it as
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
		glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
		//Links and sends the colorBuffer to the shader, defining the format to send it as
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
		glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
		//Links the indexBuffer with the shader
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		//Based on the render variable
		if(render)
		{
			//Renders the objet as a wireframe
			glContext.drawElements(glContext.LINES, this.indices.length, glContext.UNSIGNED_SHORT,0);
		}
		else
		{
			//Renders the object as triangles
			glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT,0);
		}
	}
}
