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
    for (let i = rows - 1; i >= 0; i--) {
      if (boardState[i][column] === 0) {
        boardState[i][column] = 1;
        checkForWinner(i, column, player);
        break;
      }
    }
  };

  const checkForWinner = (row, column, playerName) => {
    let winningMove = [];
    let currentSequence = [{ row, column }];
    // Check vertical downwards
    for (let i = row - 1; i >= 0; i--) {
      if (boardState[i][column] === playerName)
        currentSequence.push({ i, column });
      else break;
    }

    // If 4 or more, add winning move
    if (currentSequence.length >= 4) winningMove.push(currentSequence);
    // Reset current sequence to last move
    currentSequence.length = 1;

    // Check horizontal left
    for (let i = column - 1; i >= 0; i--) {
      if (boardState[row][i] === playerName) currentSequence.push({ row, i });
      else break;
    }

    // We don't need to check or reset current sequence between left and right checks since they're continuous
    // Check horizontal right
    for (let i = column + 1; i < columns; i++) {
      if (boardState[row][i] === playerName) currentSequence.push({ row, i });
      else break;
    }

    if (currentSequence.length >= 4) winningMove.push(currentSequence);
    currentSequence.length = 1;

    //Check down right and up right
    for (let i = row + 1, j = column - 1; i < rows, j >= 0; i++, j--) {
      if (boardState[i][j] === playerName) currentSequence.push({ i, j });
      else break;
    }
    for (let i = row - 1, j = column + 1; i >= 0, j < columns; i--, j++) {
      if (boardState[i][j] === playerName) currentSequence.push({ i, j });
      else break;
    }

    if (currentSequence.length >= 4) winningMove.push(currentSequence);
    currentSequence.length = 1;

    //check up left and down left
    for (let i = row - 1, j = column - 1; i >= 0, j >= 0; i--, j--) {
      if (boardState[i][j] === playerName) currentSequence.push({ i, j });
      else break;
    }
    for (let i = row + 1, j = column + 1; i < rows, j < columns; i++, j++) {
      if (boardState[i][j] === playerName) currentSequence.push({ i, j });
      else break;
    }

    if (currentSequence.length >= 4) winningMove.push(currentSequence);
    return winningMove;
  };

  const getState = () => console.log(boardState);

  return { dropPiece, getState };
}

function Player(name) {
  let id = name;
  let isActive = false;
  const takeTurn = (game, column) => {
    game.dropPiece(column, id);

    console.log(game.getState());
  };

  return { takeTurn };
}

function Game(player1, player2) {
  const gameBoard = GameBoard();
  let activePlayer = Math.round(Math.random()) ? player1 : player2;

  const getActivePlayer = () => {
    return activePlayer;
  };

  const takeTurn = (column) => {
    gameBoard.dropPiece(column, activePlayer);
    switchPlayerTurn();
  };

  const switchPlayerTurn = () =>
    (activePlayer = activePlayer === player1 ? player2 : player1);

  return { getActivePlayer };
}

const game = Game();
const player1 = Player(1);
player1.takeTurn(game, 1);
