import {
    getConfigFromPage,
    getPageTitleByBlockUid,
    getParentUidByBlockUid,
    toRoamDate,
    pushBullets,
    createBlock
  } from "roam-client";


import * as asana from '../asana/tasks';
import { createLogger } from "../utils/logger";

const logger = createLogger("pull-tasks");

export const importAsanaTasks = async (
    _: {
      [key: string]: string;
    },
    blockUid: string
  ) => {
    const parentUid = getParentUidByBlockUid(blockUid);
    const config = getConfigFromPage("roam/js/asana");
    const pageTitle = getPageTitleByBlockUid(blockUid);
    const token = config["ASANA_TOKEN"]?.trim();
    const workspaceGid = config["ASANA_WORKSPACE_GID"]?.trim();
    const userGid = config["ASANA_USER_GID"]?.trim();
    if (!token || !workspaceGid || !userGid) {
      window.roamAlphaAPI.updateBlock({
        block: {
          string: `Error: Could not find the required "ASANA_TOKEN" or "ASANA_WORKSPACE_GID" or "ASANA_USER_GID" attribute configured in the [[roam/js/oura-ring]] page.`,
          uid: blockUid,
        },
      });
      return;
    }
  
    window.roamAlphaAPI.updateBlock({
      block: {
        string: `Your Pending Asana Tasks:`,
        uid: blockUid,
      },
    });
  
    const childBlockUid = createBlock({ parentUid: blockUid, node: { text: "Loading.." } });
    const bullets: string[] = [];
    asana.init(token);
    const tasks = await asana.getTasks(workspaceGid, userGid);
    logger(`Fetched ${tasks.length} tasks.`);
    for (const task of tasks) {
        logger(`JSON: ${JSON.stringify(task)}`);
        if (!task.completed) {
            bullets.push(buildAsanaTaskContent(task));
        }

    }
    return pushBullets(bullets, childBlockUid, blockUid);
  }
  
  const buildAsanaTaskContent = (task: any) => {
    const content = [];
    let taskString = `{{[[TODO]]}} ${task.name}`;
  
    if (task.due_on) {
      taskString += ` (due [[${toRoamDate(new Date(task.due_on))})]]`;
    }
  
    if (task.permalink_url) {
        taskString += `[🔗](${task.permalink_url})`;
    }

    taskString += `{{✅:42SmartBlock:Roamasana - complete task button:button=true,42RemoveButton=false}}`;
    taskString += ` #[[.Asana/${task.gid}]]`;

    content.push(taskString);
  
    if (task.notes && task.notes.length > 0) {
      content.push(`Notes: ${task.notes}`);
    }
  
    console.log(content); 
  
    return content.join("\n");
  }