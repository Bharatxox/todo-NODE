const path = require("path");
const fs = require("fs");
const readline = require("readline");

const taskFilePath = path.join(__dirname, "task.json");

//ensure the file is exists

if (!fs.existsSync(taskFilePath)) {
  console.log("Task file does not exist creating...");
  fs.writeFileSync(taskFilePath, "[]");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getMyTasks = () => {
  const tasks = fs.readFileSync(taskFilePath, "utf8");
  return JSON.parse(tasks);
};

const saveMyTasks = (tasks) => {
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks));
};

const addTask = (task) => {
  const tasks = getMyTasks();
  tasks.push({ description: task, completed: false });
  saveMyTasks(tasks);
  console.log("task succesfully added");
};

const listTasks = () => {
  const tasks = getMyTasks();
  tasks.forEach((task, index) => {
    console.log(
      `${index + 1}. ${task.description} -[${task.completed ? "x" : " "}]`
    );
  });
};

const completedTasks = (taskNo) => {
  const tasks = getMyTasks();
  if (tasks[taskNo - 1]) {
    tasks[taskNo - 1].completed = true;
    saveMyTasks(tasks);
  } else {
    console.log("invalid task number");
  }
  return;
};

const deleteTask = (taskNo) => {
  const tasks = getMyTasks();
  if (tasks[taskNo - 1]) {
    const filteredTasks = tasks.filter((task, index) => index !== taskNo - 1);
    saveMyTasks(filteredTasks);
    console.log("Task deleted successfully");
  } else {
    console.log("Invalid task number");
  }
  return;
};

const moveTaskToTxt = () => {
  const tasks = getMyTasks();
  fs.writeFileSync(path.join(__dirname, "tasks.txt"), "");
  tasks.forEach((task, index) => {
    fs.appendFileSync(
      path.join(__dirname, "tasks.txt"),
      `${index + 1}. ${task.description} - ${task.completed ? "yes" : "no"}\n`
    );
  });
};

function todoManager() {
  rl.question(
    `
    what would you like to do ?
    1. Add a task
    2. List all tasks
    3. Mark task as completed
    4. Delete Task
    5. Exit

    `,
    (answer) => {
      switch (answer) {
        case "1":
          rl.question("Enter your task: ", (task) => {
            addTask(task);
            todoManager();
          });
          break;
        case "2":
          listTasks();
          todoManager();
          break;
        case "3":
          rl.question(
            "Enter the task number you want to complete: ",
            (taskNo) => {
              completedTasks(+taskNo); // string number into number
              todoManager();
            }
          );
          break;
        case "4":
          rl.question(
            "Enter the task number you want to delete: ",
            (taskNo) => {
              deleteTask(+taskNo); // string number into number
              todoManager();
            }
          );
          break;
        case "5":
          moveTaskToTxt();
          rl.close();
          break;
        default:
          console.log("INVALID OPTION");
          todoManager();
      }
    }
  );
}
todoManager();
