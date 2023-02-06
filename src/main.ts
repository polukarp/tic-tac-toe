type Cell = {
	id: number;
	value: CellValue;
};
type Player = 'X' | 'O';
type CellValue = Player & '';

interface GameBoard {
	getBoard(): string[][];
	getData(): NodeListOf<HTMLDivElement>;
	setCellValue(index: number, value: CellValue): void;
	resetBoard(): void;
}

let winner = '';

const winPopup = document.querySelector('#win-popup');
const winHeader = document.querySelector<HTMLHeadingElement>(
	'#winner',
) as HTMLHeadingElement;
const playAgainBtn = document.querySelector('#play-again-btn');

let currentPlayer: Player = 'X';

const Game = (gameBoard: GameBoard) => {
	let board = gameBoard.getBoard();
	let currentCell = '';
	let winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	let data = gameBoard.getData();
	data.forEach((cell) => {
		cell.addEventListener('click', () => {
			let index = Number(cell.dataset.index) - 1;
			currentCell = board[Math.floor(index / 3)][index % 3];

			if (!board[Math.floor(index / 3)][index % 3]) {
				board[Math.floor(index / 3)][index % 3] = currentPlayer;
				gameBoard.setCellValue(index, currentPlayer as CellValue);
			}

			if (checkWinner()) {
				winHeader.innerText = `Winner is player ${winner}`;
				winPopup?.classList.remove('hidden');
				gameBoard.resetBoard();
				board = gameBoard.getBoard();
				currentPlayer = 'X';
			}
		});
	});

	const makeTurn = () => {
		currentPlayer == 'X' ? (currentPlayer = 'O') : (currentPlayer = 'X');
	};

	const checkWinner = () => {
		for (let combination of winningCombinations) {
			if (checkCombination(combination)) {
				winner = currentPlayer;
				makeTurn();
				return true;
			}
		}
		if (!currentCell) {
			makeTurn();
		}
		return false;
	};

	const checkCombination = (combination: number[]) => {
		for (let i = 0; i < combination.length; i++) {
			if (!(board[Math.floor(combination[i] / 3)][combination[i] % 3] == currentPlayer)) {
				return false;
			}
		}
		return true;
	};

	return { checkWinner };
};

const GameBoard = () => {
	const data = document.querySelectorAll<HTMLDivElement>('[data-index]');
	let board: string[][] = [[], [], []];

	const getData = () => {
		return data;
	};

	const getBoard = () => {
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				let dataIndex = j + 3 * i;
				board[i][j] = data[dataIndex].innerText;
			}
		}
		return board;
	};

	const setCellValue = (index: number, value: CellValue) => {
		if (!data[index].innerText) {
			data[index].innerText = value;
		}
	};

	const resetBoard = () => {
		for (let i = 0; i < board.length; i++) {
			data.forEach((element) => {
				element.innerText = '';
			});
		}
		board = [[], [], []];
	};

	return { getBoard, setCellValue, getData, resetBoard };
};

let board = GameBoard();
let game = Game(board);

try {
	playAgainBtn?.addEventListener('click', () => {
		winPopup?.classList.add('hidden');
	});
} catch (e) {
	console.log(e);
}

export default Game;
