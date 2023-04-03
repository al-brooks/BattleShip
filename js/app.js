/*----- Setting up Game -----*/
// 1. Player chooses where to place their ships on the board
// 2. Ships have a specific set of hps
// 3. Place the ship objects into each array idx player clicks

/*----- constants -----*/
const ships = {
  carrier: {
    hp: 5
  },
  battleship: {
    hp: 4
  },
  cruiser: {
    hp: 3
  },
  submarine: {
    hp: 3
  },
  destroyer: {
    hp: 2
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
