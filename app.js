const gameBoard = (() => {
    let cells = document.querySelectorAll('.cell');
    let gameArray = [];
    cells.forEach((cell) => gameArray.push(cell));

    const checkFilledCell = (e) => {
        if (e.target.innerText == 'X' | e.target.innerText == 'O') {
            return true
        } else {
            return false
        }
    };
    
    const clearGameBoard = () => {
        cells.forEach((cell) => {
            cell.innerText = '';
        })
    };

    return {gameArray, cells, clearGameBoard, checkFilledCell};
})();

const player = (name, symbol) => {
    let winCount = 0;
    let playerSymbol = symbol;
    let playerID = name;

    function addToWins() {
        winCount += 1;
    }

    function getWins() {
        return winCount
    }

    return {playerID, playerSymbol, addToWins, getWins}
};

const gameMonitor = (() => {
    let playerOne;
    let playerTwo;
    let turnCounter = 0;
    let currentPlayer;

    let playerCardOne = document.getElementById('playerOne');
    let playerCardTwo = document.getElementById('playerTwo');
    let winCountOne = document.getElementById('win-count-1');
    let winCountTwo = document.getElementById('win-count-2');
    let menu = document.getElementById('menu');
    let game = document.getElementById('gameboard');
    let endgameMsg = document.querySelector('.endgame-container');
    let result = document.getElementById('result');

    let gameArray = gameBoard.gameArray;
    const cells = gameBoard.cells;

    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    function registerPlayers() {
        let playerOneInput = document.getElementById('player-one');
        let playerTwoInput = document.getElementById('player-two');
        let playerOneName = playerOneInput.value.length > 0 ? playerOneInput.value : 'Player One';
        let playerTwoName = playerTwoInput.value.length > 0 ? playerTwoInput.value : 'Player Two';

        playerOne = player(playerOneName, 'X');
        playerTwo = player(playerTwoName, 'O');

        let playerOneLabel = document.querySelector('.player-1-id');
        playerOneLabel.innerText = playerOne.playerID;

        let playerTwoLabel = document.querySelector('.player-2-id');
        playerTwoLabel.innerText = playerTwo.playerID;

        menu.style.display = 'none';

        game.style.display = 'flex';

        currentPlayer = playerOne;
    }

    function handleClick(e) {
        if (!gameBoard.checkFilledCell(e)){
            e.target.innerText = currentPlayer.playerSymbol;
            turnCounter++;
            // add check for win once turn counter >= 5 (# of turns before possible for win)
            console.log(turnCounter);
            if (turnCounter >= 5) {
                if(_endGame(currentPlayer) | turnCounter >= 9) {
                    if (turnCounter < 9) {
                        result.innerHTML = `${currentPlayer.playerID} won!`;
                    } else if (turnCounter >= 9) {
                        result.innerHTML = "It's a draw!";
                    }
                    game.style.display = 'none';
                    endgameMsg.style.display = 'flex';
                }
            }
            nextPlayer = currentPlayer == playerOne ? playerTwo : playerOne;
            currentPlayer = nextPlayer;
        }
        if (currentPlayer == playerOne) {
            if (playerCardTwo.classList.contains('current-player')) {
                playerCardTwo.classList.remove('current-player');
            }
            playerCardOne.classList.add('current-player');
        } else if (currentPlayer == playerTwo) {
            if (playerCardOne.classList.contains('current-player')) {
                playerCardOne.classList.remove('current-player');
            }
            playerCardTwo.classList.add('current-player');
        }
    }

    const startGame = () => {
        gameBoard.clearGameBoard();
        winCountOne.innerText = '-';
        winCountTwo.innerText = '-';
        turnCounter = 0;
        currentPlayer = playerOne;
        playerCardOne.classList.add('current-player');
        playerCardTwo.classList.remove('current-player');
        cells.forEach((cell) => {
            cell.addEventListener('click', handleClick);
        })
    }

    function _endGame(currentPlayer) {
        for (let i = 0; i < winningCombinations.length; i++){
            // get elements as per current winning combination array
            let cell_1 = document.getElementById(`${winningCombinations[i][0]}`);
            let cell_2 = document.getElementById(`${winningCombinations[i][1]}`);
            let cell_3 = document.getElementById(`${winningCombinations[i][2]}`);
            // array values must not have an empty space before checking for win
            if (cell_1.innerText != '') {
                if (cell_1.innerText == cell_2.innerText && cell_1.innerText == cell_3.innerText) {
                    console.log(`${currentPlayer.playerID} Wins!`);
                    currentPlayer.addToWins();
                    // update win count
                    if (currentPlayer == playerOne) {
                        winCountOne.innerText = currentPlayer.getWins();
                    } else if (currentPlayer == playerTwo) {
                        winCountTwo.innerText = currentPlayer.getWins();
                    }
                    return true
                }
            }
        }
        return false
    }

    function newGame(currentPlayer) {
        game.style.display = 'flex';
        endgameMsg.style.display = 'none';
        turnCounter = 0;
        gameBoard.clearGameBoard();
        nextPlayer = currentPlayer == playerOne ? playerTwo:playerOne;
        currentPlayer = nextPlayer;
    }

    return {startGame, registerPlayers, newGame};

})();

const resetBtn = document.getElementById('reset');
const startBtn = document.getElementById('start');
const newGameBtn = document.querySelector('.new-game-btn');

resetBtn.addEventListener('click', gameMonitor.startGame);
startBtn.addEventListener('click', gameMonitor.registerPlayers);
newGameBtn.addEventListener('click', gameMonitor.newGame);



// run game

gameMonitor.startGame();


