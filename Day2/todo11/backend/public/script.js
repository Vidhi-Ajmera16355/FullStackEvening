document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("input-box");
  const listContainer = document.getElementById("calendar");
  const completedCounter = document.getElementById("completed-counter");
  const uncompletedCounter = document.getElementById("uncompleted-counter");
  const taskDate = document.getElementById("task-date");

  // Update counters for completed and uncompleted tasks
  function updateCounters() {
    const completedTasks = document.querySelectorAll(".task.completed").length;
    const totalTasks = document.querySelectorAll(".task").length;
    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = totalTasks - completedTasks;
  }

  // Render the calendar with clickable days
  function renderCalendar() {
    const daysInMonth = 31; // For October example
    const calendar = document.getElementById("calendar");

    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.className = "day";
      day.innerHTML = `<span>${i}</span><div class="task-list"></div>`;
      calendar.appendChild(day);

      // Toggle task list visibility on day click
      day.addEventListener("click", function () {
        document.querySelectorAll(".selected-date").forEach((el) => {
          el.classList.remove("selected-date");
        });
        day.classList.add("selected-date");

        const taskList = day.querySelector(".task-list");
        if (taskList.children.length === 0) {
          alert(`No tasks on day ${i}`);
        } else {
          taskList.style.display =
            taskList.style.display === "block" ? "none" : "block";
        }
      });
    }
  }

  // Add a task to the selected date
  window.addTask = function () {
    const task = inputBox.value.trim();
    const date = taskDate.value;

    if (!task || !date) {
      alert("Please enter a task and select a date.");
      return;
    }

    const day = new Date(date).getDate();
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.innerHTML = `
          <span>${task}</span>
          <button class="complete-btn">✓</button>
          <button class="delete-btn">✗</button>
        `;

    const dayBox = document.querySelectorAll(".day")[day - 1];
    const taskList = dayBox.querySelector(".task-list");

    // Check if taskList is valid before appending task
    if (taskList) {
      taskList.appendChild(taskElement);
    }

    // Add "task-date" class to highlight days with tasks
    dayBox.classList.add("task-date");

    inputBox.value = "";
    taskDate.value = "";

    // Add functionality for marking tasks as complete
    const completeBtn = taskElement.querySelector(".complete-btn");
    const deleteBtn = taskElement.querySelector(".delete-btn");

    completeBtn.addEventListener("click", function () {
      taskElement.classList.toggle("completed");
      updateCounters();
    });

    // Add functionality for deleting tasks
    deleteBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to delete this task?")) {
        taskElement.remove();
        updateCounters();
      }
    });

    updateCounters();
  };

  renderCalendar();
});
