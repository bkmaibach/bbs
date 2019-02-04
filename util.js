const _ = require('lodash');

//similar to array.indexOf but works on value not reference
function getIndexOfValue(array, entry) {
    for (let i = 0; i < array.length; i++) {
        if (_.isEqual(array[i], entry)){
            return i;
        }
    }
    return -1;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}


module.exports = {
    getIndexOfValue,
    shuffle
}