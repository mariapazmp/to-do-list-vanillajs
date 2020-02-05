window.onload = function() {
    document.querySelector(".task-create__add").addEventListener("click", function (e) {
        e.preventDefault();
        init();
    });

    document.querySelector(".tasks-list__tasks ul").addEventListener("click", function(e) {
        tickTask(e);
        editableMode(e);
    });
};

let tasksList = [];

function init() {
    let taskInput = document.getElementById("task-create__input").value;
    if (taskInput != "") {
        addNewTask(taskInput);
        document.querySelector(".tasks-list__no-results").classList.remove("active");
        document.querySelector(".tasks-list__results").classList.add("active");
    }
}

function tickTask(e) {
    if (e.target && e.target.matches("i.fa-circle")) {
        e.target.className = "far fa-dot-circle";
        disableOptions(false);
    } else if (e.target && e.target.matches("i.fa-dot-circle")) {
        e.target.className = "far fa-circle";
        disableOptions(true);
    }
}

function editableMode(checkbox) {
    let options = document.querySelector(".tasks-list__options");
    let editableTask = checkbox.target.closest(".task-item");

    editableTask.classList.toggle("checked");
    options.addEventListener("click", function (e) {
        let editableTaskId = document.querySelector(".task-item.checked .task-item__id").textContent;

        if (e.target && e.target.matches("button.edit")) {
            modal(parseInt(editableTaskId), "edit");
        } else if (e.target && e.target.matches("button.delete")) {
            modal(parseInt(editableTaskId), "delete");
        }
    });
}

function disableOptions(state) {
    let optionsButtons = document.querySelectorAll(".tasks-list__options button");
    for(let i = 0; i < optionsButtons.length; i++) {
        optionsButtons[i].disabled = state;
    }
}

function addNewTask(description) {
    tasksList.push({
        id: tasksList.length+1,
        description: description,
        deadline: "",
        priority: ""
    });

    let newLi = document.createElement("li");
    newLi.className = "task-item";
    newLi.innerHTML = "<a class='task-item__checkbox'><i class='far fa-circle'></i></a><div class='task-item__title'>"+description+"</div><div class='task-item__deadline'>-- -- --</div><div class='task-item__priority'>---</div><div class='task-item__id'>"+tasksList.length+"</div>";
    document.querySelector(".tasks-list__tasks ul").appendChild(newLi);
}

function modal(taskId, mode) {
    let modalClass = "modal__"+mode+"-task";
    document.querySelector("."+modalClass).className = modalClass+" active";

    let modal = document.getElementById("global-modal");
    let span = document.getElementsByClassName("modal__close")[0];
    modal.style.display = "block";

    span.onclick = function() {
        closeModal();
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    if (mode === "edit") {
        editTask(taskId)
    } else if (mode === "delete") {
        deleteTask(taskId)
    }
}

function editTask(taskId) {
    let currentTask = tasksList.find(obj => obj.id === taskId);
    document.querySelector(".edit-description").value = currentTask.description;
    document.querySelector(".edit-deadline").value = currentTask.deadline;
    document.querySelector(".edit-priority").value = currentTask.priority;

    document.querySelector(".edit-button-done").addEventListener('click', function (e) {
        e.preventDefault();
        tasksList.forEach(function (element){
            if (element.id === taskId) {
                element.description = document.querySelector(".edit-description").value;
                element.deadline = document.querySelector(".edit-deadline").value;
                element.priority = document.querySelector(".edit-priority").value;

                updateBoard(element);
            }
        });
        closeModal();
    });
}

function updateBoard(taskEdited) {
    document.querySelector(".task-item.checked .task-item__title").textContent = taskEdited.description;
    document.querySelector(".task-item.checked .task-item__deadline").textContent = taskEdited.deadline;
    document.querySelector(".task-item.checked .task-item__priority").textContent = taskEdited.priority;
    document.querySelector(".task-item.checked .task-item__priority").className = "task-item__priority task-item__priority--"+taskEdited.priority.toLowerCase();

    document.querySelector(".fa-dot-circle").className = "far fa-circle";
    document.querySelector(".task-item.checked").className = "task-item";
    disableOptions(true);
}

function deleteTask(taskId) {
    document.querySelector("button.delete-confirm").addEventListener('click', function (e) {
        tasksList.splice(taskId-1, 1);
        document.querySelector(".task-item.checked").remove();
        disableOptions(true);
        closeModal();

        if (tasksList.length === 0) {
            document.querySelector(".tasks-list__no-results").classList.add("active");
            document.querySelector(".tasks-list__results").classList.remove("active");
        }
    });
    document.querySelector("button.delete-cancel").addEventListener('click', function (e) {
        closeModal();
    });
}

function closeModal() {
    document.getElementById("global-modal").style.display = "none";
    document.querySelector(".modal__delete-task").className = "modal__delete-task";
    document.querySelector(".modal__edit-task").className = "modal__edit-task";
}