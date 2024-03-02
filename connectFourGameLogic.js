function GameBoard() {
  //inverting columns and rows to speed up next open space checks
  const rows = 6;
  const columns = 7;
  let boardState = [];
  for (let i = 0; i < rows; i++) {
    boardState[i] = [];
    for (let j = 0; j < columns; j++) {
      boardState[i][j] = 0;
    }
  }

  const dropPiece = (column, player) => {
    let row;
    let winningMove;
    for (let i = rows - 1; i >= 0; i--) {
      if (boardState[i][column] === 0) {
        boardState[i][column] = player;
        row = i;
        winningMove = checkForWinner(i, column, player);
        break;
      }
    }
    return { row, winningMove };
  };

  const checkForWinner = (row, column, playerId) => {
    let winningMove = [];
    let currentSequence = [{ row, column }];
    // Check vertical downwards
    for (let i = row - 1; i >= 0; i--) {
      if (boardState[i][column] === playerId)
        currentSequence.push({ i, column });
      else break;
    }

    // If 4 or more, add winning move
    if (currentSequence.length >= 4) winningMove.push([...currentSequence]);
    // Reset current sequence to last move
    currentSequence.length = 1;

    // Check horizontal left
    for (let i = column - 1; i >= 0; i--) {
      if (boardState[row][i] === playerId) currentSequence.push({ row, i });
      else break;
    }

    // We don't need to check or reset current sequence between left and right checks since they're continuous
    // Check horizontal right
    for (let i = column + 1; i < columns; i++) {
      if (boardState[row][i] === playerId) {
        currentSequence.push({ row, column: i });
      } else break;
    }

    if (currentSequence.length >= 4) winningMove.push([...currentSequence]);
    currentSequence.length = 1;

    //Check down right and up right
    for (let i = row + 1, j = column - 1; i < rows && j >= 0; i++, j--) {
      if (boardState[i][j] === playerId) currentSequence.push({ i, j });
      else break;
    }
    for (let i = row - 1, j = column + 1; i >= 0 && j < columns; i--, j++) {
      if (boardState[i][j] === playerId) currentSequence.push({ i, j });
      else break;
    }

    if (currentSequence.length >= 4) winningMove.push([...currentSequence]);
    currentSequence.length = 1;

    //check up left and down left
    for (let i = row - 1, j = column - 1; i >= 0 && j >= 0; i--, j--) {
      if (boardState[i][j] === playerId) currentSequence.push({ i, j });
      else break;
    }
    for (let i = row + 1, j = column + 1; i < rows && j < columns; i++, j++) {
      if (boardState[i][j] === playerId) currentSequence.push({ i, j });
      else break;
    }

    if (currentSequence.length >= 4) winningMove.push([...currentSequence]);
    return winningMove;
  };

  const getState = () => console.log(boardState);

  return { dropPiece, getState, getBoard: () => boardState };
}

function Game(board) {
  const gameBoard = board;
  const player1 = { id: 1 };
  const player2 = { id: 2 };
  let activePlayer = Math.round(Math.random()) ? player1 : player2;

  const getActivePlayer = () => {
    return activePlayer;
  };

  const takeTurn = (column) => {
    const { row, winningMove } = gameBoard.dropPiece(column, activePlayer.id);
    if (!winningMove.length) switchPlayerTurn();
    return { row, winningMove };
  };

  const switchPlayerTurn = () =>
    (activePlayer = activePlayer === player1 ? player2 : player1);

  return { getActivePlayer, takeTurn };
}

let gameBoard = GameBoard();
let currentGame = Game(gameBoard);

let board = document.querySelector(".game-board");
let headers = board.querySelectorAll(".column-header");
let columns = board.querySelectorAll(".column");
let winnerMessage = document.querySelector(".winner-message");

for (const [i, header] of headers.entries()) {
  header.addEventListener("click", () => {
    const { row, winningMove } = currentGame.takeTurn(i);
    const cells = header.nextElementSibling.querySelectorAll(".cell");
    cells[row].style.backgroundColor =
      currentGame.getActivePlayer().id === 1 ? "red" : "black";
    if (winningMove.length) highlightWinner(winningMove);
  });
  header.addEventListener("mouseover", () => {
    header.style.backgroundColor =
      currentGame.getActivePlayer().id === 2 ? "red" : "black";
  });
  header.addEventListener("mouseout", () => {
    header.style.backgroundColor = "rgba(0,0,0,40%)";
  });
}

const highlightWinner = (winningMove) => {
  for (sequence of winningMove) {
    for (move of sequence) {
      const cell = columns[move.column].querySelectorAll(".cell")[move.row];
      cell.style.backgroundColor = "green";
    }
  }
  let winnerText = winnerMessage.querySelector(".winner-text");
  winnerText.innerText =
    "Player " + currentGame.getActivePlayer().id + " wins!";
  winnerMessage.classList.add("show");
};
