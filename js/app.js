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
    spacesTotal: 5,
    spacesLeft: 5,
    coordinates: []
  },
  battleship: {
    color: "gray",
    hp: 4,
    spacesTotal: 4,
    spacesLeft: 4,
    coordinates: []
  },
  cruiser: {
    color: "navy",
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: []
  },
  submarine: {
    color: "darkred",
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: []
  },
  destroyer: {
    color: "darkgoldenrod",
    hp: 2,
    spacesTotal: 2,
    spacesLeft: 2,
    coordinates: []
  }
};

const computer = {
  carrier: {
    hp: 5,
    spacesTotal: 5,
    spacesLeft: 5,
    coordinates: []
  },
  battleship: {
    hp: 4,
    spacesTotal: 4,
    spacesLeft: 4,
    coordinates: []
  },
  cruiser: {
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: []
  },
  submarine: {
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: []
  },
  destroyer: {
    hp: 2,
    spacesTotal: 2,
    spacesLeft: 2,
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
const shipListMsg = document.getElementById("shipMsg");
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
  const shipSection = selectBtn.parentNode;
  if (selectBtn.classList.contains("add")) {
    console.log("Add Ship!");
    addShip = true;
    currentShip = player[shipSection.id];
    // user clicks on board to select grids;
  } else if (selectBtn.classList.contains("reset")) {
    handleReset();
    console.log("Reset!!");
  } else if (selectBtn.classList.contains("complete")) {
    handleComplete(shipSection);
  }
}

function handleBoardClick(evt) {
  const square = evt.target;
  const colIdx = Number(square.id.at(-3));
  const rowIdx = Number(square.id.at(-1));
  if (addShip) {
    console.log(addShip);
    handleAdd(square, colIdx, rowIdx);
  } else {
    return;
  }
}

function handleAdd(square, colIdx, rowIdx) {
  if (currentShip.spacesLeft === 0) return;
  if (playerBoard[colIdx][rowIdx] === 0) {
    playerBoard[colIdx][rowIdx] = currentShip;
    currentShip.coordinates.push([colIdx, rowIdx]);
    currentShip.spacesLeft--;
    if (currentShip.spacesLeft === 0) {
      // updated display message
      shipListMsg.innerText =
        "You have used up all available spaces. Please select complete to confirm!";
    }
    render();
  }
}

function handleReset() {
  playerBoard.forEach((colArr, colIdx) => {
    colArr.forEach((rowVal, rowIdx) => {
      if (playerBoard[colIdx][rowIdx] === currentShip) {
        playerBoard[colIdx][rowIdx] = 0;
      }
    });
  });
  addShip = false;
  currentShip.spacesLeft = currentShip.spacesTotal;
  currentShip.coordinates = [];
  render();
}

function handleComplete(shipSection) {
  const [colIdx, rowIdx] = currentShip.coordinates.at(-1); // starting at final coordinate
  const valid = selectionValidity(colIdx, rowIdx);
  if (valid) {
    shipSection.childNodes.forEach(child => {
      if (child.tagName === "BUTTON") {
        child.style.visibility = "hidden";
      }
    });
    shipListMsg.innerText = "Complete! Continue to Next Ship!";
    addShip = false;
    currentShip = null;
  } else {
    shipListMsg.innerText =
      "Invalid Ship Placement, Please Reset and Add Ship again";
  }
}

function selectionValidity(colIdx, rowIdx) {
  // confirm if current ship selection is valid - the indexes passed in are for the final block
  // four directions - up, down, left, right
  console.log(checkVertical(colIdx, rowIdx));
  console.log(checkHorizontal(colIdx, rowIdx));
  return (
    checkVertical(colIdx, rowIdx) === currentShip.spacesTotal ||
    checkHorizontal(colIdx, rowIdx) === currentShip.spacesTotal
  );
}

function checkVertical(colIdx, rowIdx) {
  const countAdjacentUp = countAdjacent(colIdx, rowIdx, 0, 1);
  const countAdjacentDown = countAdjacent(colIdx, rowIdx, 0, -1);
  return countAdjacentUp === currentShip.spacesTotal
    ? countAdjacentUp
    : countAdjacentDown;
}

function checkHorizontal(colIdx, rowIdx) {
  const countAdjacentLeft = countAdjacent(colIdx, rowIdx, 1, 0);
  const countAdjacentRight = countAdjacent(colIdx, rowIdx, -1, 0);
  return countAdjacentLeft === currentShip.spacesTotal
    ? countAdjacentLeft
    : countAdjacentRight;
}

// All the row nums are the same or all the col nums are. You can use that to check validity
function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
  let count = 1; // starting at a known coordinate
  console.log(`Col: ${colIdx} Row: ${rowIdx}`);

  // initialize coordinates
  colIdx += colOffset;
  rowIdx += rowOffset;

  // increment count
  while (
    playerBoard[colIdx] !== undefined &&
    playerBoard[colIdx][rowIdx] !== undefined &&
    playerBoard[colIdx][rowIdx] === currentShip
  ) {
    count++;
    colIdx += colOffset;
    console.log(`Col: ${colIdx} Row: ${rowIdx}`);
    rowIdx += rowOffset;
  }
  console.log(`Ship Coordinates: ${currentShip.coordinates}`);

  return count;
}

function init() {
  turn = 1;
  winner = null; // (1 or -1) no ties
  computerBoard = Array.from(new Array(10), () => new Array(10).fill(0)); // 0 or Computer Ships
  playerBoard = Array.from(new Array(10), () => new Array(10).fill(0)); // 0 or Player Ships

  addShip = false;
  currentShip = null;
  setupComplete = false;

  shipListEls.childNodes.forEach(child => {
    if (child.tagName === "BUTTON") {
      child.style.visibility = "visible";
    }
  });
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
