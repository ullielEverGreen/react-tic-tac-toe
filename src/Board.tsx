import "./Board.css";
import { useState } from "react";

type SquareProps = {
  value: number;
  clickEvent: () => void;
};

function Square({ value, clickEvent }: SquareProps) {
  // function Square({ value, clickEvent }: {value: string, clickEvent: () => void }) {
  return (
    <button className="square" onClick={clickEvent}>
      {value}
    </button>
  );
}

function Board() {
  const [isX, setIsX] = useState(true); // 当前用户是否X
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [result, setResult] = useState("...");

  const handleClick = (idx: number) => {
    if (squares[idx]) return;

    if (checkWinner(squares)) return console.log("比赛已结束！");

    const nextSquares = squares.slice();

    nextSquares[idx] = isX ? "X" : "O";

    const winner = checkWinner(nextSquares);

    if (winner) {
      setResult((isX ? "X" : "O") + " win!!!");
    } else {
      setIsX(!isX);
    }

    setSquares(nextSquares);
  };

  const checkWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  return (
    <>
      <div>{result}</div>
      <div className="board-row">
        <Square value={squares[0]} clickEvent={() => handleClick(0)} />
        <Square value={squares[1]} clickEvent={() => handleClick(1)} />
        <Square value={squares[2]} clickEvent={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} clickEvent={() => handleClick(3)} />
        <Square value={squares[4]} clickEvent={() => handleClick(4)} />
        <Square value={squares[5]} clickEvent={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} clickEvent={() => handleClick(6)} />
        <Square value={squares[7]} clickEvent={() => handleClick(7)} />
        <Square value={squares[8]} clickEvent={() => handleClick(8)} />
      </div>
    </>
  );
}

export default Board;
