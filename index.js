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

  let number = Math.floor(Math.random() * Math.floor(16000000));
  hexString = number.toString(16);
  if (hexString.length % 2) {
    hexString = '0' + hexString;
  }
  // Response data
  const data = {
    color: '#'+hexString,
  }

  return response.json(data)
});

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  //console.log("IN POST /MOVE");
  // update the board with the new moves
  state.update(request.body);
  const moves = ['up','left','down','right'];
  
  const name = request.body.you.name;
  let move;
  var moveType;
  var moveInfo;
  let turn = state.getTurn();
  let myPosition = state.getMyPosition();
  let randomInt;
  let timeout = 0;
  while(moveType != 'uncontested' && timeout < 30){
    randomInt = Math.floor(Math.random() * Math.floor(4))
    move = moves[randomInt];
    moveInfo = state.moveInfo(name, move);
    moveType = moveInfo.type;
    newXY = moveInfo.newXY;
    timeout++;
    if (timeout >= 30){
      move = moves[0];
    }
  }
  //console.log(turn, name, myPosition, randomInt, move, newXY, moveType);

  // Response data
  const data = {
    move // one of: ['up','left','down','right']
  }

  return response.json(data)
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
