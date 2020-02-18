function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x===j && y===k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(c=> same(c,cell));
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  let rObject = {topRight: [0,0], bottomLeft: [0,0]};

  if (state.length === 0 ) return rObject;

  let xs = state.map(([x, _])=> x);
  let ys = state.map(([_, y])=> y);

  rObject.topRight[0] = Math.max(...xs);
  rObject.topRight[1] = Math.max(...ys);
  rObject.bottomLeft[0] = Math.min(...xs);
  rObject.bottomLeft[1] = Math.min(...ys);
  return rObject;
};

const printCells = (state) => {
  const {topRight, bottomLeft} = corners(state);
  
  let grid = "";
  
  for (let y = topRight[1]; y>=bottomLeft[1]; y--) {    
    let row = [];
    for (let x = bottomLeft[0]; x<=topRight[0]; x++ ) {
        row.push(printCell([x,y], state));
    }
    grid += row.join(' ') + '\n';
  }
  return grid;
};

const getNeighborsOf = ([x, y]) => {
  return [[x-1,y-1],[x, y-1], [x+1, y-1], [x-1, y], [x+1,y],[x-1,y+1],[x,y+1], [x+1,y+1]];
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell);
  let x= neighbors.filter(c=> contains.bind(state)(c));
  return x;
};

const willBeAlive = (cell, state) => {
  let livingNeighbors = getLivingNeighbors(cell,state).length;
  return (livingNeighbors === 3 || contains.call(state,cell) && livingNeighbors === 2);
};

const calculateNext = (state) => {
  let {topRight, bottomLeft} = corners(state);
  let results = [];
  for (let y=topRight[1]+1; y>=bottomLeft[1]-1; y--) 
    for (let x=bottomLeft[0]-1; x<= topRight[0]+1; x++ ) {      
      if (willBeAlive([x,y], state))
        results.push([x,y]);    
    }  
  return results;
};

const iterate = (state, iterations) => {
  let results =[state]; 

  for(let i=0; i<iterations; i++)   
    results.push(calculateNext(results[results.length-1]));

  return results;
};

const main = (pattern, iterations) => {
  let results = iterate(startPatterns[pattern], iterations);
  results.forEach(p=>console.log(printCells(p)));

};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ],
    square3: [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ],
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;