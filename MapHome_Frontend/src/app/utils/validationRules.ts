/**
 * Frontend validation rules synchronized with backend (authValidator.js)
 * These functions perform client-side validation before API submission
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate username: 3-30 chars, only letters, numbers, underscores
 */
export const validateUsername = (username: string): ValidationResult => {
  const trimmed = username.trim();

  if (!trimmed) {
    return { valid: false, error: "Tên đăng nhập không được để trống" };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: "Tên đăng nhập phải có ít nhất 3 ký tự" };
  }

  if (trimmed.length > 30) {
    return {
      valid: false,
      error: "Tên đăng nhập không được vượt quá 30 ký tự",
    };
  }

  const validPattern = /^[a-zA-Z0-9_]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: "Tên đăng nhập chỉ có thể chứa chữ, số và dấu gạch dưới (_)",
    };
  }

  return { valid: true };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: "Email không được để trống" };
  }

  // Simple email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return { valid: false, error: "Định dạng email không hợp lệ" };
  }

  return { valid: true };
};

/**
 * Validate password strength
 * Requirements: min 8 chars, lowercase, uppercase, digit, special char
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: "Mật khẩu không được để trống" };
  }

  if (password.length < 8) {
    return { valid: false, error: "Mật khẩu phải có ít nhất 8 ký tự" };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Mật khẩu phải chứa ít nhất một chữ cái thường (a-z)",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Mật khẩu phải chứa ít nhất một chữ cái hoa (A-Z)",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Mật khẩu phải chứa ít nhất một chữ số (0-9)",
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      error:
        'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)',
    };
  }

  return { valid: true };
};

/**
 * Get password strength feedback
 * Returns object with boolean flags for each requirement
 */
export const getPasswordStrength = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

/**
 * Validate confirm password matches password
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword) {
    return { valid: false, error: "Xác nhận mật khẩu không được để trống" };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: "Mật khẩu xác nhận không khớp" };
  }

  return { valid: true };
};

/**
 * Validate full name: min 2 chars
 */
export const validateFullName = (fullName: string): ValidationResult => {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return { valid: false, error: "Họ và tên không được để trống" };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: "Họ và tên phải có ít nhất 2 ký tự" };
  }

  return { valid: true };
};

/**
 * Validate Vietnamese phone number format
 * Optional field - returns valid if empty
 */
export const validatePhone = (phone: string): ValidationResult => {
  const trimmed = phone.trim();

  // Optional field
  if (!trimmed) {
    return { valid: true };
  }

  // Vietnamese phone: (84 or 0[3|5|7|8|9]) + 8 digits
  const phonePattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phonePattern.test(trimmed)) {
    return {
      valid: false,
      error: "Số điện thoại không hợp lệ. Format: 0123456789 hoặc 84123456789",
    };
  }

  return { valid: true };
};

/**
 * Validate username/email for login (required, non-empty)
 */
export const validateUsernameOrEmail = (value: string): ValidationResult => {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: "Tên đăng nhập hoặc email không được để trống",
    };
  }

  return { valid: true };
};

/**
 * Validate property name: 5-100 chars
 */
export const validatePropertyName = (name: string): ValidationResult => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: "Tên phòng trọ không được để trống" };
  }
  if (trimmed.length < 5) {
    return { valid: false, error: "Tên phòng trọ phải có ít nhất 5 ký tự" };
  }
  if (trimmed.length > 100) {
    return {
      valid: false,
      error: "Tên phòng trọ không được vượt quá 100 ký tự",
    };
  }
  return { valid: true };
};

/**
 * Validate price: must be a positive number
 */
export const validatePrice = (price: string | number): ValidationResult => {
  const num = Number(price);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: "Giá thuê phải là một số dương" };
  }
  return { valid: true };
};

/**
 * Validate area: must be a positive number
 */
export const validateArea = (area: string | number): ValidationResult => {
  const num = Number(area);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: "Diện tích phải là một số dương" };
  }
  return { valid: true };
};

/**
 * Validate property description: max 2000 chars
 */
export const validateDescription = (description: string): ValidationResult => {
  const trimmed = description.trim();
  if (trimmed.length > 2000) {
    return { valid: false, error: "Mô tả không được vượt quá 2000 ký tự" };
  }
  return { valid: true };
};

/**
 * Validate booking date
 */
export const validateBookingDate = (
  date: Date | string | undefined | null,
): ValidationResult => {
  if (!date) {
    return { valid: false, error: "Ngày đặt lịch không được để trống" };
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { valid: false, error: "Ngày đặt lịch không được trong quá khứ" };
  }
  return { valid: true };
};

/**
 * Validate booking time (format HH:MM)
 */
export const validateBookingTime = (
  time: string | undefined | null,
): ValidationResult => {
  if (!time) {
    return { valid: false, error: "Giờ đặt lịch không được để trống" };
  }
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timePattern.test(time)) {
    return { valid: false, error: "Giờ đặt lịch không hợp lệ (HH:MM)" };
  }
  return { valid: true };
};

/**
 * Validate review rating: 1-5
 */
export const validateReviewRating = (rating: number): ValidationResult => {
  if (!rating || rating < 1 || rating > 5) {
    return { valid: false, error: "Đánh giá phải từ 1 đến 5 sao" };
  }
  return { valid: true };
};

/**
 * Validate review comment: max 1000 chars
 */
export const validateReviewComment = (comment: string): ValidationResult => {
  const trimmed = comment.trim();
  if (trimmed.length > 1000) {
    return { valid: false, error: "Nhận xét không được vượt quá 1000 ký tự" };
  }
  return { valid: true };
};

/**
 * Validate reset token (6-digit code)
 */
export const validateToken = (token: string): ValidationResult => {
  const trimmed = token.trim();

  if (!trimmed) {
    return { valid: false, error: "Mã xác nhận không được để trống" };
  }

  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, error: "Mã xác nhận phải là 6 chữ số" };
  }

  return { valid: true };
};

/**
 * Validate current password (required for change password)
 */
export const validateCurrentPassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: "Mật khẩu hiện tại không được để trống" };
  }

  return { valid: true };
};

/**
 * Validate role: 'user' or 'landlord'
 * Optional field - returns valid if empty
 */
export const validateRole = (role: string): ValidationResult => {
  if (!role) {
    return { valid: true }; // Optional field
  }

  if (!["user", "landlord", "admin"].includes(role)) {
    return {
      valid: false,
      error: "Vai trò không hợp lệ. Phải là 'user', 'landlord' hoặc 'admin'",
    };
  }

  return { valid: true };
};
