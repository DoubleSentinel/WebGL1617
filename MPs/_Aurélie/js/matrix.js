class Matrix{

/*dim est un entier, rows un tableau qu'il faudra décomposer*/
  constructor(dim){
    this.dim = dim; //représente la dimension de la matrice. On va commencer avec des matrices carrées.
    this.rows = []//représente la matrice avec un tableau de nombre.
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
  //Affichage, qui ne marche pas pour l'instant
  display(tableID){
    //clearTable(tableID);
    var table = document.getElementById(tableID);
    var tableRow, tableColumn;
    for(var i=0; i<this.rows.lenght; i++){
      tableRow = table.insertRow(-1);
      for(var j=0; j<this.rows[i].lenght; j++){
        tableColumn=tableRow.insertCell(j);
        tableColumn.align = "center";
        tableColumn.innerHTML = this.rows[i][j];
      }
    }
  }
}
