let TargetGenerator = class {

    constructor(gameState) {

    }

    getSortedTargets (state) {
        return state.getFoodPoints();
    }
}

 
module.exports = {
    TargetGenerator
 };
  