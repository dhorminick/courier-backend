import nodeCron from "node-cron";

export const CronJobs = () => {
  nodeCron.schedule("0 * * * *", async () => {
    // #hourly
  });

  nodeCron.schedule("0 0 */30 * *", async () => {
    // #every 30days
  });
};
