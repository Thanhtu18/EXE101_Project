const Notification = require("../models/Notification");

/**
 * Creates a notification in the DB for a specific user.
 * @param {object} options
 * @param {string} options.userId    - Recipient's user ID
 * @param {string} options.title     - Notification title
 * @param {string} options.message   - Notification message
 * @param {string} [options.type]    - Type: "info"|"success"|"warning"|"error"|"booking"|"verification"
 * @param {string} [options.link]    - Related page link (e.g. /room/123)
 */
const createNotification = async ({ userId, title, message, type = "info", link }) => {
  try {
    await Notification.create({ userId, title, message, type, link });
  } catch (err) {
    // Log error but do not throw to avoid disrupting the main flow
    console.error("[NotificationHelper] Failed to create notification:", err.message);
  }
};

// ─── Booking Notifications ─────────────────────────────────────────────────

/**
 * Notify LANDLORD when a new booking is created by a tenant
 */
const notifyLandlordNewBooking = async ({ landlordUserId, propertyName, customerName, bookingDate, bookingTime, propertyId }) => {
  await createNotification({
    userId: landlordUserId,
    title: "📅 New Viewing Appointment!",
    message: `${customerName} has requested to view "${propertyName}" on ${bookingDate} at ${bookingTime}.`,
    type: "booking",
    link: propertyId ? `/room/${propertyId}` : undefined,
  });
};

/**
 * Notify TENANT when the landlord confirms their booking
 */
const notifyTenantBookingConfirmed = async ({ tenantUserId, propertyName, bookingDate, bookingTime, propertyId }) => {
  await createNotification({
    userId: tenantUserId,
    title: "✅ Appointment Confirmed!",
    message: `Your viewing of "${propertyName}" on ${bookingDate} at ${bookingTime} has been confirmed. Don't be late!`,
    type: "success",
    link: propertyId ? `/room/${propertyId}` : undefined,
  });
};

/**
 * Notify TENANT when landlord cancels their booking
 */
const notifyTenantBookingCancelled = async ({ tenantUserId, propertyName, cancelledBy, propertyId }) => {
  const byText = cancelledBy === "landlord" ? "The landlord has cancelled" : "Your appointment has been cancelled";
  await createNotification({
    userId: tenantUserId,
    title: "❌ Appointment Cancelled",
    message: `${byText} your viewing of "${propertyName}". You can reschedule or find another room.`,
    type: "warning",
    link: propertyId ? `/room/${propertyId}` : undefined,
  });
};

/**
 * Notify TENANT when their booking is marked as completed (prompt them to leave a review)
 */
const notifyTenantBookingCompleted = async ({ tenantUserId, propertyName, propertyId }) => {
  await createNotification({
    userId: tenantUserId,
    title: "🏠 Viewing Completed!",
    message: `You have finished viewing "${propertyName}". Leave a review to help other renters!`,
    type: "info",
    link: propertyId ? `/room/${propertyId}` : undefined,
  });
};

/**
 * Notify LANDLORD when a tenant cancels their own booking
 */
const notifyLandlordBookingCancelledByTenant = async ({ landlordUserId, propertyName, customerName, bookingDate, bookingTime }) => {
  await createNotification({
    userId: landlordUserId,
    title: "🔔 Tenant Cancelled Appointment",
    message: `${customerName} has cancelled their viewing of "${propertyName}" scheduled for ${bookingDate} at ${bookingTime}.`,
    type: "warning",
  });
};

module.exports = {
  createNotification,
  notifyLandlordNewBooking,
  notifyTenantBookingConfirmed,
  notifyTenantBookingCancelled,
  notifyLandlordBookingCancelledByTenant,
  notifyTenantBookingCompleted,
};
