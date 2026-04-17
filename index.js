const checkbox = document.querySelector("input.check");
const title = document.querySelector(".title");
const priorityBadge = document.querySelector(".priority");
const priorityIndicator = document.querySelector(".priority-indicator");
const description = document.querySelector(".desc");
const descriptionToggle = document.querySelector(".toggle-desc");
const descriptionCont = document.querySelector(".desc-container");
const timeCont = document.querySelector(".time time");
const remainingTime = document.querySelector(
	".time_remaining span.time-remaining-indicator",
);
const overdueIndicator = document.querySelector(
	".time_remaining span.overdue-indicator",
);

const statusCont = document.querySelector(".status-cont");
const statusList = Array.from(document.querySelectorAll("#status-list li"));
const statusBadge = document.querySelector(".status");
const statusItems = ["pending", "in progress", "done"];

const editButton = document.querySelector(".edit");
const deleteButton = document.querySelector(".delete");

const titleInput = document.querySelector(".edit-title");
const descInput = document.querySelector(".edit-desc");
const dateInput = document.querySelector(".edit-due-date");
const timeInput = document.querySelector(".edit-due-time");
const editPriorityContainer = document.querySelector(".edit-priority");
const priorityInputDisplay = document.querySelector(".edit-priority-display");
const priorityInputList = document.querySelector(".priority-list");
const priorityOptions = Array.from(
	document.querySelectorAll(".priority-list li"),
);

const priorityItems = ["high", "medium", "low"];

const rootCard = document.querySelector("article.root");
const editCard = document.querySelector("article.edit");

const saveEdit = document.querySelector(".save-btn");
const cancelEdit = document.querySelector(".cancel-btn");

const form = document.querySelector("form");

let taskInfo = {
	title: "Complete Stage 0 Task",
	desc: "Code a modern todo / task card component with semantic html tags, screen reader accessible elements and time remaining indicator",
	priority: "medium",
	status: "pending",
	"due-date": new Date(Date.now() + 10000), //5 minutes from current time
	complete: false,
};

let isLong = taskInfo.desc.length > 150 || taskInfo.desc.split("\n").length > 3;

if (isLong) {
	descriptionCont.classList.add("collapsed");
}

function buildComponent() {
	checkbox.checked = taskInfo.complete;
	title.textContent = taskInfo.title;
	description.textContent = taskInfo.desc;
	statusBadge.textContent = taskInfo.status;
	statusBadge.className = `status badge ${taskInfo.status == "in progress" ? "progress" : taskInfo.status.toLowerCase()}`;

	descriptionToggle.style.display = isLong ? "block" : "none";

	priorityBadge.textContent = taskInfo.priority;
	priorityBadge.className = `priority badge ${taskInfo.priority}`;
	priorityIndicator.className = `priority-indicator  ${taskInfo.priority}`;
	timeCont.setAttribute("datetime", taskInfo["due-date"].toISOString());
	timeCont.textContent = taskInfo["due-date"].toLocaleDateString("en-US", {
		day: "numeric",
		year: "numeric",
		month: "long",
		hour: "2-digit",
		minute: "2-digit",
	});
}

buildComponent();

// Toggle checkbox
checkbox.addEventListener("change", (event) => {
	taskInfo.complete = checkbox.checked;

	if (taskInfo.complete) {
		taskInfo.status = "Done";
		clearInterval(timer);
		msg = "Completed";
		remainingTime.style.display = "block";
		overdueIndicator.style.display = "none";
		remainingTime.textContent = msg;
	} else {
		taskInfo.status = "pending";
		timer = setInterval(checkRemaining, 60000);
		checkRemaining();
	}
	buildComponent();
});

title.addEventListener("click", () => {
	checkbox.click();
});

statusBadge.addEventListener("click", () => {
	const isOpen = statusCont.classList.contains("open");
	statusCont.classList.toggle("open");
	statusCont.setAttribute("aria-expanded", !isOpen);

	if (!isOpen) {
		statusList.forEach((itm) => {
			itm.setAttribute("tabindex", "0");
		});
		statusList[0].focus();
	} else {
		statusList.forEach((itm) => {
			itm.setAttribute("tabindex", "-1");
		});
	}
});

statusBadge.addEventListener("keydown", (e) => {
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		statusBadge.click();
	}
});

let status = taskInfo.status;
statusList.forEach((itm, id) => {
	itm.addEventListener("click", () => {
		let prevStat = status;

		status = statusItems[id];

		taskInfo.status = status;

		statusBadge.click();

		if (status === "done") {
			checkbox.checked = true;
		} else {
			checkbox.checked = false;
		}

		checkbox.dispatchEvent(new Event("change"));

		statusCont.classList.remove("open");
		statusCont.setAttribute("aria-expanded", "false");
		buildComponent();
	});

	itm.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			itm.click();
		}
	});
});

