const ndarray = require('ndarray');
const createPlanner = require('l1-path-finder');
const _ = require('lodash');
const states = require('./exampleStates').states;
const {Finder} = require('./finder');
//Log output
//console.log('path length =', dist)
//console.log('steps= ', steps)
/* for (let x = 0; x < 100000; x++){
    let array = []
    array.push(getShortestPath(exampleState, {x:1 , y:1}, {x:15 , y:15}));
    //console.log(JSON.stringify());
} */

let finder = new Finder({x:7, y:5}, states[0]);
console.log(JSON.stringify(finder.getShortestPath({x: 14, y:14})));

