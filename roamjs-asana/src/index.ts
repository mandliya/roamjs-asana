import toConfigPageName from "roamjs-components/util/toConfigPageName";
import runExtension from "roamjs-components/util/runExtension";
import { createConfigObserver } from "roamjs-components/components/ConfigPage";

import { addButtonListener } from "roam-client";
import { importAsanaTasks } from "./features/pull_tasks";



const extensionId = "roamjs-asana";
const CONFIG = toConfigPageName(extensionId);
const ASANA_COMMAND = "Import Asana Tasks";
runExtension({
  extensionId, 
  run: () => {
    addButtonListener(ASANA_COMMAND, importAsanaTasks);
  },
  unload: () => {},
});
