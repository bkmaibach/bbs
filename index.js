const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js');

const state = require('./state');
const _ = require('lodash');
const {TailDodger} = require('./tail-dodger');


// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001));

app.enable('verbose errors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(poweredByHandler);

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // forward the initial request to the state analyzer upon start
  state.update(request.body);
  let hexString;
  if (state.getMyName() == 'BBS'){
    hexString == '000000';
  }else {
    let number = Math.floor(Math.random() * Math.floor(16000000));
    hexString = number.toString(16);
    if (hexString.length % 2) {
      hexString = '0' + hexString;
    }
  }
  // Response data
  const data = {
    color: '#'+hexString,
  }

  return response.json(data)
});

let targetXY;
// Handle POST request to '/move'
app.post('/move', (request, response) => {

  // console.log("IN POST /MOVE");
  // update the board with the new moves
  state.update(request.body);
  //const moves = ['up','left','down','right'];
  const foodPoints = state.getFoodPoints();
  // console.log(points)

  let path;
  let move;
  let turn = state.getTurn();

  let myPosition = state.getMyPosition();

  try{

    if (_.isEqual(myPosition, targetXY) || turn == 0 || state.pointIsTaken(targetXY)){
      targetXY = foodPoints[Math.floor(Math.random() * Math.floor(4))];
    }
    let dodger = new TailDodger(myPosition, state);
    path = dodger.getShortestPath(targetXY);
    move = state.getMove(path[0], path[1]);

    console.log("turn: " + JSON.stringify(turn));
    console.log("current xy: " + JSON.stringify(path[0]));
    console.log("move: " + JSON.stringify(move));
    console.log("next xy: " + JSON.stringify(path[1]));
    console.log("target xy: " + JSON.stringify(targetXY));
    console.log("\n");    
  
    // Response data
    return response.json({move});
    
  } catch (e) {
    //console.log(e);
    let move = state.safeMove();
    console.log("Defaulting to safe move " + move);
    return response.json({move});
  }



});

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
});

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
});

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
});
