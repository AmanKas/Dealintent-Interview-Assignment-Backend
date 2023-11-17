import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import minusIcon from "../assets/icon-minus.svg";
import { useDispatch, useSelector } from "react-redux";
import boardSlices, { fetchBoards } from "../redux/boardsSlice.js";
import { saveBoardData, updateBoardData } from "../redux/api.js";
import boardsSlice from "../redux/boardsSlice";

function AddEditBoardModal({ setBoardModalOpen, type }) {
  const dispatch = useDispatch();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newColumns, setNewColumns] = useState([
    { name: "Todo", tasks: [], _id: uuidv4() },
    { name: "In Process", tasks: [], _id: uuidv4() },
    { name: "Completed", tasks: [], _id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);

  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  if (type === "edit" && isFirstLoad) {
    setNewColumns(
      board.columns.map((col) => {
        return { ...col, _id: uuidv4() };
      })
    );
    setName(board.name);
    setDescription(board.description);
    setIsFirstLoad(false);
  }
  const validate = () => {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }

    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };
  const onChange = (_id, newValue) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col._id === _id);
      column.name = newValue;
      column.description = newValue;
      return newState;
    });
  };
  const onDelete = (_id) => {
    setNewColumns((prevState) => prevState.filter((el) => el._id !== _id));
  };

  const onsubmit = async (type) => {
    setBoardModalOpen(false);
    if (type === "add") {
      try {
        const newBoardData = await saveBoardData({
          name,
          description,
          isActive: false,
          columns: newColumns,
        });

        dispatch(boardsSlice.actions.addBoard(newBoardData));

        dispatch(fetchBoards());

        console.log("Board data saved:", newBoardData);
      } catch (error) {
        console.error("Failed to save board data:", error);
      }
    } else {
      try {
        const boardId = board._id;
        const updatedBoardData = await updateBoardData(boardId, {
          name,
          columns: newColumns,
        });

        dispatch(boardsSlice.actions.editBoard(updatedBoardData));
        dispatch(fetchBoards());

        console.log("Board data updated:", updatedBoardData);
      } catch (error) {
        console.error("Failed to update board data:", error);
      }
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setBoardModalOpen(false);
      }}
      className=" fixed right-0 left-0 top-0 bottom-0 px-2 py-4 scrollbar-hide overflow-scroll z-50 justify-center items-center flex bg-[#00000080] "
    >
      {/* Container */}
      <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2E294E] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className=" text-lg">
          {type === "edit" ? `Edit ${board.name}` : "Add New Board"}
        </h3>

        {/* tasks Name */}

        <div className=" mt-8 flex flex-col space-y-3">
          <label className=" text-sm dark:text-white text-gray-500">
            Board Name
          </label>
          <input
            className=" bg-transparent px-4 py-2 outline-none rounded-md text-sm border border-gray-600 focus:outline-[#EFBCD5] outline-1 ring-0"
            value={name}
            placeholder="Work Board"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        {/* Board Description */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-500">
            Board Description
          </label>
          <textarea
            className="bg-transparent px-4 py-2 outline-none rounded-md text-sm border border-gray-600 focus:outline-[#EFBCD5] outline-1 ring-0"
            value={description}
            placeholder="For work related tasks"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>

        {/* Board Columns */}

        <div className=" mt-8 flex flex-col space-y-3">
          <label className=" text-sm dark:text-white text-gray-500">
            Board Columns
          </label>
          {newColumns.map((column, index) => (
            <div className=" flex items-center w-full" key={index}>
              <input
                className=" bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#EFBCD5]"
                value={column.name}
                onChange={(e) => {
                  onChange(column._id, e.target.value);
                }}
                type="text"
              />
              <img
                src={minusIcon}
                className=" cursor-pointer m-4"
                onClick={() => {
                  onDelete(column._id);
                }}
              />
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={() => {
              setNewColumns((state) => [
                ...state,
                { name: "", tasks: [], _id: uuidv4() },
              ]);
            }}
            className=" w-full items-center hover:opacity-75 dark:text-[#EFBCD5] dark:bg-white text-white bg-[#EFBCD5] mt-2 py-2 rounded-full"
          >
            + Add New Column
          </button>

          <button
            className=" w-full items-center hover:opacity-75 dark:text-white dark:bg-[#EFBCD5] mt-8 relative text-white bg-[#EFBCD5] py-2 rounded-full"
            onClick={() => {
              const isValid = validate();
              if (isValid === true) onsubmit(type);
            }}
          >
            {type === "add" ? "Create New Board" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
