const handleUpdateTasks = (tasks, id, status) => {
    const updateTask = tasks.map((task) => {
        if (task.id === id) {
            return {
                ...task,
                status,
                updatedAt: new Date(),
            };
        }
    });

    return updateTask;
};

module.exports = {
    handleUpdateTasks,
};
