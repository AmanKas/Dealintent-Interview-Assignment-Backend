import React, { useState } from "react";
import logo from "../assets/logo-light.svg";
import iconDown from "../assets/icon-chevron-down.svg";
import iconUp from "../assets/icon-chevron-up.svg";
import ellipsis from "../assets/icon-vertical-ellipsis.svg";
import HeaderDropdown from "./HeaderDropdown";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import { useDispatch, useSelector } from "react-redux";
import AddEditTaskModal from "../modals/AddEditTaskModal";
import EllipsisMenu from "./EllipsisMenu";
import DeleteModal from "../modals/DeleteModal";
import boardsSlice, { fetchBoards } from "../redux/boardsSlice";
import { deleteBoardById } from "../redux/api";

function Header({}) {
  const dispatch = useDispatch();

  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openAddEditTask, setOpenAddEditTask] = useState(false);
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const [boardType, setBoardType] = useState("");
  

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const boardDescription = board.description;

  const onDropdownClick = () => {
    setOpenDropdown((state) => !state);
    setIsEllipsisOpen(false);
    setBoardType("add");
  };
  const setOpenEditModal = () => {
    setBoardModalOpen(true);
    setIsEllipsisOpen(false);
  };
  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsEllipsisOpen(false);
  };
  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      const boardId = board._id;
      dispatch(boardsSlice.actions.deleteBoard());
      dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
      try {
        deleteBoardById(boardId);
        console.log(`Board ${board.name} is correctly delete`);
      } catch (e) {
        console.log(`Board not delete`);
      }
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className=" p-4 fixed left-0 bg-white dark:bg-[#240046] z-50 right-0 ">
      <header className=" flex justify-between dark:text-white items-center">
        {/* Left Side */}
        <div className=" flex items-center space-x-2 md:space-x-4">
          <img src={logo} alt="logo" className=" h-12 w-12 mt-1" />
          <h3 className=" hidden md:inline-block font-bold font-sans md:text-3xl">
            Atom-KB
          </h3>
          <div className=" flex items-center">
            <h3 className=" truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans">
              {board.name}
            </h3>
            {boardDescription && ( // Display description if available
              <p className="block bg-gradient-to-tr from-blue-600 to-pink-200 bg-clip-text font-sans text-2xl font-semibold leading-tight tracking-normal text-transparent antialiased">
                -{boardDescription}
              </p>
            )}
            <img
              src={openDropdown ? iconUp : iconDown}
              alt="dropdown icon"
              className=" w-3 ml-2 md:hidden cursor-pointer"
              onClick={onDropdownClick}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className=" flex space-x-4 items-center md:space-x-6">
          <button
            onClick={() => {
              setOpenAddEditTask((state) => !state);
            }}
            className="hidden md:block button bg-[#EFBCD5]"
          >
            + Add New Task
          </button>

          <button
            onClick={() => {
              setOpenAddEditTask((state) => !state);
            }}
            className=" button py-1 px-3 md:hidden"
          >
            +
          </button>
          <img
            src={ellipsis}
            alt="ellipsis"
            onClick={() => {
              setBoardType("edit");
              setOpenDropdown(false);
              setIsEllipsisOpen((prevState) => !prevState);
            }}
            className=" cursor-pointer h-6 "
          />

          {isEllipsisOpen && (
            <EllipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Boards"
            />
          )}
        </div>
      </header>
      {openDropdown && (
        <HeaderDropdown
          setBoardModalOpen={setBoardModalOpen}
          setOpenDropdown={setOpenDropdown}
        />
      )}

      {boardModalOpen && (
        <AddEditBoardModal
          type={boardType}
          setBoardModalOpen={setBoardModalOpen}
        />
      )}

      {openAddEditTask && (
        <AddEditTaskModal
          setOpenAddEditTask={setOpenAddEditTask}
          device="mobile"
          type="add"
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDeleteBtnClick={onDeleteBtnClick}
          title={board.name}
          type="Board"
        />
      )}
    </div>
  );
}

export default Header;