function updateTimerMsg(timeRemaining) {
	let msg, amount, unit;
	let units = ["day", "hour", "minute"];

	for (let i = 0; i < timeRemaining.length - 1; i++) {
		if (timeRemaining[i] != 0) {
			amount = timeRemaining[i];
			unit = units[i];
			break;
		}
		amount = 0;
	}

	if (amount == 0) {
		msg = "Due now!";
	} else if (!timeRemaining[3]) {
		msg = `Overdue by ${amount} ${unit}${amount == 1 ? "" : "s"}`;
	} else {
		msg =
			amount == 1 && unit == "day"
				? "Due Tomorrow"
				: `Due in ${amount} ${unit}${amount == 1 ? "" : "s"}`;
	}

	if (!timeRemaining[3]) {
		overdueIndicator.textContent = msg;
		overdueIndicator.style.display = "block";
		remainingTime.style.display = "none";
	} else {
		remainingTime.textContent = msg;
		remainingTime.style.display = "block";
		overdueIndicator.style.display = "none";
	}
}

function checkRemaining() {
	if (taskInfo.complete) {
		remainingTime.parentElement.style.display = "none";
		return;
	} else {
		remainingTime.parentElement.style.display = "flex";
	}

	let diff = taskInfo["due-date"] - Date.now();
	let timeDiff = Math.abs(diff);
	let oneDay = 1000 * 24 * 60 * 60;
	let days = Math.floor(timeDiff / oneDay);
	let hours = Math.floor((timeDiff % oneDay) / (1000 * 60 * 60));
	let minutes = Math.floor((timeDiff % (oneDay / 24)) / (1000 * 60));

	let timeLeft = [days, hours, minutes, diff > 0];

	updateTimerMsg(timeLeft);
}
checkRemaining();

let timer = setInterval(checkRemaining, 60000);

descriptionToggle.addEventListener("click", () => {
	if (descriptionCont.classList.contains("collapsed")) {
		descriptionCont.classList.remove("collapsed");
		descriptionToggle.textContent = "Collapse";
		descriptionCont.setAttribute("aria-expanded", true);
	} else {
		descriptionCont.classList.add("collapsed");
		descriptionToggle.textContent = "Expand";
		descriptionCont.setAttribute("aria-expanded", false);
	}
});

editButton.addEventListener("click", () => {
	titleInput.value = taskInfo.title;
	descInput.value = taskInfo.desc;
	dateInput.value = taskInfo["due-date"].toISOString().split("T")[0];
	timeInput.value = taskInfo["due-date"].toTimeString().slice(0, 5);

	rootCard.style.display = "none";
	editCard.style.display = "flex";
	titleInput.focus();
});

deleteButton.addEventListener("click", () => {
	alert("Delete Button Clicked!");
});

priorityInputDisplay.addEventListener("click", function () {
	const isOpen = editPriorityContainer.classList.contains("open");
	editPriorityContainer.classList.toggle("open");
	editPriorityContainer.setAttribute("aria-expanded", !isOpen);
	if (!isOpen) {
		priorityOptions.forEach((itm) => {
			itm.setAttribute("tabindex", "0");
		});
		priorityOptions[0].focus();
	} else {
		priorityOptions.forEach((itm) => {
			itm.setAttribute("tabindex", "-1");
		});
	}
});

priorityInputDisplay.addEventListener("keydown", (e) => {
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		priorityInputDisplay.click();
	}
});

let priority = taskInfo.priority;
priorityInputDisplay.textContent = priority;
priorityOptions.forEach((itm, id) => {
	itm.addEventListener("click", () => {
		priority = priorityItems[id];
		priorityInputDisplay.textContent = priority;
		priorityInputDisplay.click();
	});
	itm.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			itm.click();
		}
	});
});

saveEdit.onclick = function (event) {
	event.preventDefault();

	taskInfo.title =
		titleInput.value.trim() != ""
			? titleInput.value.trim()
			: taskInfo.title;
	taskInfo.desc =
		descInput.value.trim() != "" ? descInput.value.trim() : taskInfo.desc;
	taskInfo.priority = priority;

	if (dateInput.value != "" || timeInput.value != "") {
		let dateObj = new Date(
			`${dateInput.value != "" ? dateInput.value : new Date().toISOString().split("T")[0]}T${timeInput.value || "00:00:00"}`,
		);
		taskInfo["due-date"] = dateObj;
	}

	buildComponent();
	checkRemaining();
	form.reset();
	rootCard.style.display = "flex";
	editCard.style.display = "none";
	editButton.focus({ focusVisible: true });
};

cancelEdit.onclick = function (event) {
	event.preventDefault();
	form.reset();
	rootCard.style.display = "flex";
	editCard.style.display = "none";
	editButton.focus({ focusVisible: true });
};
