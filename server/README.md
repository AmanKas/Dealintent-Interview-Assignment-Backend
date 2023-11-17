# Server Folder

This folder contains the backend server code for the project. It is built using Node.js, Express.js, and MongoDB to handle data storage and retrieval.

## Getting Started

To run the server locally, follow these steps:

1. Install Node.js and MongoDB on your system.
2. Clone the repository to your local machine.
3. Navigate to the server folder in the terminal.
4. Install the dependencies by running: `npm install`
5. Start the server using: `npm start`
6. The server will run on `http://localhost:1000`, unless a different port is specified.
7. Connect your MongoDB database in your app.

## Folder Structure

The server folder has the following structure:

- `server.js`: The main server file that sets up the Express app and starts the server.
- `MongoDb.js`: Contains the MongoDB connection code to establish a connection to the database (change "MONGO_URL" with your url).
- `Routes/BoardRoutes.js`: Defines the API routes for managing boards.
- `Routes/TaskRoutes.js`: Defines the API routes for managing tasks.
- `Models/BoardsModel.js`: Defines the Mongoose schema for boards and tasks.

## API Endpoints

The following API endpoints are available:

### Boards

- `GET /api/boards`: Get all boards.
- `POST /api/boards`: Create a new board.
- `DELETE /api/boards/:id`: Delete a board by ID.
- `PUT /api/boards/:id`: Update a board by ID.

### Tasks

- `POST /api/tasks/addTask/:boardId/:newColIndex`: Add a new task to a board.
- `PUT /api/tasks/editTask/:boardId/:prevColIndex/:newColIndex/:taskIndex`: Edit a task on a board.
- `DELETE /api/tasks/deleteTask/:boardId/:colIndex/:taskIndex`: Delete a task from a board.
- `PUT /api/tasks/dragTask/:boardId`: Drag a task to a different column on a board.
- `PUT /api/tasks/setChecklistCompleted/:boardId/:colIndex/:taskIndex/:checklistIndex`: Set a checklist item's completion status on a task.
- `PUT /api/tasks/setTaskStatus/:boardId/:colIndex/:taskIndex`: Set the status of a task on a board.
