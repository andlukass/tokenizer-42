import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const checkWinner = (currentBoard: Board): Player | 'draw' | null => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }

    if (currentBoard.every((cell) => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        {!winner ? (
          <p className="text-2xl font-semibold text-slate-700">
            jogador atual: <span className="text-blue-600">{currentPlayer}</span>
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-3xl font-bold text-slate-800">
              {winner === 'draw' ? (
                <span className="text-amber-600">Empate!</span>
              ) : (
                <>
                  Jogador <span className="text-green-600">{winner}</span> venceu!
                </>
              )}
            </p>
            <button
              type="button"
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={20} />
              Jogar Novamente
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 bg-slate-200 p-4 rounded-xl shadow-xl">
        {board.map((cell, index) => (
          <button
            type="button"
            key={String(index)}
            onClick={() => handleCellClick(index)}
            className={`w-24 h-24 bg-white rounded-lg font-bold text-4xl transition-all duration-200 shadow-md
              ${!cell && !winner ? 'hover:bg-slate-50 hover:shadow-lg cursor-pointer' : ''}
              ${cell === 'X' ? 'text-blue-600' : ''}
              ${cell === 'O' ? 'text-red-600' : ''}
              ${winner ? 'cursor-not-allowed' : ''}
            `}
            disabled={!!cell || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
