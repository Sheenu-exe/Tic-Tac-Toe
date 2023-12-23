document.addEventListener('DOMContentLoaded', () => {
    const options = document.getElementById('options');
    const twoPlayerButton = document.getElementById('twoPlayerButton');
    const computerButton = document.getElementById('computerButton');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');

    const playerXIcon = 'X';
    const playerOIcon = 'O';

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
        cells[index].textContent = currentPlayer;

        const winner = checkWinner();
        const draw = checkDraw();

        if (winner) {
            displayWinningMessage(winner);
            gameActive = false;
        } else if (draw) {
            displayWinningMessage(null); // It's a draw
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            if (isTwoPlayerMode) {
                status.textContent = `${currentPlayer}'s turn`;
            } else {
                status.textContent = currentPlayer === 'X' ? 'Your turn' : 'Computer\'s turn';

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

        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'O';
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        gameBoard[bestMove] = 'O';
        cells[bestMove].textContent = 'O';

        const winner = checkWinner();
        const draw = checkDraw();

        if (winner) {
            displayWinningMessage(winner);
            gameActive = false;
        } else if (draw) {
            displayWinningMessage(null); // It's a draw
            gameActive = false;
        } else {
            currentPlayer = 'X';
            status.textContent = 'Your turn';
        }
    };

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            X: -1,
            O: 1,
            draw: 0
        };

        const result = checkWinner();
        if (result) {
            return scores[result] * (depth + 1);
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const displayWinningMessage = (winner) => {
        let message;
        if (isTwoPlayerMode) {
            message = winner ? `${winner} Won! 🎉` : 'It\'s a Draw! 🎉';
        } else {
            message = winner === 'X' ? 'You Won! 🎉' : 'Computer Won! 🎉';
        }

        Swal.fire({
            title: 'Game Over',
            html: `${message}`,
            icon: 'success',
            confirmButtonText: 'Play Again'
        }).then((result) => {
            if (result.isConfirmed) {
                resetGame();
            }
        });

        // Add confetti on winning
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti-container');
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 200; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);

        // Replace the central cell with a party popper
        const centralCellIndex = Math.floor(cells.length / 2);
        cells[centralCellIndex].innerHTML = '🎉';
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const startGame = () => {
        options.style.display = 'none';
        board.style.display = 'grid';

        status.textContent = isTwoPlayerMode ? `${currentPlayer}'s turn` : 'Your turn';

        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleClick(index));
        });
    };

    const resetGame = () => {
        if (!gameActive) {
            gameActive = true;
        }
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        isTwoPlayerMode = false;

        options.style.display = 'flex';
        board.style.display = 'none';
        status.textContent = 'Choose a game mode';

        cells.forEach((cell) => {
            cell.textContent = '';
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

    resetButton.addEventListener('click', resetGame);

    // Call resetGame automatically when the page loads
    resetGame();
});
