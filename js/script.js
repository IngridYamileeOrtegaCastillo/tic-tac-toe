const board = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const startGameBtn = document.getElementById('startGameBtn');
const timerDisplay = document.getElementById('time');
let currentPlayer = 'X';
let gameActive = false;
let gameState = ['', '', '', '', '', '', '', '', ''];
let timer;
let timeElapsed = 0;
let playerName = ''; 

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const xImage = '<img src="assets/images/heart.png" alt="Jugador" class="image">';
const oImage = '<img src="assets/images/heart2.png" alt="CPU" class="image">';

board.forEach(cell => cell.addEventListener('click', handlePlayerTurn));
restartBtn.addEventListener('click', restartGame);
startGameBtn.addEventListener('click', startGame);

function startGame() {
    playerName = document.getElementById('playerName').value.trim(); // Obtener el nombre del jugador
    if (playerName === '') {
        alert('Por favor, ingrese un nombre válido.');
        return;
    }

    gameActive = true;
    document.getElementById('board').style.display = 'grid';
    document.getElementById('playerNameContainer').style.display = 'none'; // Ocultar el campo de nombre
    startGameBtn.style.display = 'none';
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeElapsed++;
    timerDisplay.textContent = timeElapsed;
}

function handlePlayerTurn(event) {
    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (gameState[clickedIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer === 'X' ? xImage : oImage;

    checkResult();

    if (gameActive) {
        setTimeout(cpuTurn, 500);
    }
}

function cpuTurn() {
    let moveMade = false;

    moveMade = findBestMove('O');
    if (!moveMade) {
        moveMade = findBestMove('X');
    }
    if (!moveMade) {
        moveMade = makeRandomMove();
    }

    checkResult();
}

function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        let values = [gameState[a], gameState[b], gameState[c]];
        let countPlayer = values.filter(val => val === player).length;
        let countEmpty = values.filter(val => val === '').length;

        if (countPlayer === 2 && countEmpty === 1) {
            let emptyIndex = [a, b, c].find(index => gameState[index] === '');
            gameState[emptyIndex] = 'O';
            document.querySelector(`[data-index='${emptyIndex}']`).innerHTML = oImage;
            return true;
        }
    }
    return false;
}

function makeRandomMove() {
    let availableCells = [];

    gameState.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    if (availableCells.length === 0) return false;

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = 'O';
    document.querySelector(`[data-index='${randomIndex}']`).innerHTML = oImage;
    return true;
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }

        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (currentPlayer === 'X') {
            message.textContent = `${playerName} ganó!`;
            addResultToTable(playerName, 'CPU', `${playerName} ganó`, timeElapsed);
        } else {
            message.textContent = 'CPU ganó!';
            addResultToTable(playerName, 'CPU', 'CPU ganó', timeElapsed);
        }
        gameActive = false;
        clearInterval(timer);
        return;
    }

    if (!gameState.includes('')) {
        message.textContent = '¡Empate!';
        addResultToTable(playerName, 'CPU', 'Empate', timeElapsed);
        gameActive = false;
        clearInterval(timer);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function addResultToTable(player1, player2, result, time) {
    const resultsTableBody = document.querySelector("#resultsTable tbody");
    const resultRow = document.createElement("tr");
    
    const playerCell = document.createElement("td");
    playerCell.textContent = player1;
    resultRow.appendChild(playerCell);
    
    const cpuCell = document.createElement("td");
    cpuCell.textContent = player2;
    resultRow.appendChild(cpuCell);
    
    const resultCell = document.createElement("td");
    resultCell.textContent = result;
    resultRow.appendChild(resultCell);
    
    const timeCell = document.createElement("td");
    timeCell.textContent = time;
    resultRow.appendChild(timeCell);
    
    resultsTableBody.appendChild(resultRow);
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = false;
    gameState = ['', '', '', '', '', '', '', '', ''];
    timeElapsed = 0;
    timerDisplay.textContent = '0';
    message.textContent = '';
    document.getElementById('board').style.display = 'none';
    document.getElementById('playerNameContainer').style.display = 'block'; // Mostrar el campo de nombre
    startGameBtn.style.display = 'block';
    
    board.forEach(cell => {
        cell.innerHTML = '';
    });
}
