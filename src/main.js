#!/usr/bin/env node

const fs = require("fs");
const helpers = require("./helpers");

const arguments = process.argv.slice(2);

const DB_PATH = `${__dirname}/db.json`;

const data = fs.readFileSync(DB_PATH, "utf-8");
const TASKS = JSON.parse(data).task;
const COUNTER = JSON.parse(data).counter;

const now = new Date();
if (arguments[0] === "add") {
    const newTask = arguments[1];

    TASKS.push({
        id: COUNTER + 1,
        description: newTask,
        status: "todo",
        createdAt: now,
        updatedAt: now,
    });

    const saveNewData = {
        task: TASKS,
        counter: COUNTER + 1,
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(saveNewData), "utf-8");
} else if (arguments[0] === "update") {
    const id = Number(arguments[1]);
    const updatedNewTask = arguments[2];

    const targetTask = TASKS.find((task) => {
        if (task.id === id) {
            return task;
        }
    });

    if (!targetTask) {
        console.log("Task not Found.");
        return;
    }

    const newTask = TASKS.map((task) => {
        if (task.id === id) {
            return {
                ...targetTask,
                description: updatedNewTask,
                updatedAt: now,
            };
        }

        return task;
    });

    const saveNewData = {
        task: newTask,
        counter: COUNTER,
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(saveNewData), "utf-8");
} else if (arguments[0] === "delete") {
    const id = Number(arguments[1]);

    const filtered = TASKS.filter((task) => {
        if (task.id !== id) {
            return task;
        }
    });

    const saveNewData = {
        task: filtered,
        counter: COUNTER,
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(saveNewData), "utf-8");
} else if (arguments[0] === "mark-in-progress") {
    const id = Number(arguments[1]);

    const targetTask = TASKS.find((task) => task.id === id);

    if (!targetTask) {
        console.log("Task not found");
        return;
    }

    const updateTask = helpers.handleUpdateTasks(TASKS, id, "in-progress");

    const saveNewData = {
        task: updateTask,
        counter: COUNTER,
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(saveNewData), "utf-8");
} else if (arguments[0] === "mark-done") {
    const id = Number(arguments[1]);

    const targetTask = TASKS.find((task) => task.id === id);

    if (!targetTask) {
        console.log("Task not found");
        return;
    }

    const updateTask = helpers.handleUpdateTasks(TASKS, id, "done");

    const saveNewData = {
        task: updateTask,
        counter: COUNTER,
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(saveNewData), "utf-8");
} else if (arguments[0] === "list") {
    const status = arguments[1];
    console.log("ID TASK STATUS");

    if (status) {
        for (let i = 0; i < TASKS.length; i++) {
            const task = TASKS[i];
            if (status === task.status) {
                console.log(`${task.id} ${task.description} ${task.status}`);
            }
        }
        return;
    }

    for (let i = 0; i < TASKS.length; i++) {
        const task = TASKS[i];
        console.log(`${task.id} ${task.description} ${task.status}`);
    }
} else {
    console.log("command not found.");
}
