import { shuffle } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "../redux/boardsSlice";
import Task from "./Task";
import { dragTaskOnBoard } from "../redux/api";

function Column({ colIndex }) {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ];

  const dispatch = useDispatch();
  const [color, setColor] = useState(null);
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const col = board.columns.find((col, i) => i === colIndex);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [dispatch]);

  const handleOnDrop = async (e) => {
    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );

    if (colIndex !== prevColIndex) {
      dispatch(
        boardsSlice.actions.dragTask({ colIndex, prevColIndex, taskIndex })
      );

      try {
        await dragTaskOnBoard(board._id, {
          colIndex,
          prevColIndex,
          taskIndex,
        });
      } catch (error) {
        console.error("Error dragging task:", error);
      }
    }
  };
  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className="scrollbar-hide mx-5 pt-[90px] min-w-[280px] "
    >
      <div className=" font-semibold flex items-center gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
        <div className={`rounded-full w-4 h-4 ${color} `} />
        {col.name} ({col?.tasks?.length})
      </div>

      {col.tasks?.map((task, index) => (
        <Task key={index} taskIndex={index} colIndex={colIndex} />
      ))}
    </div>
  );
}

export default Column;
