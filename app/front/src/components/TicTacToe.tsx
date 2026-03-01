import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import type { Board, GameStatus } from '../../../shared/types';
import { play } from '../lib/api';
import { db } from '../lib/firebase';

interface TicTacToeProps {
  walletAddress: string | null;
}

const emptyBoard = (): Board => Array(9).fill(null);

export default function TicTacToe({ walletAddress }: TicTacToeProps) {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [status, setStatus] = useState<GameStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (!walletAddress) return;

    const q = query(
      collection(db, 'tokenizer'),
      where('address', '==', walletAddress.toLowerCase()),
      where('status', '==', 'ongoing'),
      limit(1),
    );

    return onSnapshot(q, (snapshot) => {
      if (isPlayingRef.current) return;
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setBoard(data.board as Board);
        console.log("isDumb", data.isDumb);
        setStatus(data.status as GameStatus);
      }
    });
  }, [walletAddress]);

  const isOver = status !== null && status !== 'ongoing';
  const showConfetti = status === 'won';

  const handleCellClick = async (index: number) => {
    if (!walletAddress || loading || board[index] !== null || isOver) return;

    const prevBoard = board;
    const optimisticBoard = [...board] as Board;
    optimisticBoard[index] = 'O';

    isPlayingRef.current = true;
    setLoading(true);
    setError(null);
    setBoard(optimisticBoard);

    try {
      const result = await play({ address: walletAddress, position: index });
      setBoard(result.data.board);
      setStatus(result.data.status);
    } catch (err: unknown) {
      setBoard(prevBoard);
      setError(err instanceof Error ? err.message : 'Error contacting the server');
    } finally {
      isPlayingRef.current = false;
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
          Connect your wallet to play
        </p>
      </div>
    );
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={300}
        />
      )}
      <div className="flex flex-col items-center gap-8">
      <div className="text-center flex flex-col items-center justify-center h-28">
        {!isOver ? (
          <p className="text-2xl font-semibold text-slate-700">
            {loading
              ? 'Processing...'
              : (
                <>
                  Your turn - you are "<span className="font-bold text-red-600">O</span>"
                </>
              )}
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-3xl font-bold text-slate-800">
              {status === 'draw' ? (
                <span className="text-amber-600">Draw!</span>
              ) : status === 'won' ? (
                <span className="text-green-600">Congratulations, you won 10 T42 tokens!</span>
              ) : (
                <span className="text-red-600">You lost!</span>
              )}
            </p>
            <button
              type="button"
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={20} />
              Play Again
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
    </>
  );
}
