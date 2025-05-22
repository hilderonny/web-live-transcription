import CONFIG from './config.json' with {type: 'json'}

// Adss a task of a specific type with the given data
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#add-a-task
async function addTask(type, data, file, requirements) {
    const body = {
        type: type
    }
    if (data) body.data = data
    if (requirements) body.requirements = requirements
    const formData = new FormData()
    formData.append('json', JSON.stringify(body))
    if (file) formData.append('file', file)
    const response = await fetch(`${CONFIG.apiRoot}/tasks/add/`, {
        method: 'POST',
        body: formData
    })
    const result = await response.json()
    return result
}

// Retreive the version of the TaskBridge used for API calls
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#get-version-of-taskbridge
async function getTaskBridgeVersion() {
    const response = await fetch(`${CONFIG.apiRoot}/version`)
    const version = await response.text()
    return version
}

// Returns complete task details
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#get-all-details-of-a-task
async function getTaskDetails(taskId) {
    const response = await fetch(`${CONFIG.apiRoot}/tasks/details/${taskId}`)
    const details = await response.json()
    return details
}

// Retreive a list of all tasks
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#list-all-tasks
async function getTaskList() {
    const response = await fetch(`${CONFIG.apiRoot}/tasks/list/`)
    const tasks = await response.json()
    return tasks
}

// Retreive the result of a task
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#get-the-results-of-a-completed-task
async function getTaskResult(taskId) {
    const response = await fetch(`${CONFIG.apiRoot}/tasks/result/${taskId}`)
    const json = await response.json()
    return json.result
}

// Retreive statistics of all task types
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#get-task-statistics
async function getTaskStatistics() {
    const response = await fetch(`${CONFIG.apiRoot}/tasks/statistics/`)
    const statistics = await response.json()
    return statistics
}

// Retreive the status and progress for a task
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#get-status-information-about-a-task
async function getTaskStatus(taskId) {
    const response = await fetch(`${CONFIG.apiRoot}/tasks/status/${taskId}`)
    const status = response.status !== 404 ? await response.json() : undefined
    return status
}

// Returns the WebUI version defined in config.json
function getWebUiVersion() {
    return CONFIG.version
}

// Retreive a list of all connected workers and their status
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#list-all-workers
async function getWorkerList() {
    const response = await fetch(`${CONFIG.apiRoot}/workers/list/`)
    const workers = await response.json()
    return workers
}

// Retreive statistics about all workers
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#get-worker-statistics
async function getWorkerStatistics() {
    const response =  await fetch(`${CONFIG.apiRoot}/tasks/workerstatistics/`)
    const statistics = await response.json()
    return statistics
}

// Removes a task
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#remove-a-task
async function removeTask(taskId) {
    await fetch(`${CONFIG.apiRoot}/tasks/remove/${taskId}`, { method: 'DELETE' })
}

// Restarts a task
// https://github.com/hilderonny/taskbridge/blob/main/doc/API.md#restart-a-task
async function restartTask(taskId) {
    await fetch(`${CONFIG.apiRoot}/tasks/restart/${taskId}`)
}

// Wait for a task completion and reports the results and the status
async function waitForTaskCompletion(taskId, statusCallback, completionCallback) {

    let intervalId

    const waiter = async function() {
        const taskStatus = await getTaskStatus(taskId)
        if (taskStatus === undefined) {
            // Has been deleted
            clearInterval(intervalId)
            await completionCallback()
        } else if (taskStatus.status === "completed") {
            if (completionCallback) {
                const taskResult = await getTaskResult(taskId)
                await completionCallback(taskResult)
            }
            await removeTask(taskId)
            clearInterval(intervalId)
        } else {
            if (statusCallback) await statusCallback(taskStatus)
        }
    }

    intervalId = setInterval(waiter, 1000)
    waiter()

}

export default {
    addTask,
    getTaskBridgeVersion,
    getTaskDetails,
    getTaskList,
    getTaskResult,
    getTaskStatistics,
    getTaskStatus,
    getWebUiVersion,
    getWorkerList,
    getWorkerStatistics,
    removeTask,
    restartTask,
    waitForTaskCompletion
}