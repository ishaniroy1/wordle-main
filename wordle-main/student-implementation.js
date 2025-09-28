/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 * 
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 * 
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Reset all game state variables
 * - Get a random word from the word list
 * - Clear the game board
 * - Hide any messages or modals
 */
function initializeGame() {
    // TODO: Reset game state variables
    currentWord = '';  // Set this to a random word
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    currentWord = WordleWords.getRandomWord().toUpperCase();
    
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    resetBoard();
    
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    hideModal();
}

/**
 * Handle keyboard input
 * POINTS: 15
 * 
 * TODO: Complete this function to:
 * - Process letter keys (A-Z)
 * - Handle ENTER key for word submission
 * - Handle BACKSPACE for letter deletion
 * - Update the display when letters are added/removed
 */
function handleKeyPress(key) {
    // TODO: Check if game is over - if so, return early
    if (gameOver) return;
    if (!validateInput(key, currentGuess)) return;
    
    // TODO: Handle letter keys (A-Z)
    // HINT: Use regex /^[A-Z]$/ to test if key is a letter
    // HINT: Check if currentGuess.length < WORD_LENGTH before adding
    // HINT: Use getTile() and updateTileDisplay() to show the letter

    const regex = /^[A-Z]$/
    const isLetter = regex.test(key);

    if (isLetter && currentGuess.length < WORD_LENGTH) {
        currentGuess += key;
        const currentTile = getTile(currentRow, currentGuess.length - 1);
        updateTileDisplay(currentTile, key);
        return;
    }

    // TODO: Handle ENTER key
    // HINT: Check if guess is complete using isGuessComplete()
    // HINT: Call submitGuess() if complete, show error message if not
    // NOT COMPLETE
    
    if (key === 'ENTER') {
        if (isGuessComplete()) {
            submitGuess();
        }
        else {
            alert('Incomplete guess!');
        }
        return;
    }
    
    // TODO: Handle BACKSPACE key  
    // HINT: Check if there are letters to remove
    // HINT: Clear the tile display and remove from currentGuess
    // NOT COMPLETE

    if (key === 'BACKSPACE' && currentGuess.length > 0) {
        const removeIndex = currentGuess.length - 1;
        currentGuess = currentGuess.slice(0, -1)
        const currentTile = getTile(currentRow, removeIndex);
        updateTileDisplay(currentTile, ''); // clears tile
        return;
    }
    return;
}

/**
 * Submit and process a complete guess
 * POINTS: 20
 * 
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    // TODO: Validate guess is complete
    // HINT: Use isGuessComplete()
    if (!isGuessComplete()) return;

    // TODO: Validate guess is a real word
    // HINT: Use WordleWords.isValidWord()
    // HINT: Show error message and shake row if invalid
    if (!WordleWords.isValidWord(currentGuess)) {
        alert('Not a valid guess!');
        shakeRow(currentRow);
        return;
    }
    
    // TODO: Check each letter and get results
    // HINT: Use checkLetter() for each position
    // HINT: Store results in an array

    // using checkGuess to check the entire array
    const letterResults = checkGuess(currentGuess, currentWord);
    
    // TODO: Update tile colors immediately
    // HINT: Loop through results and use setTileState()
    for (let i = 0; i < WORD_LENGTH; i++) {
        const updateTile = getTile(currentRow, i);
        setTileState(updateTile, letterResults[i]);
    }
    
    // TODO: Update keyboard colors
    // HINT: Call updateKeyboardColors()
    updateKeyboardColors(currentGuess, letterResults);
    
    // TODO: Check if guess was correct
    // HINT: Compare currentGuess with currentWord
    const isCorrect = (currentGuess === currentWord);
    if (isCorrect) gameWon = true;
    
    // TODO: Update game state
    // HINT: Call updateGameState()
    updateGameState(isCorrect);
    
    // TODO: Move to next row if game continues
    // HINT: Increment currentRow and reset currentGuess
    if (hasGuessesLeft() && !gameOver) {
        currentRow++;
        currentGuess = '';
    }
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Return 'correct' if letter matches position exactly
 * - Return 'present' if letter exists but wrong position
 * - Return 'absent' if letter doesn't exist in target
 * - Handle duplicate letters correctly (this is the tricky part!)

function checkLetter(guessLetter, position, targetWord) {
    // TODO: Convert inputs to uppercase for comparison
    
    // TODO: Check if letter is in correct position
    // HINT: Compare targetWord[position] with guessLetter
    
    // TODO: Check if letter exists elsewhere in target
    // HINT: Use targetWord.includes() or indexOf()
    
    // TODO: Handle duplicate letters correctly
    // This is the most challenging part - you may want to implement
    // a more sophisticated algorithm that processes the entire word
}
 */

