document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status-text');
    const restartBtn = document.getElementById('restart-btn');

    let boardState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    const handleCellClick = (e) => {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (boardState[index] !== "" || !gameActive) {
            return;
        }

        // Update local state
        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        // Check for winner by calling the API
        checkWinner();
    };

    const checkWinner = async () => {
        try {
            const response = await fetch('/api/tic-tac-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ board: boardState }),
            });
            const result = await response.json();
            
            if (result.winner) {
                gameActive = false;
                if (result.winner === 'draw') {
                    statusText.textContent = "It's a Draw!";
                } else {
                    statusText.textContent = `Player ${result.winner} Wins!`;
                }
            } else {
                // No winner, switch player
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                statusText.textContent = `Player ${currentPlayer}'s Turn`;
            }

        } catch (error) {
            console.error('Error checking winner:', error);
            statusText.textContent = 'Error connecting to server';
        }
    };

    const restartGame = () => {
        boardState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        statusText.textContent = "Player X's Turn";
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('x', 'o');
        });
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);
});
