/*----- Setting up Game -----*/
// Player:
// 1. Player chooses where to place their ships on the board
// 2. Ships have a specific set of hps
// 3. Place the ship objects into each array idx player clicks
// 4. Ships are either vertical or horizontal

// Computer:
// 1. Computer's ships are randomly selected.
// 2. They need to be within the board bounds, and no conflicting with other ships
// 3. If you pick a point, you can check to see availability to the left, right
// top and bottom, going for the amount of available spaces.
// 4. The first available combination is chosen.

/*----- constants -----*/

const playerShips = {
  carrier: {
    hp: 5,
    spaces: 5,
    coordinates: []
  },
  battleship: {
    hp: 4,
    spaces: 4,
    coordinates: []
  },
  cruiser: {
    hp: 3,
    spaces: 3,
    coordinates: []
  },
  submarine: {
    hp: 3,
    spaces: 3,
    coordinates: []
  },
  destroyer: {
    hp: 2,
    spaces: 2,
    coordinates: []
  }
};

const computerShips = {
  carrier: {
    hp: 5,
    spaces: 5,
    coordinates: []
  },
  battleship: {
    hp: 4,
    spaces: 4,
    coordinates: []
  },
  cruiser: {
    hp: 3,
    spaces: 3,
    coordinates: []
  },
  submarine: {
    hp: 3,
    spaces: 3,
    coordinates: []
  },
  destroyer: {
    hp: 2,
    spaces: 2,
    coordinates: []
  }
};

/*----- state variables -----*/
let turn;
let winner;

// (10 X 10) 2d array
// values are 0 (empty), 1 (a ship is there), -1 (no ship is there)
let playerBoard;
let computerBoard;

/*----- cached elements  -----*/
const playAgainBtn = document.getElementById("playAgain");
const computerBoardEls = document.querySelectorAll(
  "#computer > .display > .board > div"
);
const playerBoardEls = document.querySelectorAll(
  "#player > .display > .board > div"
);

/*----- event listeners -----*/

/*----- functions -----*/

function init() {
  turn = 1;
  winner = null; // (1 or -1) no ties
  computerBoard = Array.from(new Array(10), () => new Array(10).fill(0));
  playerBoard = Array.from(new Array(10), () => new Array(10).fill(0));
}

/*----- initialize game -----*/
init();