// implementing a more sophisticated algorithm that processes the entire word
function checkGuess(currentGuess, targetWord) {
    currentGuess = currentGuess.toUpperCase();
    targetWord = targetWord.toUpperCase();

    // creating an array with all "absent" values
    const resultArray = Array(currentGuess.length).fill('absent');
    // creating an array of the target letters
    const targetArray = targetWord.split('');

    // first pass - checking for "correct" letters
    for (let i = 0; i < currentGuess.length; i++) {
        if (currentGuess[i] === targetArray[i]) {
            resultArray[i] = 'correct';
            targetArray[i] = null;
        }
    }

    // second pass - checking for "present" letters
    for (let i = 0; i < currentGuess.length; i++) {
        if (resultArray[i] === 'correct') continue;
        const index = targetArray.indexOf(currentGuess[i]);
        if (index !== -1) {
            resultArray[i] = 'present';
            targetArray[index] = null;
        }
    }

    return resultArray;
}

/**
 * Update game state after a guess
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if player won (guess matches target)
 * - Check if player lost (used all attempts)
 * - Show appropriate end game modal
 */
function updateGameState(isCorrect) {
    // TODO: Handle win condition
    // HINT: Set gameWon and gameOver flags, call showEndGameModal
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        showEndGameModal(gameWon, currentWord);
        return;
    }
    
    // TODO: Handle lose condition  
    // HINT: Check if currentRow >= MAX_GUESSES - 1
    if (!isCorrect) {
        if (currentRow >= MAX_GUESSES - 1) {
            gameWon = false;
            gameOver = true;
            showEndGameModal(gameWon, currentWord);
        }
    }
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Update each key with appropriate color
 * - Maintain color priority (green > yellow > gray)
 * - Don't downgrade key colors
 */
// guess is current guess, results is letterResults array
function updateKeyboardColors(guess, results) {
    // TODO: Loop through each letter in the guess
    for (let i = 0; i < guess.length; i++) {
    
    // TODO: Get the keyboard key element
    // HINT: Use document.querySelector with [data-key="LETTER"]
        const letter = guess[i].toUpperCase()
        const keyboardKey = document.querySelector(`[data-key="${letter}"]`);
        if (!keyboardKey) continue;

        // TODO: Apply color with priority system
        // HINT: Don't change green keys to yellow or gray
        // HINT: Don't change yellow keys to gray
        if (results[i] === 'correct') {
            keyboardKey.classList.add('correct'); // green
            keyboardKey.classList.remove('present', 'absent');
        } else if (results[i] === 'present') {
            if (!keyboardKey.classList.contains('correct')) { // don't downgrade
                keyboardKey.classList.add('present'); // yellow
                keyboardKey.classList.remove('absent');
            }
        } else if (results[i] === 'absent') {
            if (!keyboardKey.classList.contains('correct') && !keyboardKey.classList.contains('present')) { // don't downgrade
                keyboardKey.classList.add('absent'); // gray
            }
        }

    }
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 * 
 * TODO: Complete this function to:
 * - Check if all letters were correct
 * - Trigger celebration if player won this round
 */
function processRowReveal(rowIndex, results) {
    // TODO: Check if all results are 'correct'
    // HINT: Use results.every() method
    if (results.every(rowIndex)) {
        allCorrect = true;
    }
    
    // TODO: If all correct, trigger celebration
    // HINT: Use celebrateRow() function
    if (allCorrect) {
        celebrateRow(currentRow);
    }
    return;
}

/**
 * Show end game modal with results
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {
    // TODO: Create appropriate message based on won parameter
    // HINT: For wins, include number of guesses used
    // HINT: For losses, reveal the target word
    if (won) {
        const numGuesses = currentRow + 1;
        alert("You won! You guessed the correct word in " + numGuesses + " guesses.");
        return;
    }
    if (!won) {
        const endWord = targetWord;
        alert("You lost. The correct word was " + targetWord + ".");
        return;
    }
    
    // TODO: Update statistics
    // HINT: Use updateStats() function
    updateStats(won);
    
    // TODO: Show the modal
    // HINT: Use showModal() function
    showModal(won, targetWord, currentRow);
}

/**
 * Validate user input before processing
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if game is over
 * - Validate letter keys (only if guess not full)
 * - Validate ENTER key (only if guess complete)
 * - Validate BACKSPACE key (only if letters to remove)
 */
function validateInput(key, currentGuess) {
    // TODO: Return false if game is over
    if (gameOver) {
        return false;
    }
    
    // TODO: Handle letter keys
    // HINT: Check if currentGuess.length < WORD_LENGTH
    const regex = /^[A-Z]$/
    isLetter = regex.test(key);

    if (isLetter && currentGuess.length < WORD_LENGTH) {
        return true;
    }
    
    // TODO: Handle ENTER key
    // HINT: Check if currentGuess.length === WORD_LENGTH
    if (key === 'ENTER' && currentGuess.length === WORD_LENGTH) {
        return true;
    }
    
    // TODO: Handle BACKSPACE key
    // HINT: Check if currentGuess.length > 0
    if (key === 'BACKSPACE' && currentGuess.length > 0) {
        return true;
    }
    
    return false;
}