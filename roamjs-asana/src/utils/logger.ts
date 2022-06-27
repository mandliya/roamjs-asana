type FeatureName =
  | "complete-task"
  | "sync-completed"
  | "pull-tasks"
  | "get-asana-id-from-block";

export const createLogger = (featureName: FeatureName) => {
  return (log: any) => {
    console.log(`<<<<<<<<< [roamjs-asana] ${featureName} >>>>>>>>>: `, log);
  };
};