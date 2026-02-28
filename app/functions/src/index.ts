import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions";
import { onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import type { Board, Cell, GameStatus, PlayRequest, PlayResponse } from "../../shared/types.js";

admin.initializeApp();

const db = admin.firestore();

setGlobalOptions({ maxInstances: 10 });

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

function checkWinner(board: Board): Cell {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Cell;
    }
  }
  return null;
}

function minimax(board: Board, isMaximizing: boolean): number {
  const winner = checkWinner(board);
  if (winner === "X") return 10;
  if (winner === "O") return -10;
  if (board.every((c) => c !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Board): number {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "X";
      const val = minimax(board, false);
      board[i] = null;
      if (val > bestVal) {
        bestVal = val;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

export const play = onCall<PlayRequest, Promise<PlayResponse>>(async (request) => {
  const { address, position } = request.data;

  if (
    !address ||
    typeof position !== "number" ||
    position < 0 ||
    position > 8 ||
    !Number.isInteger(position)
  ) {
    throw new Error("Invalid request");
  }

  const snapshot = await db
    .collection("tokenizer")
    .where("address", "==", address.toLowerCase())
    .where("status", "==", "ongoing")
    .limit(1)
    .get();

  let board: Board = Array(9).fill(null) as Board;
  let docRef: admin.firestore.DocumentReference;

  if (!snapshot.empty) {
    docRef = snapshot.docs[0].ref;
    board = snapshot.docs[0].data().board;
  } else {
    docRef = db.collection("tokenizer").doc();
  }

  if (board[position] !== null) {
    throw new Error("Position already taken");
  }

  // Player plays 'O'
  board[position] = "O";

  let status: GameStatus = "ongoing";

  if (checkWinner(board) === "O") {
    status = "won";
  } else if (board.every((c) => c !== null)) {
    status = "draw";
  } else {
    // Machine plays 'X' using minimax
    const machineMove = getBestMove(board);
    board[machineMove] = "X";

    if (checkWinner(board) === "X") {
      status = "lost";
    } else if (board.every((c) => c !== null)) {
      status = "draw";
    }
  }

  await docRef.set({
    address: address.toLowerCase(),
    board,
    status,
  });

  logger.info("play", { address: address.toLowerCase(), status });

  return { board, status };
});
