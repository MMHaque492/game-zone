document.addEventListener('DOMContentLoaded', () => {
    const rollBtn = document.getElementById('roll-btn');
    const diceResult = document.getElementById('dice-result');

    const rollDice = async () => {
        try {
            // Set loading state
            diceResult.textContent = '...';
            rollBtn.disabled = true;

            // Call the API endpoint, which calls the C++ function
            const response = await fetch('/api/dice');
            const data = await response.json();

            // Update the UI with the result
            diceResult.textContent = data.roll;
            rollBtn.disabled = false;

        } catch (error) {
            console.error('Error rolling dice:', error);
            diceResult.textContent = 'Err';
            rollBtn.disabled = false;
        }
    };

    rollBtn.addEventListener('click', rollDice);
});
