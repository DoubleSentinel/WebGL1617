class Matrix{
//Represent a matrix
  constructor(dim){
    this.dim = dim;
    this.rows = [];
  }
  copy(){
    var matrix = new Matrix(this.dim);
    for(var i=0; i<this.dim; i++){
      for(var j=0; j<this.dim; j++){
        matrix.put(i,j,parseInt(this.get(i,j)));
      }
    }
    return matrix;
  }
  put(row, column, value){
    if(this.rows[row]==undefined){
      this.rows[row] = [];
    }
    var row = this.rows[row];
    row[column] = value;
  }
  get(row, column){
    return this.rows[row][column];
  }

//Display the matrix on the html
  display(tableID){
    var table = document.getElementById(tableID);
    var tableRow, tableColumn;
    for(var i=0; i<this.dim; i++){
      tableRow = table.insertRow(-1);
      for(var j=0; j<this.dim; j++){
        tableColumn=tableRow.insertCell(j);
        tableColumn.align = "center";
        tableColumn.innerHTML = this.rows[i][j];
      }
    }
  }
}
