var serverArray = {};
let serverCount = 0;
let addServerBtn = document.getElementById("add-server");
let removeServerBtn = document.getElementById("remove-server");
let serverContainer = document.getElementById("server-container");
removeServerBtn.disabled = "true";

addServer();

addServerBtn.addEventListener("click", () => {
  removeServerBtn.disabled = "";
  addServer();
});

removeServerBtn.addEventListener("click", () => {
  if (serverCount > 1) {
    delete serverArray[serverCount];
    serverCount--;
    console.log(serverArray);
    serverContainer.lastElementChild.remove();
    if (serverCount === 1) removeServerBtn.disabled = "true";
  }
  //   alert();
});

function addServer() {
  if (serverCount < 10) {
    serverCount++;
    serverArray[serverCount] = {
      count: serverCount,
      taskCount: 0,
      runningTaskQueue: [],
      taskTracker: "",
      isTaskRunning: false,
      isAllFinished: false,
    };
    // serverArray.push(serverCount);
    console.log(serverArray);
    serverContainer.innerHTML += `
        <div id="server-${serverCount}-container">
        <label for="">Server ${serverCount}</label>
          <label for=""></label>
          <div class="" id="task-container">
            <div id="task-${serverCount}-controller">
              <input type="number" value="1" id="task-count-${serverCount}"/>
              <button onclick="addTask(this)" class="btn-3 btn-1" id='add-task-btn-${serverCount}'>
                Add task
              </button>
            </div>
            <div id="single-task-${serverCount}">
              
            </div>
          </div>
        </div>`;
  } else alert("server creation limit exceeded!!");
}

function addTask(event) {
  let taskNumber = event.id.split("-")[3];
  let taskCountField = document.getElementById(`task-count-${taskNumber}`);
  for (var i = 0; i < taskCountField.value; i++) {
    let currentTaskContainer = document.getElementById(
      `single-task-${taskNumber}`
    );
    currentTaskContainer.innerHTML += `<div class="single-task-container" id="server-${taskNumber}-task-${
      serverArray[taskNumber].taskCount + 1
    }">
  <span  style="line-height:40px"><label for="">${
    serverArray[taskNumber].taskCount + 1
  }.</label></span>
  <progress
  id="server-${taskNumber}-progress-${serverArray[taskNumber].taskCount + 1}"
  value="0"
  max="100"
  data-label="Waiting...."
  >
  </progress> <button class="dlt-btn" onclick='deleteTask(this)' id='${serverCount}-${
      serverArray[taskNumber].taskCount + 1
    }'><span class="material-icons">delete</span></button>
  </div>`;
    serverArray[taskNumber].taskCount++;
    serverArray[taskNumber].runningTaskQueue.push(
      serverArray[taskNumber].taskCount
    );
    runTask(taskNumber);
  }
}

function runTask(serverNumber) {
  console.warn("Task running");

  if (!serverArray[serverNumber].isTaskRunning) {
    serverArray[serverNumber].isTaskRunning = true;
    let count = 0;
    let taskNumber = serverArray[serverNumber].runningTaskQueue[0];
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
          serverArray[serverNumber].isTaskRunning = true;
          serverArray[serverNumber].isAllFinished = true;
        }
        runTask(serverNumber);
      }
    }, 500);
  } else if (
    serverArray[serverNumber].runningTaskQueue.length > 0 &&
    serverArray[serverNumber].isAllFinished
  ) {
    // serverArray[serverNumber].isTaskRunning = false;
    serverArray[serverNumber].isAllFinished = false;
    serverArray[serverNumber].isTaskRunning = false;
    runTask(serverNumber);
  }
}

function deleteTask(e) {
  let serverNumber = e.id.split("-")[0];
  let taskNumber = e.id.split("-")[1];
  serverArray[serverNumber].runningTaskQueue.splice(
    0,
    serverArray[serverNumber].runningTaskQueue.indexOf(taskNumber)
  );

  console.log(
    serverArray[serverNumber].runningTaskQueue,
    "deled task",
    serverNumber,
    taskNumber
  );
  document.getElementById(`server-${serverNumber}-task-${taskNumber}`).remove();
}
