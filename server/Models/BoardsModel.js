import mongoose from "mongoose";

const ChecklistSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  isCompleted: {
    type: Boolean,
    require: true,
  },
  _id: { type: String, required: true },
});

const TaskSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  status: {
    type: String,
    require: true,
  },
  checklists: [ChecklistSchema],
});

const ColumnSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  tasks: [TaskSchema],
  _id: { type: String, required: true },
});

const BoardSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  isActive: {
    type: Boolean,
    require: true,
  },
  columns: [ColumnSchema],
});

const Boards = mongoose.model("Boards", BoardSchema);

export default Boards;
