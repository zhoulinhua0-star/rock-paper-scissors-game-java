# Rock Paper Scissors (Java)

A console-based Rock Paper Scissors game written in Java, designed to demonstrate basic Java programming, input validation, control flow, and simple score tracking.

---

## Project Overview

This project is a console game where the player competes against the computer in Rock Paper Scissors. The game supports multiple rounds and keeps track of the player's score.

- **Language**: Java  
- **Type**: Console application  
- **Purpose**: Practice Java fundamentals, user input handling, and conditional logic

---

## Features

- User vs Computer gameplay  
- Input validation (`r`, `p`, `s`)  
- Random computer choice  
- Score tracking:
  - Win → +2 points  
  - Tie → +1 point  
  - Loss → -1 point  
- Replay option to play multiple rounds  
- Informative messages for correct/incorrect moves  

---

## Project Structure

rock-paper-scissors-game-java/
├── README.md
├── .gitignore
└── src/
└── rockPaperScissors/
└── RpsGame.java


- **README.md** → Project documentation  
- **.gitignore** → Files to ignore in Git (compiled files, IDE configs, system files)  
- **src/** → Source code folder  
- **RpsGame.java** → Main Java program  

---

## How to Run

1. Open a terminal and navigate to the project directory:
cd ~/Desktop/rock-paper-scissors-game-java

2. Compile the Java program:
javac src/rockPaperScissors/RpsGame.java

3. Run the game:
java -cp src rockPaperScissors.RpsGame

## Gameplay Instructions
When prompted, enter one of the following:

r → Rock

p → Paper

s → Scissors

The computer will randomly choose its move.

Score updates automatically:

Tie → +1 point

Win → +2 points

Loss → -1 point

After each round, choose whether to play again by typing yes or no.

## Example Output:

Enter your move: (r / p / s) r
Computer choice: paper
You lose!

Play again? yes
Enter your move: (r / p / s) s
Computer choice: paper
You win!

Total score: 2
Bye! Have a good day!

## License
This project is open-source and free to use.

---
