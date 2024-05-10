import { lastDayOfMonth } from "date-fns";
import cron from "node-cron"
// Schedule a task to run at midnight (00:00) on the 1st of every month
cron.schedule('0 0 1 * *', () => {
    // Your task code here
    console.log('Task executed on the 1st of every month');
});

// Schedule a task to run at midnight (00:00) on the last day of every month
cron.schedule('0 0 * * *', () => {
    // Get the current date
    const currentDate = new Date();
    // Get the last day of the month for the current date
    const isLastDayOfMonth = lastDayOfMonth(currentDate);
    // Get the day of the month from the last day of the month
    const dayOfMonth = isLastDayOfMonth.getDate();

    // Run the task only if it's the last day of the month
    if (currentDate.getDate() === dayOfMonth) {
        // Your task code here
        console.log('Task executed at the end of every month');
    }
});

// alternative
// // Schedule a task to run at midnight (00:00) on the last day of every month
// cron.schedule('0 0 * * *', () => {
//     // Get the current date
//     const currentDate = new Date();
//     // Get the last day of the month for the current date
//     const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//     // Get the day of the month from the last day of the month
//     const dayOfMonth = lastDayOfMonth.getDate();

//     // Run the task only if it's the last day of the month
//     if (currentDate.getDate() === dayOfMonth) {
//         // Your task code here
//         console.log('Task executed at the end of every month');
//     }
// });