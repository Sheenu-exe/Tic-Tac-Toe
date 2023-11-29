document.addEventListener('DOMContentLoaded', () => {
    const options = document.getElementById('options');
    const twoPlayerButton = document.getElementById('twoPlayerButton');
    const computerButton = document.getElementById('computerButton');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');

    const playerXIcon = '<i class="fas fa-times"></i>';
    const playerOIcon = '<i class="far fa-circle"></i>';

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let isTwoPlayerMode = false;

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a];
            }
        }

        return null;
    };

    const checkDraw = () => {
        return !gameBoard.includes('');
    };

    const handleClick = (index) => {
        if (gameBoard[index] || !gameActive) {
            return;
        }

        gameBoard[index] = currentPlayer;
        cells[index].innerHTML = currentPlayer === 'X' ? playerXIcon : playerOIcon;

        const winner = checkWinner();
        const draw = checkDraw();

        if (winner) {
            status.innerHTML = `${winner === 'X' ? playerXIcon : playerOIcon} wins!`;
            gameActive = false;
        } else if (draw) {
            status.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            if (isTwoPlayerMode) {
                status.innerHTML = `${currentPlayer === 'X' ? playerXIcon : playerOIcon}'s turn`;
            } else {
                status.innerHTML = currentPlayer === 'X' ? 'Your turn' : 'Computer\'s turn';

                if (currentPlayer === 'O') {
                    setTimeout(makeComputerMove, 500);
                }
            }
        }
    };

    const makeComputerMove = () => {
        if (!gameActive || isTwoPlayerMode) {
            return;
        }

        let emptyCells = gameBoard.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        if (emptyCells.length === 0) {
            return; // No empty cells left
        }

        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        let computerMove = emptyCells[randomIndex];

        gameBoard[computerMove] = 'O';
        cells[computerMove].innerHTML = playerOIcon;

        const winner = checkWinner();
        const draw = checkDraw();

        if (winner) {
            status.innerHTML = `${winner === 'X' ? playerXIcon : playerOIcon} wins!`;
            gameActive = false;
        } else if (draw) {
            status.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            currentPlayer = 'X';
            status.textContent = 'Your turn';
        }
    };

    const resetGame = () => {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        isTwoPlayerMode = false;

        options.style.display = 'block';
        board.style.display = 'none';
        status.textContent = 'Choose a game mode';

        cells.forEach((cell) => {
            cell.innerHTML = '';
        });

        twoPlayerButton.addEventListener('click', () => {
            isTwoPlayerMode = true;
            startGame();
        });

        computerButton.addEventListener('click', () => {
            isTwoPlayerMode = false;
            startGame();
            if (currentPlayer === 'O') {
                setTimeout(makeComputerMove, 500);
            }
        });
    };

    const startGame = () => {
        options.style.display = 'none';
        board.style.display = 'grid';

        status.innerHTML = isTwoPlayerMode ? `${currentPlayer === 'X' ? playerXIcon : playerOIcon}'s turn` : 'Your turn';

        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleClick(index));
        });
    };

    resetButton.addEventListener('click', resetGame);

    // Call resetGame automatically when the page loads
    resetGame();
});
