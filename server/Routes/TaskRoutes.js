import express from "express";
import Boards from "../Models/BoardsModel.js";

const taskRoutes = express.Router();

// Create Tasks
taskRoutes.post("/addTask/:boardId/:newColIndex", async (req, res) => {
  const { boardId, newColIndex } = req.params;
  const { title, status, description, checklists } = req.body;

  try {
    const board = await Boards.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const column = board.columns.find(
      (col, index) => index === Number(newColIndex)
    );
    if (!column) {
      return res.status(404).json({ message: "Target column not found." });
    }

    // Create the new task
    const task = {
      title,
      status,
      description,
      checklists,
    };

    column.tasks.push(task);

    await board.save();

    res.status(200).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add task to the board" });
  }
});
// Edit Tasks
taskRoutes.put(
  "/editTask/:boardId/:prevColIndex/:newColIndex/:taskIndex",
  async (req, res) => {
    const { boardId, prevColIndex, newColIndex, taskIndex } = req.params;
    const { title, status, description, checklists } = req.body;

    try {
      const board = await Boards.findById(boardId);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const prevColumn = board.columns.find(
        (col, index) => index === Number(prevColIndex)
      );
      if (!prevColumn) {
        return res.status(404).json({ message: "Previous column not found." });
      }

      const task = prevColumn.tasks.find(
        (task, index) => index === Number(taskIndex)
      );
      if (!task) {
        return res
          .status(404)
          .json({ message: "Task not found in the previous column." });
      }

      const updatedBoard = { ...board.toObject() };

      updatedBoard.columns[prevColIndex].tasks.splice(taskIndex, 1);

      if (prevColIndex !== newColIndex) {
        updatedBoard.columns[newColIndex].tasks.push({
          ...task.toObject(),
          title,
          status,
          description,
          checklists,
        });
      } else {
        updatedBoard.columns[prevColIndex].tasks.splice(taskIndex, 0, {
          ...task.toObject(),
          title,
          status,
          description,
          checklists,
        });
      }

      await Boards.findByIdAndUpdate(boardId, updatedBoard, { new: true });

      res.status(200).json(updatedBoard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to edit task on the board" });
    }
  }
);
// Delete Tasks
taskRoutes.delete(
  "/deleteTask/:boardId/:colIndex/:taskIndex",
  async (req, res) => {
    const { boardId, colIndex, taskIndex } = req.params;

    try {
      const board = await Boards.findById(boardId);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const column = board.columns.find(
        (col, index) => index === Number(colIndex)
      );
      if (!column) {
        return res.status(404).json({ message: "Column not found." });
      }

      if (taskIndex >= column.tasks.length) {
        return res
          .status(404)
          .json({ message: "Task not found in the column." });
      }

      // Remove the task from the column's tasks array
      column.tasks.splice(taskIndex, 1);

      // Save the updated board to the database
      await board.save();

      res.status(200).json(board);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete task from the board" });
    }
  }
);
// Drag Tasks
taskRoutes.put("/dragTask/:boardId", async (req, res) => {
  const { boardId } = req.params;
  const { colIndex, prevColIndex, taskIndex } = req.body;

  try {
    const board = await Boards.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const prevColumn = board.columns.find(
      (col, index) => index === Number(prevColIndex)
    );
    if (!prevColumn) {
      return res.status(404).json({ message: "Previous column not found." });
    }

    const task = prevColumn.tasks.find(
      (task, index) => index === Number(taskIndex)
    );
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found in the previous column." });
    }

    const updatedBoard = { ...board.toObject() };

    updatedBoard.columns[prevColIndex].tasks.splice(taskIndex, 1);

    updatedBoard.columns[colIndex].tasks.push(task);

    await Boards.findByIdAndUpdate(boardId, updatedBoard, { new: true });

    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to drag task on the board" });
  }
});
// Set Checklist isCompleted
taskRoutes.put(
  "/setChecklistCompleted/:boardId/:colIndex/:taskIndex/:checklistIndex",
  async (req, res) => {
    const { boardId, colIndex, taskIndex, checklistIndex } = req.params;

    try {
      const board = await Boards.findById(boardId);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const col = board.columns.find((col, i) => i === Number(colIndex));
      if (!col) {
        return res.status(404).json({ message: "Column not found" });
      }

      const task = col.tasks.find((task, i) => i === Number(taskIndex));
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const checklist = task.checklists.find(
        (checklist, i) => i === Number(checklistIndex)
      );
      if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" });
      }

      checklist.isCompleted = !checklist.isCompleted;

      await board.save();

      res.status(200).json(board);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to set checklist completed on the board" });
    }
  }
);
// Set Task Status
taskRoutes.put(
  "/setTaskStatus/:boardId/:colIndex/:taskIndex",
  async (req, res) => {
    const { boardId, colIndex, taskIndex } = req.params;
    const { status, newColIndex } = req.body;

    try {
      const board = await Boards.findById(boardId);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const prevColumn = board.columns.find(
        (col, index) => index === Number(colIndex)
      );
      if (!prevColumn) {
        return res.status(404).json({ message: "Previous column not found." });
      }

      const task = prevColumn.tasks.find(
        (task, index) => index === Number(taskIndex)
      );
      if (!task) {
        return res
          .status(404)
          .json({ message: "Task not found in the previous column." });
      }

      const updatedBoard = { ...board.toObject() };

      updatedBoard.columns[colIndex].tasks.splice(taskIndex, 1);

      if (colIndex !== newColIndex) {
        updatedBoard.columns[newColIndex].tasks.push({
          ...task.toObject(),
          status,
        });
      } else {
        updatedBoard.columns[colIndex].tasks.splice(taskIndex, 0, {
          ...task.toObject(),
          status,
        });
      }

      await Boards.findByIdAndUpdate(boardId, updatedBoard, { new: true });

      res.status(200).json(updatedBoard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to set task status" });
    }
  }
);

export default taskRoutes;
