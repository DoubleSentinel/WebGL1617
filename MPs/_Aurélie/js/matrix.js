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
  get(row, column){//Ne marche pas
    return this.rows[row][column];
  }
  //Affichage, qui ne marche pas pour l'instant
  display(tableID){
    //clearTable(tableID);
    //console.log("display function");
    var table = document.getElementById(tableID);
    var tableRow, tableColumn;
    //console.log(this.rows.lenght);
    for(var i=0; i<this.dim; i++){
      tableRow = table.insertRow(-1);
    //  console.log("insertRow");
      for(var j=0; j<this.dim; j++){
        tableColumn=tableRow.insertCell(j);
        tableColumn.align = "center";
        tableColumn.innerHTML = this.rows[i][j];//Les indices vont trop loins
      }
    }
  }
}
