/*----- constants -----*/

const player = {
  carrier: {
    name: "carrier",
    color: "#006d77",
    hp: 5,
    spacesTotal: 5,
    spacesLeft: 5,
    coordinates: []
  },
  battleship: {
    name: "battleship",
    color: "#6d597a",
    hp: 4,
    spacesTotal: 4,
    spacesLeft: 4,
    coordinates: []
  },
  cruiser: {
    name: "cruiser",
    color: "#b56576",
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: []
  },
  submarine: {
    name: "submarine",
    color: "#6d6875",
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: []
  },
  destroyer: {
    name: "destroyer",
    color: "#9E2A2B",
    hp: 2,
    spacesTotal: 2,
    spacesLeft: 2,
    coordinates: []
  }
};

const computer = {
  carrier: {
    name: "carrier",
    color: "#006d77",
    hp: 5,
    spacesTotal: 5,
    spacesLeft: 5,
    coordinates: [],
    built: false
  },
  battleship: {
    name: "battleship",
    color: "#6d597a",
    hp: 4,
    spacesTotal: 4,
    spacesLeft: 4,
    coordinates: [],
    built: false
  },
  cruiser: {
    name: "cruiser",
    color: "#b56576",
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: [],
    built: false
  },
  submarine: {
    name: "submarine",
    color: "#6d6875",
    hp: 3,
    spacesTotal: 3,
    spacesLeft: 3,
    coordinates: [],
    built: false
  },
  destroyer: {
    color: "#9E2A2B",

    hp: 2,
    spacesTotal: 2,
    spacesLeft: 2,
    coordinates: [],
    built: false
  }
};

let addShip;
let setupComplete;
let showComputerShips;
let currentShip;

let totalPlayerShips;
let totalComputerShips;

let winner;

let playerBoard;
let computerBoard;

const computerShipTotalMsg = document.querySelector("#computer > .ship-total");
const playerShipTotalMsg = document.querySelector("#player > .ship-total");
const gameMsg = document.getElementById("game-msg");
const shipListEls = document.getElementById("ship-list");
const selectShipDisplayMsg = document.getElementById("select-msg");
const selectShipBtns = document.querySelectorAll(
  "#ship-list > section > button"
);

const computerBoardEl = document.querySelector("#computer > .display > .board");
const playerBoardEl = document.querySelector("#player > .display > .board");
const playAgainBtn = document.getElementById("play-again");
const toggleComputerShipsBtn = document.getElementById("computer-reveal");

shipListEls.addEventListener("click", handleShipSelection);
playerBoardEl.addEventListener("click", handleSelectionClick);
computerBoardEl.addEventListener("click", handleComputerBoardClick);
playAgainBtn.addEventListener("click", init);
toggleComputerShipsBtn.addEventListener("click", handleComputerShipsReveal);

function handleComputerShipsReveal() {
  showComputerShips = !showComputerShips;
  renderBoard(computerBoard);
}

function handleComputerBoardClick(evt) {
  if (!setupComplete) {
    gameMsg.innerHTML = `<span class="msg-style">PLAYER</span> - Finish Setting Up Your Board Before Gameplay Commences.`;
    return;
  }
  if (winner) return;
  playerTurn(evt);
  computerTurn();
}

function playerTurn(evt) {
  const square = evt.target;
  const colIdx = Number(square.id.at(-3));
  const rowIdx = Number(square.id.at(-1));
  if (computerBoard[colIdx][rowIdx] === -1) return;
  totalComputerShips = markBoard(
    computerBoard,
    square,
    totalComputerShips,
    colIdx,
    rowIdx
  );
  determineWinner("player", computer);
  render();
}

function computerTurn() {
  let [colIdx, rowIdx] = generateCoordinate();
  while (playerBoard[colIdx][rowIdx] === -1) {
    [colIdx, rowIdx] = generateCoordinate();
  }
  const squareId = `player-c${colIdx}r${rowIdx}`;
  const square = document.getElementById(squareId);
  totalPlayerShips = markBoard(
    playerBoard,
    square,
    totalPlayerShips,
    colIdx,
    rowIdx
  );
  determineWinner("computer", player);
  render();
}

// todo: add styled marks
function markBoard(board, square, userShipTotal, colIdx, rowIdx) {
  //   if (board[colIdx][rowIdx] === -1) return;
  if (board[colIdx][rowIdx] === null) {
    square.innerText = "O";
    square.classList.add("missedMark");
  } else {
    square.innerText = "X";
    square.classList.add("hitMark");
    let ship = board[colIdx][rowIdx];
    ship.hp--;

    if (ship.hp === 0) {
      userShipTotal--;
    }
  }
  board[colIdx][rowIdx] = -1;
  return userShipTotal;
}

function determineWinner(user, opponentObj) {
  for (const ship in opponentObj) {
    if (opponentObj[ship].hp > 0) return;
  }
  winner = user;
  gameMsg.innerHTML = `<span class="msg-style">${winner.toUpperCase()}</span> has won the game!<br><br>Ready for More? Click <span class="msg-style">Play Again</span> Below!`;
  playAgainBtn.style.display = "block";
}

