/*----- Setting up Game -----*/
/*
Player:
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


Computer:
    1. Computer's ships are randomly selected.
    2. They need to be within the board bounds, and no conflicting with other ships
    3. If you pick a point, you can check to see availability to the left, right
       top and bottom, going for the amount of available spaces.
    4. The first available combination is chosen.
*/

/*----- constants -----*/

const player = {
  carrier: {
    color: "black",
    hp: 5,
    spaces: 5,
    coordinates: []
  },
  battleship: {
    color: "gray",
    hp: 4,
    spaces: 4,
    coordinates: []
  },
  cruiser: {
    color: "navy",
    hp: 3,
    spaces: 3,
    coordinates: []
  },
  submarine: {
    color: "darkred",
    hp: 3,
    spaces: 3,
    coordinates: []
  },
  destroyer: {
    color: "darkgoldenrod",
    hp: 2,
    spaces: 2,
    coordinates: []
  }
};

const computer = {
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

/*
Player:
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
*/

/*----- state variables -----*/
// boolean toggles for Player Ship Placement
let addShip;
let resetShip;
let completedShip;
let setupComplete;

let currentShip;

let turn;
let winner;

// (10 X 10) 2d array
// values are 0 (empty), 1 (a ship is there), -1 (no ship is there)
let playerBoard;
let computerBoard;

/*----- cached elements  -----*/
const shipListEls = document.getElementById("ship-list");
const playAgainBtn = document.getElementById("play-again");
const computerBoardEls = document.querySelectorAll(
  "#computer > .display > .board > div"
);
const playerBoardEls = document.querySelectorAll(
  "#player > .display > .board > div"
);

const playerBoardEl = document.querySelector("#player > .display > .board");

/*----- event listeners -----*/
shipListEls.addEventListener("click", handleShipSelection);
playerBoardEl.addEventListener("click", handleBoardClick);

/*----- functions -----*/

function handleShipSelection(evt) {
  const selectBtn = evt.target;
  if (selectBtn.classList.contains("add")) {
    console.log("Add Ship!");
    addShip = true;
    currentShip = player[selectBtn.parentNode.id];
    // user clicks on board to select grids;
  } else if (selectBtn.classList.contains("reset")) {
    console.log("Reset!!");
  } else if (selectBtn.classList.contains("complete")) {
    console.log("Complete!!!");
  }
}

function handleBoardClick(evt) {
  const square = evt.target;
  const colIdx = square.id.at(-3);
  const rowIdx = square.id.at(-1);
  if (addShip) {
    handleAdd(square, colIdx, rowIdx);
  }
}

function handleAdd(square, colIdx, rowIdx) {
  if (currentShip.spaces === 0) return;
  if (playerBoard[colIdx][rowIdx] === 0) {
    console.log(currentShip);
    playerBoard[colIdx][rowIdx] = currentShip;
    console.log(playerBoard[colIdx][rowIdx]);
    currentShip.spaces--;
    render();
  }
}

function init() {
  turn = 1;
  winner = null; // (1 or -1) no ties
  computerBoard = Array.from(new Array(10), () => new Array(10).fill(0)); // 0 or Computer Ships
  playerBoard = Array.from(new Array(10), () => new Array(10).fill(0)); // 0 or Player Ships

  addShip = false;
  resetShip = false;
  completedShip = false;
  setupComplete = false;
}

function render() {
  // render computer and player boards
  renderBoard(computerBoard);
  renderBoard(playerBoard);
}

function renderBoard(board) {
  let user = board === computerBoard ? "computer" : "player";
  board.forEach((colArr, colIdx) => {
    colArr.forEach((rowVal, rowIdx) => {
      const boardVal = board[colIdx][rowIdx];
      const cellId = `${user}-c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      if (boardVal === 0) {
        cellEl.style.backgroundColor = "white";
      } else {
        cellEl.style.backgroundColor = boardVal.color;
      }
    });
  });
}

/*----- initialize game -----*/
init();
