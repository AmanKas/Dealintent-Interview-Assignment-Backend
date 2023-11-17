import React from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "../redux/boardsSlice";
import { setChecklistCompletedOnBoard } from "../redux/api";

function Checklist({ index, taskIndex, colIndex }) {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const col = board.columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const checklist = task.checklists.find((checklist, i) => i === index);
  const checked = checklist.isCompleted;

  const onChange = async (e) => {
    try {
      dispatch(
        boardsSlice.actions.setChecklistCompleted({
          index,
          taskIndex,
          colIndex,
        })
      );

      const updatedTask = board.columns[colIndex].tasks[taskIndex];
      const updatedChecklist = updatedTask.checklists[index];

      await setChecklistCompletedOnBoard(
        board._id,
        colIndex,
        taskIndex,
        index,
        updatedChecklist.isCompleted
      );
    } catch (error) {
      console.error("Error setting checklist completed:", error);
    }
  };

  return (
    <div
      className=" w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740] rounded-md relative 
    items-center justify-start dark:bg-[#20212c]  p-3 gap-4  bg-[#f4f7fd]"
    >
      <input
        className=" w-4 h-4 accent-[#ffafcc] cursor-pointer "
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <p className={checked && " line-through opacity-30 "}>
        {checklist.title}
      </p>
    </div>
  );
}

export default Checklist;
