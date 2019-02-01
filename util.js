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

module.exports = {
    getIndexOfValue
}