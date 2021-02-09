var cols=15;
var rows=15;
var grid=new Array(cols);
var openset=[];
var closeset=[];
var path=[];
var start;
var end;
var w,h;
function matrixIndexed(details, name) {
   var r;
   var c;
   for (r = 0; r < details.length; r++) {
      const nsDetails = details[r];
      for (c = 0; c < nsDetails.length; c++) {
         const tempObject = nsDetails[c];
         if (tempObject=== name) {
            return { r, c};
         }
      }
   }
   return {};
}
function heuristic(a,b){
  var d=dist(a.i,a.j,b.i,b.j);
  return d;
}
function removeelement(arr,element){
  for(var i=arr.length-1;i>=0;i--){
    if(arr[i]==element){
      arr.splice(i,1);

    }
  }
}
function Cell(i,j){
  this.i=i;
  this.j=j;
  this.f=0;
  this.g=0;
  this.h=0;
  this.parent=undefined;
  this.neighbour=[]
  this.wall=false;
if(random(1)<0.3){
    this.wall=true;
}
  this.show=function(col){
    fill(col);
    if(this.wall){
      fill(0);
    }
    stroke(0);
    rect(this.i*w,this.j*h,w-1,h-1);
  }
  this.addneighbour=function(grid){
     i=this.i;
     j=this.j;
    if(i<cols-1){
      this.neighbour.push(grid[i+1][j]);
    }
    if(i>0){
      this.neighbour.push(grid[i-1][j]);
    }
    if(j<rows-1){
      this.neighbour.push(grid[i][j+1]);
    }
    if(j>0){
      this.neighbour.push(grid[i][j-1]);
    }
    if(i>0 && j>0 && (!grid[i-1][j].wall || !grid[i][j-1].wall)){
      this.neighbour.push(grid[i-1][j-1])
    }
    if(i<cols-1 && j>0 && (!grid[i][j-1].wall || !grid[i+1][j].wall)){
      this.neighbour.push(grid[i+1][j-1])
    }
    if(i>0 && j<rows-1 && (!grid[i-1][j].wall || !grid[i][j+1].wall)){
        this.neighbour.push(grid[i-1][j+1])
    }
    if(i<cols-1 && j<rows-1 && (!grid[i+1][j].wall || !grid[i][j+1].wall)){
        this.neighbour.push(grid[i+1][j+1])
    }
  }
}

function setup(){
createCanvas(400,400);
w=400/cols;
h=400/rows;
for(var i=0;i<cols;i++){
    grid[i]=new Array(rows);
}
for(var i=0;i<cols;i++){
for(var j=0;j<rows;j++){
    grid[i][j]=new Cell(i,j);
    }
  }
for(var i=0;i<cols;i++){
for(var j=0;j<rows;j++){
  grid[i][j].addneighbour(grid);
  }
  }
for(var i=0;i<cols;i++){
    for(var j=0;j<rows;j++){
      grid[i][j].show(color(255));
      }
    }
start=grid[0][0];
end=grid[cols-1][rows-1];
start.wall=false;
end.wall=false;
openset.push(start);
}
function draw(){
  if(openset.length>0){
    lowindex=0;
    for(var i=0;i<openset.length;i++){
      if(openset[i].f<lowindex.f){
        lowindex=openset[i]
      }
    }
    var current=openset[lowindex]
    removeelement(openset,current);
    var neighbors=current.neighbour;
    for(var i=0;i<neighbors.length;i++){
      if(neighbors[i].g===0 && !neighbors[i].wall){
      neighbor=neighbors[i]
      neighbor.parent=current;
      if(!closeset.includes(neighbor)){
          tempg=current.g+1;
      }
      if(openset.includes(neighbor)){
        if(tempg<neighbor.g){
          neighbor.g=tempg;
        }
      }else{
        neighbor.g=tempg;
        openset.push(neighbor);
        }
        if(neighbor===end){
          temp=neighbor;
          path.push(temp);
          temp=temp.parent
          while(temp!=start){
            path.push(temp);
            temp=temp.parent;
          }
          path.push(temp);
          noLoop();
        }
        neighbor.g=current.g+1
        neighbor.h=heuristic(neighbor,end);
        neighbor.f=neighbor.g+neighbor.h;

}
}

    closeset.push(current);

  }else{

  }
  background(0);
  for(var i=0;i<cols;i++){
   for(var j=0;j<rows;j++){
      grid[i][j].show(color(255));

      }
  }
    for(var i=0;i<openset.length;i++){
      openset[i].show(color(255,0,0));
    }
    for(var i=0;i<closeset.length;i++){
      closeset[i].show(color(0,255,0));
    }
    for(var i=0;i<path.length;i++){
      path[i].show(color(0,0,255));
    }
    noFill();
    stroke(255);
    beginShape();
    for(var i=0;i<path.length;i++){
      vertex(path[i].i*w+w/2,path[i].j*h+h/2);
    }
    endShape();
    if(path.length!=0){
     document.querySelector("h2").innerHTML="Path traced";
   }
   if(path.length===0 && openset.length===0){
     document.querySelector("h2").innerHTML="Path not traced due to blockage";
     noLoop();
   }
console.log("done");

  }
