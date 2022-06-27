import { createLogger } from "./logger";

const logger = createLogger("get-asana-id-from-block");
export const getAsanaIdFromBlock = (text: string) => {
  try {
    const matched = text.match(/#\[\[\.Asana\/(\d+)\]\]/);
    logger(`matched: ${matched}`);
    if (!matched) {
      logger(`Asana Task ID not found.`);
      return "";
    }
    const asanaID = matched[1];
    return asanaID;
  } catch (e) {
    console.warn(e);
    return "";
  }
};