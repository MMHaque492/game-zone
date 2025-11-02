document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const resetBtn = document.getElementById('reset-btn');
    const statusText = document.getElementById('status-text');
    const guessCountText = document.getElementById('guess-count');

    let secretNumber = 0;
    let guessCount = 0;

    const startNewGame = async () => {
        try {
            // Get a new secret number from the C++ addon
            const response = await fetch('/api/guess');
            const data = await response.json();
            secretNumber = data.number;

            // Reset UI
            guessCount = 0;
            guessCountText.textContent = guessCount;
            statusText.textContent = 'Good luck!';
            guessInput.value = '';
            guessInput.disabled = false;
            guessBtn.disabled = false;
            resetBtn.style.display = 'none';
            console.log(`New secret number (from C++): ${secretNumber}`);

        } catch (error) {
            console.error('Error starting new game:', error);
            statusText.textContent = 'Error connecting to server';
        }
    };

    const handleGuess = () => {
        const guess = parseInt(guessInput.value, 10);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            statusText.textContent = 'Please enter a number between 1 and 100.';
            return;
        }

        guessCount++;
        guessCountText.textContent = guessCount;

        if (guess === secretNumber) {
            statusText.textContent = `You got it in ${guessCount} guesses!`;
            guessInput.disabled = true;
            guessBtn.disabled = true;
            resetBtn.style.display = 'block';
        } else if (guess < secretNumber) {
            statusText.textContent = 'Too low! Try again.';
        } else {
            statusText.textContent = 'Too high! Try again.';
        }
        guessInput.value = '';
        guessInput.focus();
    };

    guessBtn.addEventListener('click', handleGuess);
    resetBtn.addEventListener('click', startNewGame);

    // Start the first game on load
    startNewGame();
});
