/*----- constants -----*/

const users = {
  1: "player",
  "-1": "computer"
};

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
    color: "black", // color only needed for development
    hp: 5,
    spacesTotal: 5,
    spacesLeft: 5,
    coordinates: [],
    built: false
  },
  battleship: {
    color: "gray",

    hp: 4,
    spacesTotal: 4,
    spacesLeft: 4,
    coordinates: [],
    built: false
  },
  cruiser: {
    color: "navy",

    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: [],
    built: false
  },
  submarine: {
    color: "darkred",

    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: [],
    built: false
  },
  destroyer: {
    color: "darkgoldenrod",

    hp: 2,
    spacesTotal: 2,
    spacesLeft: 2,
    coordinates: [],
    built: false
  }
};

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
const gameMsg = document.getElementById("game-msg");
const shipListEls = document.getElementById("ship-list");
const shipListMsg = document.getElementById("shipMsg");
const playAgainBtn = document.getElementById("play-again");
const computerBoardEl = document.querySelector("#computer > .display > .board");
const playerBoardEl = document.querySelector("#player > .display > .board");

/*----- event listeners -----*/
shipListEls.addEventListener("click", handleShipSelection);
playerBoardEl.addEventListener("click", handlePlayerBoardClick);
computerBoardEl.addEventListener("click", handleComputerBoardClick);
playAgainBtn.addEventListener("click", init);

/*----- functions -----*/

function handleComputerBoardClick(evt) {
  if (!setupComplete) {
    gameMsg.innerHTML =
      "PLAYER - Finish Setting Up Your Board Before Gameplay Commences.";
    return;
  }
  // Player Turn
  playerTurn(evt);

  // Computer Responds
  computerTurn();
}

function computerTurn() {
  let [colIdx, rowIdx] = generateCoordinate();
  // if cpu picks a coordinate it already visited, reroll
  while (playerBoard[colIdx][rowIdx] === -1) {
    let [colIdx, rowIdx] = generateCoordinate();
  }
  setTimeout(markBoard(playerBoard, colIdx, rowIdx), 3000);
}

function playerTurn(evt) {
  const square = evt.target;
  const colIdx = Number(square.id.at(-3));
  const rowIdx = Number(square.id.at(-1));
  if (computerBoard[colIdx][rowIdx] === -1) return;
  markBoard(computerBoard, colIdx, rowIdx);
  turn *= 1;
}

function markBoard(board, colIdx, rowIdx) {
  const user = board === computerBoard ? "computer" : "player";
  const squareId = `${user}-c${colIdx}r${rowIdx}`;
  const square = document.getElementById(squareId);
  board === playerBoard
    ? console.log("Computer Turn!")
    : console.log("Player Turn!");
  if (board[colIdx][rowIdx] === null) {
    square.innerText = "O";
  } else {
    square.innerText = "X";
    let ship = board[colIdx][rowIdx];
    ship.hp--;
    // if ship hp is 0, then the ship is sunk!
  }
  board[colIdx][rowIdx] = -1; // square received a click, now its unplayable
  turn *= 1;
}

function handleShipSelection(evt) {
  const selectBtn = evt.target;
  const shipSection = selectBtn.parentNode;
  if (selectBtn.classList.contains("add")) {
    // user can now click on board to select grids;
    console.log("Add Ship!");
    addShip = true;
    currentShip = player[shipSection.id];
  } else if (selectBtn.classList.contains("reset")) {
    handleReset();
    console.log("Reset!!");
  } else if (selectBtn.classList.contains("complete")) {
    handleComplete(shipSection);
  }
}

function handlePlayerBoardClick(evt) {
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
  if (playerBoard[colIdx][rowIdx] === null) {
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
        playerBoard[colIdx][rowIdx] = null;
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
    // hide all buttons
    hideSelectBtns(shipSection);
    shipListMsg.innerText = "Complete! Continue to Next Ship!";
    addShip = false;
    currentShip = null;
    // check if all ships are set
    setupComplete = playerReady();
  } else {
    shipListMsg.innerText =
      "Invalid Ship Placement, Please Reset and Add Ship again";
  }
}

function hideSelectBtns(shipSection) {
  shipSection.childNodes.forEach(child => {
    if (child.tagName === "BUTTON") {
      child.style.visibility = "hidden";
    }
  });
}

function playerReady() {
  for (const ship in player) {
    if (ship.spacesLeft > 0) return false;
  }
  return true;
}

function selectionValidity(colIdx, rowIdx) {
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

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
  let count = 1; // starting at a known coordinate

  colIdx += colOffset;
  rowIdx += rowOffset;

  while (
    playerBoard[colIdx] !== undefined &&
    playerBoard[colIdx][rowIdx] !== undefined &&
    playerBoard[colIdx][rowIdx] === currentShip
  ) {
    count++;
    colIdx += colOffset;
    rowIdx += rowOffset;
  }

  return count;
}

