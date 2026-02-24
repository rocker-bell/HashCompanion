// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {

    // Enum to represent the status of the to-do item
    enum Status { Active, Completed, Expired }

    // Struct for a single Todo item
    struct Todo {
        string title;
        string description;
        uint256 dueDate; // Timestamp
        Status status;
    }

    // Mapping of Todo ID to Todo struct
    mapping(uint256 => Todo) public todos;

    // Variable to keep track of the number of todos
    uint256 public todoCount;

    // Event to log when a new todo is added
    event TodoAdded(uint256 todoId, string title, string description, uint256 dueDate);
    // Event to log when a todo status is changed
    event TodoStatusChanged(uint256 todoId, Status status);

    // Function to add a new Todo
    function addTodo(
        string memory _title,
        string memory _description,
        uint256 _dueDate
    ) public {
        // Increment todoCount to assign a new unique ID
        todoCount++;

        // Create a new Todo struct and save it to the mapping
        todos[todoCount] = Todo({
            title: _title,
            description: _description,
            dueDate: _dueDate,
            status: Status.Active // Default status is Active
        });

        // Emit the event for a new Todo being added
        emit TodoAdded(todoCount, _title, _description, _dueDate);
    }

    // Function to mark a Todo as completed
    function completeTodo(uint256 _todoId) public {
        require(_todoId > 0 && _todoId <= todoCount, "Todo does not exist.");

        // Ensure that the Todo is not expired
        require(todos[_todoId].status != Status.Expired, "Todo is expired and cannot be completed.");

        // Change the status of the Todo
        todos[_todoId].status = Status.Completed;

        // Emit event when the status changes
        emit TodoStatusChanged(_todoId, Status.Completed);
    }

    // Function to check if a Todo has timed out (due date passed)
    function checkTimeout(uint256 _todoId) public {
        require(_todoId > 0 && _todoId <= todoCount, "Todo does not exist.");

        // Fetch the Todo
        Todo storage todo = todos[_todoId];

        // Check if the due date has passed and if the status is still active
        if (todo.dueDate < block.timestamp && todo.status == Status.Active) {
            // Update the status to Expired if due date has passed
            todo.status = Status.Expired;

            // Emit event for expiration
            emit TodoStatusChanged(_todoId, Status.Expired);
        }
    }

    // Function to get the details of a Todo
    function getTodo(uint256 _todoId) public view returns (
        string memory title,
        string memory description,
        uint256 dueDate,
        Status status
    ) {
        require(_todoId > 0 && _todoId <= todoCount, "Todo does not exist.");
        
        Todo memory todo = todos[_todoId];
        return (todo.title, todo.description, todo.dueDate, todo.status);
    }

    // Function to get the count of total todos
    function getTotalTodos() public view returns (uint256) {
        return todoCount;
    }

    // Optional function to get the status as string (for front-end display)
    function getStatusAsString(Status _status) public pure returns (string memory) {
        if (_status == Status.Active) {
            return "Active";
        } else if (_status == Status.Completed) {
            return "Completed";
        } else {
            return "Expired";
        }
    }
}