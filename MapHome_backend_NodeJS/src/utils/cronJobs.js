const cron = require("node-cron");
const Property = require("../models/Property");

/**
 * Scheduled tasks to manage property lifecycles automatically.
 */
const initCronJobs = () => {
    console.log("⏰ Initializing automatic tasks (Cron Jobs)...");

    // Run daily at 00:00 (midnight)
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("🚦 Starting scan for expired properties...");
            const now = new Date();
            
            // Find properties that are approved but past their expiry date
            const result = await Property.updateMany(
                {
                    status: "approved",
                    expiryDate: { $lt: now }
                },
                {
                    $set: { status: "expired" }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Moved ${result.modifiedCount} properties to 'expired' status.`);
            } else {
                console.log("ℹ️ No properties expired today.");
            }
        } catch (error) {
            console.error("❌ Error scanning for expired properties:", error.message);
        }
    });

    console.log("✅ Scheduled expired properties scan: 00:00 daily.");
};

module.exports = { initCronJobs };
