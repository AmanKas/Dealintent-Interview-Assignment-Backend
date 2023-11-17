import axios from "axios";

const API_BASE_URL = "https://atom-kanban-backend.vercel.app/"; // Replace this with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const saveBoardData = async (data) => {
  try {
    const response = await api.post("/api/boards", data);
    return response.data; // Return the created board data
  } catch (error) {
    throw error;
  }
};
export const fetchBoardsFromBackend = async () => {
  try {
    const response = await api.get("/api/boards");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteBoardById = async (boardId) => {
  try {
    const response = await api.delete(`/api/boards/${boardId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateBoardData = async (boardId, updatedData) => {
  try {
    const response = await api.put(`/api/boards/${boardId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addTaskToBoard = async (boardId, newColIndex, taskData) => {
  try {
    const response = await api.post(
      `/api/tasks/addTask/${boardId}/${newColIndex}`,
      taskData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const editTaskOnBoard = async (
  boardId,
  prevColIndex,
  newColIndex,
  taskIndex,
  taskData
) => {
  try {
    const response = await api.put(
      `/api/tasks/editTask/${boardId}/${prevColIndex}/${newColIndex}/${taskIndex}`,
      taskData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteTaskFromBoard = async (boardId, colIndex, taskIndex) => {
  try {
    const response = await api.delete(
      `/api/tasks/deleteTask/${boardId}/${colIndex}/${taskIndex}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const dragTaskOnBoard = async (boardId, dragData) => {
  try {
    const response = await api.put(`/api/tasks/dragTask/${boardId}`, dragData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const setChecklistCompletedOnBoard = async (
  boardId,
  colIndex,
  taskIndex,
  checklistIndex,
  isCompleted
) => {
  try {
    const response = await api.put(
      `/api/tasks/setChecklistCompleted/${boardId}/${colIndex}/${taskIndex}/${checklistIndex}`,
      { isCompleted }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const setTaskStatusOnBoard = async (
  boardId,
  colIndex,
  taskIndex,
  status,
  newColIndex
) => {
  try {
    const response = await api.put(
      `/api/tasks/setTaskStatus/${boardId}/${colIndex}/${taskIndex}`,
      { status, newColIndex }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
