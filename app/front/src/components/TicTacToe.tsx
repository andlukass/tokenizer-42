import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { Board, GameStatus } from '../../../shared/types';
import { play } from '../lib/api';

interface TicTacToeProps {
  walletAddress: string | null;
}

const emptyBoard = (): Board => Array(9).fill(null);

export default function TicTacToe({ walletAddress }: TicTacToeProps) {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [status, setStatus] = useState<GameStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOver = status !== null && status !== 'ongoing';

  const handleCellClick = async (index: number) => {
    if (!walletAddress || loading || board[index] !== null || isOver) return;

    setLoading(true);
    setError(null);

    try {
      const result = await play({ address: walletAddress, position: index });
      setBoard(result.data.board);
      setStatus(result.data.status);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao contatar o servidor');
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setBoard(emptyBoard());
    setStatus(null);
    setError(null);
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-16">
        <p className="text-xl font-semibold text-slate-600">
          Conecte sua carteira para jogar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        {!isOver ? (
          <p className="text-2xl font-semibold text-slate-700">
            {loading
              ? 'Processando...'
              : 'Sua vez — você é o O'}
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-3xl font-bold text-slate-800">
              {status === 'draw' ? (
                <span className="text-amber-600">Empate!</span>
              ) : status === 'won' ? (
                <span className="text-green-600">Você venceu!</span>
              ) : (
                <span className="text-red-600">Você perdeu!</span>
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

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <div className="grid grid-cols-3 gap-3 bg-slate-200 p-4 rounded-xl shadow-xl">
        {board.map((cell, index) => (
          <button
            type="button"
            key={String(index)}
            onClick={() => handleCellClick(index)}
            disabled={!!cell || isOver || loading}
            className={`w-24 h-24 bg-white rounded-lg font-bold text-4xl transition-all duration-200 shadow-md
              ${!cell && !isOver && !loading ? 'hover:bg-slate-50 hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}
              ${cell === 'X' ? 'text-blue-600' : ''}
              ${cell === 'O' ? 'text-red-600' : ''}
            `}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
