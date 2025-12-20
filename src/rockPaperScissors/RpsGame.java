package rockPaperScissors;
import java.util.Scanner;
import java.util.Random;

// prompt: Enter your move(r/p/s): 
// computer choice: rock (e.g)
// you win! or you lose!
// Play again:
public class rpsGame {
	
	private static Scanner sc = new Scanner(System.in);
	private static Random rand = new Random();
	private static String[] choices = {"rock", "paper", "scissors" };
	private static int score = 0;

	static String getUserChoice() {
		while (true) {
			System.out.print("Enter your move: (r / p / s)");
			String userChoice = sc.next().toLowerCase();
			switch (userChoice) {
				case "r": return "rock";
				case "p": return "paper";
				case "s": return "scissors";
				default: System.out.println("Invalid input!");
			}
		}
	}
	
	static String getComputerChoice() {
		int randomIndex = rand.nextInt(choices.length);
		return choices[randomIndex];
	}
	
	static void showResult(String userChoice, String computerChoice) {
		System.out.println("Computer choice: " + computerChoice);
		boolean win = 
	            (userChoice.equals("rock") && computerChoice.equals("scissors")) ||
	            (userChoice.equals("paper") && computerChoice.equals("rock")) ||
	            (userChoice.equals("scissors") && computerChoice.equals("paper"));
		
		if (userChoice.equals(computerChoice)) {
			System.out.println("Tie!");
			score++;
		}
		else if (win) {
			System.out.println("You win!");
			score += 2;
		} else {
			System.out.println("You lose!");
			score--;
		}
	
	}
		
	static boolean playAgain() {
		while (true) {
			System.out.print("Play again? (yes or no)");
			String answer = sc.next().toLowerCase();
			if (answer.equals("yes")) {
				return true;
			}
			else if (answer.equals("no")) {
				return false;
			} else {
				System.out.println("Invalid input, try again.");
			}
		}
}
	
	static void runGame() {
		String user = getUserChoice();
		String comp = getComputerChoice();
		showResult(user, comp);
		System.out.println();
	}
	
	
	public static void main(String[] args) {
		do {
			runGame();
		} while (playAgain());
		System.out.println("\n-*-*-*-*-*-*-*");
		System.out.println("\nTotal score: " + score);
		System.out.println("\nBye! Have a good day!");
		sc.close();
	}
	
	
}
