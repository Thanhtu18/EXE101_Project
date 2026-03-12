function sanitizeUser(user, allowed = ["_id", "name", "email"]) {
  if (!user) return null;
  const obj = typeof user.toObject === "function" ? user.toObject() : user;
  const result = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

module.exports = sanitizeUser;
