import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import minusIcon from "../assets/icon-minus.svg";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice, { fetchBoards } from "../redux/boardsSlice";
import { addTaskToBoard, editTaskOnBoard } from "../redux/api";

function AddEditTaskModal({
  type,
  device,
  setOpenAddEditTask,
  taskIndex,
  prevColIndex = 0,
}) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [checklists, setChecklists] = useState([
    { title: "", isCompleted: false, _id: uuidv4() },
  ]);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [isValid, setIsValid] = useState(true);

  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );
  const columns = board.columns;
  const col = columns.find((col, index) => index === prevColIndex);
  const task = col ? col.tasks.find((task, i) => i === taskIndex) : [];

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [status, setStatus] = useState(columns[prevColIndex].name);

  if (type === "edit" && isFirstLoad) {
    setChecklists(
      task.checklists.map((checklist) => {
        return { ...checklist, _id: uuidv4() };
      })
    );
    setTitle(task.title);
    setDescription(task.description);
    setIsFirstLoad(false);
  }
  const onChange = (_id, newValue) => {
    setChecklists((prevState) => {
      const newState = [...prevState];
      const checklist = newState.find((checklist) => checklist._id === _id);
      checklist.title = newValue;
      return newState;
    });
  };
  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };
  const onDelete = (_id) => {
    setChecklists((prevState) => prevState.filter((el) => el._id !== _id));
  };
  const validate = () => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }

    for (let i = 0; i < checklists.length; i++) {
      if (!checklists[i].title.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };
  const onSubmit = async (type) => {
    if (type === "add") {
      const isValid = validate();
      if (!isValid) {
        return;
      }
      const newTaskData = {
        title,
        description,
        checklists,
        status,
      };

      try {
        dispatch(
          boardsSlice.actions.addTask({
            title,
            description,
            checklists,
            status,
            newColIndex,
          })
        );
        addTaskToBoard(board._id, newColIndex, newTaskData);

        // Close the modal
        setOpenAddEditTask(false);
      } catch (error) {
        console.error("Failed to add task to board:", error);
      }
    } else {
      const updatedTaskData = {
        title,
        description,
        checklists,
        status,
      };
      try {
        dispatch(
          boardsSlice.actions.editTask({
            title,
            description,
            checklists,
            status,
            taskIndex,
            prevColIndex,
            newColIndex,
          })
        );

        await editTaskOnBoard(
          board._id,
          prevColIndex,
          newColIndex,
          taskIndex,
          updatedTaskData
        );

        setOpenAddEditTask(false);
      } catch (error) {
        console.error("Failed to edit task:", error);
      }
    }
  };

  return (
    <div
      className={
        device === "mobile"
          ? "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 bg-[#00000080]"
          : "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 right-0 bottom-0 top-0 bg-[#00000080]"
      }
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenAddEditTask(false);
      }}
    >
      {/* Container */}
      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2E294E]
       text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full 
       px-8 py-8 rounded-xl"
      >
        <h3 className=" text-lg">
          {type === "edit" ? "Edit" : "Add New"} Task
        </h3>

        {/* Task Name */}
        <div className=" mt-8 flex flex-col space-y-1">
          <label className=" text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input
            value={title}
            placeholder="Google Interview"
            onChange={(e) => setTitle(e.target.value)}
            className=" bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm 
            border border-gray-600 focus:outline-[#EFBCD5] ring-0"
            type="text"
          />
        </div>

        {/* Description */}
        <div className=" mt-8 flex flex-col space-y-1">
          <label className=" text-sm dark:text-white text-gray-500">
            Description
          </label>
          <textarea
            value={description}
            placeholder="Round 2 Technical Interview with Google for SDE-1"
            onChange={(e) => setDescription(e.target.value)}
            className=" bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm 
             min-h-[200px] border border-gray-600 focus:outline-[#EFBCD5] ring-0"
          />
        </div>

        {/* Checklist */}
        <div className=" mt-8 flex flex-col space-y-1">
          <label className=" text-sm dark:text-white text-gray-500">
            Checklists items
          </label>

          {checklists.map((checklist, index) => {
            return (
              <div key={index} className=" flex items-center w-full">
                <input
                  onChange={(e) => {
                    onChange(checklist._id, e.target.value);
                  }}
                  placeholder="Add at least one task"
                  type="text"
                  value={checklist.title}
                  className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 
                  rounded-md text-sm border border-gray-600 focus:outline-[#EFBCD5]"
                />
                <img
                  src={minusIcon}
                  className=" cursor-pointer m-4"
                  onClick={() => {
                    onDelete(checklist._id);
                  }}
                />
              </div>
            );
          })}

          <button
            onClick={() => {
              setChecklists((state) => [
                ...state,
                { title: "", isCompleted: false, _id: uuidv4() },
              ]);
            }}
            className=" w-full items-center hover:opacity-75 dark:text-[#EFBCD5] dark:bg-white 
            text-white bg-[#EFBCD5] mt-2 py-2 rounded-full"
          >
            + Add New Checklists
          </button>
        </div>

        {/* Current Column */}
        <div className=" mt-8 flex flex-col space-y-3">
          <label className=" text-sm dark:text-white text-gray-500">
            Current Column
          </label>
          <select
            onChange={(e) => onChangeStatus(e)}
            value={status}
            className=" select-column flex-grow px-4 py-2 rounded-md text-sm bg-transparent 
          focus:border-0  border-[1px] border-gray-300 focus:outline-[#EFBCD5] outline-none 
          dark:bg-[#2E294E]"
          >
            {columns.map((column, index) => (
              <option value={column.name} key={index}>
                {column.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                setOpenAddEditTask(false);
              }
            }}
            className=" w-full items-center text-white bg-[#EFBCD5] py-2 rounded-full"
          >
            {type === "edit" ? "Save Edit" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditTaskModal;
