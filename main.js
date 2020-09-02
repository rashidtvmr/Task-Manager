var serverArray = {};
let serverCount = 0;
let addServerBtn = document.getElementById("add-server");
let serverContainer = document.getElementById("server-container");

// to initialize application with min one server
addServer(1);

addServerBtn.addEventListener("click", () => {
  if (
    Object.keys(serverArray).length < 10 &&
    serverArray[Object.keys(serverArray).length] === undefined
  ) {
    let serverCount = Object.keys(serverArray).length;
    addServer(serverCount);
  } else if (
    Object.keys(serverArray).length < 10 &&
    serverArray[Object.keys(serverArray).length + 1] === undefined
  ) {
    let serverCount = Object.keys(serverArray).length + 1;
    addServer(serverCount);
  } else if (
    Object.keys(serverArray).length < 10 &&
    serverArray[Object.keys(serverArray).length - 1] === undefined
  ) {
    let serverCount = Object.keys(serverArray).length - 1;
    addServer(serverCount);
  } else alert("server creation limit exceeded!!");
});

function addServer(serverCount) {
  //   let serverCount = Object.keys(serverArray).length + 1;
  //   if (Object.keys(serverArray).length < 10) {
  // serverCount++;
  serverArray[serverCount] = {
    count: Object.keys(serverArray).length,
    taskCount: 0,
    runningTaskQueue: [],
    taskTracker: "",
    isTaskRunning: false,
    isAllFinished: false,
    isRemovable: false,
  };
  serverContainer.innerHTML += `
        <div id="server-${serverCount}-container">
        <div class="" id="task-container">
        <label for="">Server ${serverCount}</label>
            <div id="task-${serverCount}-controller">
              <input type="number" value="1" id="task-count-${serverCount}"/>
              <button onclick="addTask(this)" class="btn-3 btn-1" id='add-task-btn-${serverCount}'>
                Add task
              </button>
            </div>
            <button class="btn-2 btn-1 remove-server-btn" id="remove-server-${serverCount}" onclick="removeServer(this)">Remove server</button>
            <div id="single-task-${serverCount}">
              
            </div>
          </div>
        </div>`;
  //   } else alert("server creation limit exceeded!!");
}

function removeServer(e) {
  let serverNumber = parseInt(e.id.split("-")[2]);
  if (Object.keys(serverArray).length > 1) {
    // serverCount--;
    if (serverArray[serverNumber].runningTaskQueue.length === 0) {
      delete serverArray[serverNumber];
      e.parentElement.remove();
    } else {
      serverArray[serverNumber].isRemovable = true;
    }
  }
}

function addTask(event) {
  let serverNumberForTask = event.id.split("-")[3];
  let taskCountField = document.getElementById(
    `task-count-${serverNumberForTask}`
  );
  if (taskCountField.value > 0)
    for (var i = 0; i < taskCountField.value; i++) {
      let currentTaskContainer = document.getElementById(
        `single-task-${serverNumberForTask}`
      );
      currentTaskContainer.innerHTML += `<div class="single-task-container" id="server-${serverNumberForTask}-task-${
        serverArray[serverNumberForTask].taskCount + 1
      }">
  <span  style="line-height:40px"><label for="">${
    serverArray[serverNumberForTask].taskCount + 1
  }.</label></span>
  <progress
  id="server-${serverNumberForTask}-progress-${
        serverArray[serverNumberForTask].taskCount + 1
      }"
  value="0"
  max="100"
  data-label="Waiting...."
  >
  </progress> <button class="dlt-btn" onclick='deleteTask(this)' id='${serverNumberForTask}-${
        serverArray[serverNumberForTask].taskCount + 1
      }'><span class="material-icons">delete</span></button>
  </div>`;
      serverArray[serverNumberForTask].taskCount++;
      serverArray[serverNumberForTask].runningTaskQueue.push(
        serverArray[serverNumberForTask].taskCount
      );
      runTask(serverNumberForTask);
    }
}

function runTask(serverNumber) {
  console.warn("Task running");
  if (!serverArray[serverNumber].isTaskRunning) {
    serverArray[serverNumber].isTaskRunning = true;
    let count = 0;
    let taskNumber = serverArray[serverNumber].runningTaskQueue[0];
    // if(taskNumber !== -1){
    let currentTask;
    serverArray[serverNumber].taskTracker = setInterval(() => {
      count++;
      currentTask = document.getElementById(
        `server-${serverNumber}-progress-${taskNumber}`
      );
      currentTask.parentElement.lastElementChild.disabled = true;
      currentTask.value = count * 2.5;
      let time = `00:${20 - Math.floor(count / 2)}`;
      currentTask.setAttribute("data-label", time);
      if (count === 20) {
        clearInterval(serverArray[serverNumber].taskTracker);
        count = 0;
        serverArray[serverNumber].runningTaskQueue.shift();
        serverArray[serverNumber].isTaskRunning = false;
        if (serverArray[serverNumber].runningTaskQueue.length === 0) {
          if (serverArray[serverNumber].isRemovable) {
            serverCount--;
            currentTask.parentElement.parentElement.parentElement.remove();
          }
          serverArray[serverNumber].isTaskRunning = true;
          serverArray[serverNumber].isAllFinished = true;
        }
        runTask(serverNumber);
      }
    }, 500);
    // }
  } else if (
    serverArray[serverNumber].runningTaskQueue.length > 0 &&
    serverArray[serverNumber].isAllFinished
  ) {
    console.warn("Task running after halt");
    serverArray[serverNumber].isAllFinished = false;
    serverArray[serverNumber].isTaskRunning = false;
    runTask(serverNumber);
  }
}

function deleteTask(e) {
  let serverNumber = e.id.split("-")[0];
  let taskNumber = e.id.split("-")[1];
  serverArray[serverNumber].runningTaskQueue = serverArray[
    serverNumber
  ].runningTaskQueue.filter((x) => x !== parseInt(taskNumber));
  document.getElementById(`server-${serverNumber}-task-${taskNumber}`).remove();
}
