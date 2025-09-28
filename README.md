I started with initializeGame() to set up the game. I used the Live Server extension in VS Code to view the page in my browser.

I implemented handleKeyPress() to handle keyboard presses. I started with letter keys, then Enter to submit guesses and Backspace to remove letters. I tested these by typing letters in my browser and checking if they were working as I expected.

Instead of creating checkLetter(), I created checkWord() to determine the position of the letters in the word all at once. This made it easier to handle duplicate letters.

I implemented the rest of the basic functions, such as submitGuess(), and after some testing and debugging, had a functional Wordle game.

For the advanced features, I focused on updating the keyboard color as I guessed. I approached this by first reading each letter in the guessed word and comparing it to its respective status in the letterResults array (correct, present, or absent). Then, I applied color with the priority system being green > yellow > gray. This ensured that once a key was green, it would never be yellow or gray, and once a key was yellow, it would never be gray.

Finally, to show error or completion messages to the user, I used alert(), which creates a popup on the screen. Alerts display incomplete/invalid guesses as well as game wins and losses.
