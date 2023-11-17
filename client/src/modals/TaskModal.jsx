import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipsisMenu from "../components/EllipsisMenu";
import ellipsis from "../assets/icon-vertical-ellipsis.svg";
import boardsSlice from "../redux/boardsSlice";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";
import Checklist from "../components/Checklist";
import { deleteTaskFromBoard, setTaskStatusOnBoard } from "../redux/api";

function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen }) {
  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const checklists = task.checklists;

  let completed = 0;
  checklists.forEach((checklist) => {
    if (checklist.isCompleted) {
      completed++;
    }
  });

  const [status, setStatus] = useState(task.status);
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));

  const onChange = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };
  const onClose = async (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    try {
      await setTaskStatusOnBoard(
        board._id,
        colIndex,
        taskIndex,
        status,
        newColIndex
      );
    } catch (error) {
      console.error("Failed to set task status:", error);
    }
    dispatch(
      boardsSlice.actions.setTaskStatus({
        taskIndex,
        colIndex,
        newColIndex,
        status,
      })
    );

    setIsTaskModalOpen(false);
  };
  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };
  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };
  const onDeleteBtnClick = async (e) => {
    if (e.target.textContent === "Delete") {
      try {
        // Delete the task from the board on the server
        await deleteTaskFromBoard(board._id, colIndex, taskIndex);

        // Dispatch the deleteTask action to update the state (frontend) after deletion
        dispatch(boardsSlice.actions.deleteTask({ taskIndex, colIndex }));

        // Close the task and delete modals
        setIsTaskModalOpen(false);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Failed to delete task:", error);
        // Optionally, show an error message to the user here
      }
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className=" fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide 
      z-50 left-0 bottom-0 justify-center items-center flex dropdown bg-[#00000080]"
    >
      {/* MODAL SECTION */}

      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto 
       bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold 
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 
       rounded-xl"
      >
        <div className=" relative flex   justify-between w-full items-center">
          <h1 className=" text-lg">{task.title}</h1>

          <img
            onClick={() => {
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={ellipsis}
            alt="elipsis"
            className=" cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )}
        </div>
        <p className=" text-gray-500 font-[600] tracking-wide text-xs pt-6">
          {task.description}
        </p>

        <p className=" pt-6 text-gray-500 tracking-widest text-sm">
          Checklists ({completed} of {checklists.length})
        </p>

        {/* Checklists section */}

        <div className=" mt-3 space-y-2">
          {checklists.map((checklist, index) => {
            return (
              <Checklist
                index={index}
                taskIndex={taskIndex}
                colIndex={colIndex}
                key={index}
              />
            );
          })}
        </div>

        {/* Current Status Section */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 
            border-[1px] border-gray-300 focus:outline-[#EFBCD5] outline-none"
            value={status}
            onChange={onChange}
          >
            {columns.map((col, index) => (
              <option className=" dark:bg-[#2b2c37]" key={index}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modals */}

      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDeleteBtnClick={onDeleteBtnClick}
          type="task"
          title={task.title}
        />
      )}

      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setOpenAddEditTask={setIsAddTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default TaskModal;
