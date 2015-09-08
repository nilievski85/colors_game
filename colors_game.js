///////////////////////////////////////////////////////////////////////////////////////////////
// Name: Colors Game
// Version: 1.00
// Author: Nikola Ilievski (n_ilievski@abv.bg)
//
// Usage: 
// CG = new ColorsGame(options);
//
// default options: {
//   width:  5,
//   height: 5,
//   colors_count: 5,
//   cont:   $('#game_cont'),
//   tail_tmp: '<div class="cc c_$color" id="$id"></div>',
//   autobuild: 0
// }
///////////////////////////////////////////////////////////////////////////////////////////////


ColorsGame = function(opts){
  var self = this;
  this.options = {
    width:  5,
    height: 5,
    colors_count: 5,
    cont:   $('#game_cont'),
    tail_tmp: '<div class="cc c_$color" id="$id"></div>',
    autobuild: 0
  }
  
  this.matrix = [];
  
  if(!opts) opts = {};
  $.extend(this.options, opts);
  
  this.build = function(opts){
    if(!opts) opts = {};
    $.extend(self.options, opts);
    
    self.moves = 0
    self.started = false;
    self.completed = false;
    self.current_color = ['c_-1', -1];
    
    var o = self.options;
    
    o.cont.empty();
    self.moves_cont = $('<b>0</b>').appendTo($('<div class="info">Turns: </div>').appendTo(o.cont));
    self.tails = $('<div class="tails"></div>').appendTo(o.cont);
    self.controls = $('<div class="controls"></div>').appendTo(o.cont);
    
    for(var i=0;i<o.height;i++){
      self.matrix[i] = [];
      var cc = $('<div class="row"></div>').appendTo(self.tails);
      for(var j=0;j<o.width;j++){
        var rand = Math.floor(Math.random()*10);
        if(rand>o.colors_count-1) rand = rand%(o.colors_count-1)
        if(i==0 && j==0) rand = -1;
        
        cc.append(o.tail_tmp.replace('$color', rand).replace('$id', 'c_'+i+'_'+j));
        self.matrix[i].push(rand);
      }
    }
    
    for(var i=0;i<o.colors_count;i++){
      self.controls.append(o.tail_tmp.replace('$color', i));
    }
  }
  
  this.process_neighbours = function(row, col){
    var tc = self.target_color;
    var cc = self.current_color;
    
    if(self.matrix[row]===undefined || self.matrix[row][col]===undefined || self.matrix[row][col]!=cc[1]) return
    
    self.matrix[row][col] = tc[1];
    self.tails.find('#c_'+row+'_'+col).addClass(tc[0]).removeClass(cc[0]);
    
    self.process_neighbours(row, col-1);
    self.process_neighbours(row, col+1);
    self.process_neighbours(row-1, col);
    self.process_neighbours(row+1, col);
  }
  
  this.complete_check = function(){
    for(var i=0;i<self.matrix.length;i++){
      row = self.matrix[i]
      for(var j=0;j<row.length;j++){
        if(row[j] != self.current_color[1]) return
      }
    }
    self.completed = true;
  }
  
  // Events
  this.options.cont.on('click', '.controls .cc', function(){
    if(self.completed) return;
    self.target_color = $(this).attr('class').match('c_([0-9])*');
    
    self.process_neighbours(0, 0);
    
    $(this).remove();
    if(self.started){
      self.controls.append(self.options.tail_tmp.replace('$color', self.current_color[1]));
    }else{
      self.started = 1;
    }
    self.current_color = self.target_color;
    self.moves++;
    self.moves_cont.html(self.moves);
    
    self.complete_check();
  });
  
  if(this.options.autobuild){
    this.build();
  }

}