function handleShipSelection(evt) {
  const selectBtn = evt.target;
  const shipSection = selectBtn.parentNode;
  if (selectBtn.tagName === "BUTTON")
    selectShipDisplayMsg.style.display = "block";

  if (selectBtn.classList.contains("add")) {
    addShip = true;
    currentShip = player[shipSection.id];
    selectShipDisplayMsg.innerHTML =
      "Click Squares Below to Build Your Ship!<br><br>Be Sure to Click On Squares That Are Next To One Another!";
  } else if (selectBtn.classList.contains("reset")) {
    handleReset();
  } else if (selectBtn.classList.contains("complete")) {
    handleComplete(shipSection);
  }
}

function handleSelectionClick(evt) {
  if (addShip) {
    const square = evt.target;
    const colIdx = Number(square.id.at(-3));
    const rowIdx = Number(square.id.at(-1));
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
      selectShipDisplayMsg.innerHTML =
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
  selectShipDisplayMsg.innerHTML = `Reset Complete! Click "Add Ship" to add your ship!`;
  render();
}

function handleComplete(shipSection) {
  const [colIdx, rowIdx] = currentShip.coordinates.at(-1);
  const valid = selectionValidity(colIdx, rowIdx);
  if (valid) {
    // hide all buttons
    hideSelectBtns(shipSection);
    selectShipDisplayMsg.innerHTML = "Complete! Continue to Next Ship!";
    addShip = false;
    currentShip = null;
    totalPlayerShips++;
    render();
    setupComplete = playerReady();
  } else {
    // todo: add class for styling message words
    selectShipDisplayMsg.innerHTML = `Invalid Ship Placement, Please Click <strong>Reset</strong> then <strong>Add Ship</strong> to start over!`;
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
  gameMsg.innerHTML = `Set Up is Complete!<br><br><span class="msg-style">PLAYER</span> Start By Selecting Your Opponents Board!`;
  selectShipDisplayMsg.innerHTML = "";
  selectShipDisplayMsg.style.display = "none";
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

function init() {
  winner = null;
  computerBoard = Array.from(new Array(10), () => new Array(10).fill(null));
  playerBoard = Array.from(new Array(10), () => new Array(10).fill(null));
  addShip = false;
  currentShip = null;
  setupComplete = false;
  showComputerShips = false;
  totalPlayerShips = 0;
  totalComputerShips = 5;

  gameMsg.innerHTML = `Welcome <span class="msg-style">PLAYER</span> - Please Set Up Your Board Below<br><br>Click <span class="msg-style">Add</span> to get started!`;
  selectShipDisplayMsg.style.display = "none";

  for (const ship in computer) {
    resetShips(computerBoard, computer, ship);
  }

  for (const ship in player) {
    resetShips(playerBoard, player, ship);
  }

  generateComputerShips();

  resetMarks(computerBoard, "computer");
  resetMarks(playerBoard, "player");

  // set playerLegendColors
  document.querySelectorAll(".colors").forEach(color => {
    let ship = color.parentNode.id;
    color.style.backgroundColor = player[ship].color;
    color.style.border = "0.1vmin solid #f1faee";
  });

  selectShipBtns.forEach(btn => {
    btn.style.visibility = "visible";
  });

  playAgainBtn.style.display = "none";

  render();
}

function resetMarks(board, user) {
  board.forEach((colArr, colIdx) => {
    colArr.forEach((rowVal, rowIdx) => {
      const cellId = `${user}-c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.innerText = "";
      let classes = ["hitMark", "missedMark"];
      for (const cls of classes) {
        if (cellEl.classList.contains(cls)) {
          cellEl.classList.remove(cls);
        }
      }
    });
  });
}

function resetShips(board, userObj, ship) {
  for (const coordinates of userObj[ship].coordinates) {
    let [col, row] = coordinates;

    board[col][row] = null;
  }
  userObj[ship].coordinates = [];
  userObj[ship].spacesLeft = userObj[ship].spacesTotal;
}

function generateComputerShips() {
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
    resetShips(computerBoard, computer, ship);
    return false;
  } else {
    return true;
  }
}

function render() {
  renderBoard(computerBoard);
  renderBoard(playerBoard);
  renderShipTotals();
}

function renderBoard(board) {
  if (board === computerBoard) {
    if (showComputerShips) {
      colorBoard("computer", computerBoard);
    } else {
      hideBoard("computer", computerBoard);
    }
  } else {
    colorBoard("player", playerBoard);
  }
}

function colorBoard(user, board) {
  board.forEach((colArr, colIdx) => {
    colArr.forEach((rowVal, rowIdx) => {
      const boardVal = board[colIdx][rowIdx];
      const cellId = `${user}-c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      if (boardVal === null) {
        cellEl.style.backgroundColor = "#a9d6e5";
        cellEl.style.borderStyle = "solid";
      } else {
        cellEl.style.backgroundColor = boardVal.color;
        cellEl.style.borderStyle = "none";
      }
    });
  });
}

function hideBoard(user, board) {
  board.forEach((colArr, colIdx) => {
    colArr.forEach((rowVal, rowIdx) => {
      const cellId = `${user}-c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.style.backgroundColor = "#a9d6e5";
      cellEl.style.borderStyle = "solid";
    });
  });
}

function renderShipTotals() {
  computerShipTotalMsg.innerHTML = `Ships Ready for Battle: <span class="msg-style">${totalComputerShips}</span>`;
  playerShipTotalMsg.innerHTML = `Ships Ready for Battle: <span class="msg-style">${totalPlayerShips}</span>`;
}

init();
