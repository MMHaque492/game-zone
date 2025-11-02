document.addEventListener('DOMContentLoaded', () => {
    const choiceButtons = document.querySelectorAll('.rps-btn');
    const statusText = document.getElementById('status-text');
    const playerChoiceText = document.getElementById('player-choice');
    const computerChoiceText = document.getElementById('computer-choice');

    const getWinner = (player, computer) => {
        if (player === computer) {
            return "It's a tie!";
        }
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'You win!';
        }
        return 'C++ wins!';
    };

    const playGame = async (playerChoice) => {
        try {
            // 1. Get computer move from C++ addon via server
            const response = await fetch('/api/rps');
            const data = await response.json();
            const computerChoice = data.move;

            // 2. Determine winner
            const resultMessage = getWinner(playerChoice, computerChoice);

            // 3. Update UI
            playerChoiceText.textContent = playerChoice;
            computerChoiceText.textContent = computerChoice;
            statusText.textContent = resultMessage;

        } catch (error) {
            console.error('Error playing game:', error);
            statusText.textContent = 'Error connecting to server';
        }
    };

    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const choice = button.getAttribute('data-choice');
            playGame(choice);
        });
    });
});