function generateComputerBoard() {
  for (const ship in computer) {
    placeShip(ship);
  }
}

function placeShip(ship) {
  let [colIdx, rowIdx] = generateCoordinate();
  while (computerBoard[colIdx][rowIdx] !== null) {
    [colIdx, rowIdx] = generateCoordinate();
  }

  computerBoard[colIdx][rowIdx] = computer[ship];
  computer[ship].coordinates.push([colIdx, rowIdx]);
  computer[ship].spacesLeft--;

  let builds = [buildShipUp, buildShipLeft, buildShipDown, buildShipRight];
  let shuffledBuilds = shuffleBuilds(builds);

  // todo: refactored below code and reran app 20+ times and cpu render looks good - just keep an eye out
  for (const build of shuffledBuilds) {
    let success = build(ship, colIdx, rowIdx);
    if (success) {
      computer[ship].built = true;
      break;
    } else {
      placeShip(ship);
    }
  }
}

function generateCoordinate() {
  const colIdx = Math.floor(Math.random() * 10);
  const rowIdx = Math.floor(Math.random() * 10);
  return [colIdx, rowIdx];
}

function shuffleBuilds(buildArr) {
  for (let i = buildArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [buildArr[i], buildArr[j]] = [buildArr[j], buildArr[i]];
  }

  return buildArr;
}

function buildShipUp(ship, colIdx, rowIdx) {
  return buildAdjacent(ship, colIdx, rowIdx, 0, 1);
}

function buildShipDown(ship, colIdx, rowIdx) {
  return buildAdjacent(ship, colIdx, rowIdx, 0, -1);
}

function buildShipLeft(ship, colIdx, rowIdx) {
  return buildAdjacent(ship, colIdx, rowIdx, -1, 0);
}

function buildShipRight(ship, colIdx, rowIdx) {
  return buildAdjacent(ship, colIdx, rowIdx, 1, 0);
}

function buildAdjacent(ship, colIdx, rowIdx, colOffset, rowOffset) {
  colIdx += colOffset;
  rowIdx += rowOffset;
  while (
    computerBoard[colIdx] !== undefined &&
    computerBoard[colIdx][rowIdx] !== undefined &&
    computerBoard[colIdx][rowIdx] === null &&
    computer[ship].spacesLeft > 0
  ) {
    computerBoard[colIdx][rowIdx] = computer[ship];
    computer[ship].coordinates.push([colIdx, rowIdx]);
    computer[ship].spacesLeft--;
    colIdx += colOffset;
    rowIdx += rowOffset;
  }

  if (computer[ship].spacesLeft > 0) {
    resetComputerShips(ship);
    return false;
  } else {
    return true;
  }
}

function resetComputerShips(ship) {
  for (const coordinates of computer[ship].coordinates) {
    let [col, row] = coordinates;
    computerBoard[col][row] = null;
  }
  computer[ship].coordinates = [];
  computer[ship].spacesLeft = computer[ship].spacesTotal;
}

function render() {
  // render computer and player boards
  renderBoard(computerBoard);
  renderBoard(playerBoard);
}

function renderBoard(board) {
  if (board === computerBoard) {
    colorBoard(computer, "computer", computerBoard);
  } else {
    colorBoard(player, "player", playerBoard);
  }
}

function colorBoard(userObj, user, board) {
  board.forEach((colArr, colIdx) => {
    colArr.forEach((rowVal, rowIdx) => {
      const boardVal = board[colIdx][rowIdx];
      const cellId = `${user}-c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      if (boardVal === null) {
        cellEl.style.backgroundColor = "white";
      } else {
        // todo: showing computer colors for development - this should just be for player moving into production
        cellEl.style.backgroundColor = boardVal.color;
      }
    });
  });
}

function init() {
  turn = 1;
  winner = null; // (1 or -1) no ties
  computerBoard = Array.from(new Array(10), () => new Array(10).fill(null)); // null, -1 (square already played) or Computer Ship (not hit)
  playerBoard = Array.from(new Array(10), () => new Array(10).fill(null)); // null or Player Ships

  // set game message
  gameMsg.innerHTML = `Welcome PLAYER - Please Set Up Your Board Below`;

  // reset Computer Ships
  for (const ship in computer) {
    resetComputerShips(ship);
  }
  // set Computer ships
  generateComputerBoard();

  // set playerLegendColors
  document.querySelectorAll(".colors").forEach(color => {
    let ship = color.parentNode.id;
    color.style.backgroundColor = player[ship].color;
  });

  addShip = false;
  currentShip = null;
  setupComplete = false;

  shipListEls.childNodes.forEach(child => {
    if (child.tagName === "BUTTON") {
      child.style.visibility = "visible";
    }
  });

  render();
}

/*----- initialize game -----*/
init();
