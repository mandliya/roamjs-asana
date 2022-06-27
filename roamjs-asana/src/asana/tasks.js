var Asana = require('./asana-min.js');

let asana

exports.init = function (token) {
  asana = Asana.Client.create({
        defaultHeaders: { "asana-enable": "new-sections,string_ids" },
        logAsanaChangeWarnings: false
    }).useAccessToken(token);
}

exports.getTasks = async function (workspaceGid, userGid) {
    let fetched_tasks = await asana.tasks.findAll(
        {
            workspace: workspaceGid,
            assignee: userGid,
        }
    );
    let tasks = [];

    for (const t of fetched_tasks.data) {
      let task = await getTaskDetails(t.gid)
      if (task && !task.completed) {
        tasks.push(task);
      }
    }

    return tasks;
}

async function getTaskDetails (taskId) {
    const task = await asana.tasks.getTask(taskId);
    return task.resource_subtype !== 'section' ? task : null
}

exports.getSubtasks = async function (taskGid) {
    let subtasks = []
    let fetched_subtasks = await asana.tasks.subtasks(taskGid)
  
    for (const st of fetched_subtasks.data) {
      let subtask = await getTaskDetails(st.gid)
      if (subtask && !subtask.completed) {
        subtasks.push(subtask);
      }
    }
  
    return subtasks
  }


exports.completeTask = async function (taskGid) {
    await asana.tasks.update(taskGid, { completed: true }) 
}