const ndarray = require('ndarray');
const createPlanner = require('l1-path-finder');
const _ = require('lodash');
const {states} = require('./gamestates/example-states');
const {TailDodger} = require('./tail-dodger');
const {TailDodgerSafe} = require('./tail-dodger-safe');

//Log output
//console.log('path length =', dist)
//console.log('steps= ', steps)
/* for (let x = 0; x < 100000; x++){
    let array = []
    array.push(getShortestPath(exampleState, {x:1 , y:1}, {x:15 , y:15}));
    //console.log(JSON.stringify());
} */

let dodger = new TailDodger({"x":0,"y":0}, states[1]);
console.log(JSON.stringify(dodger.getShortestPath({x: 0, y:14})));


