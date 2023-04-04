/*----- Setting up Game -----*/
/*
// Player:
    1. Player chooses where to place their ships on the board
        a. Player clicks on an 'add' btn that's next to the ship they want to add
            i. JS knows that the player is adding a ship (toggle)
        b. Player is prompted to click on grid squares they want their ship on
            1. Program checks that the space is unoccupied.
            2. Click updates the coordinates of ship
            3. Decreases the number of available spaces on ship
            4. playerBoard array idx [i][j] is updated from 0 to ship object
        c. Once ship available spaces reaches 0
            1. Player cannot click on any other squares.
            2. Player is prompted to click complete or reset (if they don't like arrangement)
        d. Once Player submits choice
            1. Program verifies that the coordinates for the ship are in sequential order.
            2. Are they in a straight line vertically or horizontally.
            3. If placement is invalid, Player must redo selection.
            4. playerBoard at ship's coordinates are reset to 0
    2. Ships have a specific set of hp which is decremented whenever hit.


// Computer:
// 1. Computer's ships are randomly selected.
// 2. They need to be within the board bounds, and no conflicting with other ships
// 3. If you pick a point, you can check to see availability to the left, right
// top and bottom, going for the amount of available spaces.
// 4. The first available combination is chosen.

*/

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
  computerBoard = Array.from(new Array(10), () => new Array(10).fill(0)); // 0 or Computer Ships
  playerBoard = Array.from(new Array(10), () => new Array(10).fill(0)); // 0 or Player Ships
}

/*----- initialize game -----*/
init();
