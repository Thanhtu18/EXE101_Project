# Backend-Frontend Validation Alignment

## Overview

Frontend validation rules have been synchronized with backend validation rules (authValidator.js) to ensure consistent data validation across the full stack. The forgot password page now includes **2 optional methods** for users to recover their passwords.

## Password Recovery Flow - 2 Options

### Option 1: Manual Password Change (Đổi mật khẩu thủ công)

**For logged-in users who remember their current password**

- User enters current password
- User creates a new password (with strength requirements)
- Call: `PUT /api/auth/change-password` with `authMiddleware`
- Requires authentication token

### Option 2: Email Verification (Xác thực qua Email)

**For users who forgot password completely**

- User enters email
- System sends 6-digit token to email
- User enters token + new password
- Call: `POST /api/auth/forgot-password` → `POST /api/auth/verify-reset-code` → `POST /api/auth/reset-password`
- No authentication required

## Backend Validation Rules (authValidator.js)

### 1. Register Validation (`registerRules`)

**Fields:**

- `username` - 3-30 chars, alphanumeric + underscore only, must be unique
- `email` - Valid email format, must be unique
- `password` - Min 8 chars, requires lowercase, uppercase, digit, special char
- `confirmPassword` - Must match password
- `fullName` - Min 2 chars
- `phone` - Optional, Vietnamese format (84 or 0[3|5|7|8|9]) + 8 digits
- `role` - Optional, must be 'user' or 'landlord'

### 2. Login Validation (`loginRules`)

**Fields:**

- `usernameOrEmail` - Required, can be username or email
- `password` - Required

### 3. Forgot Password Validation (`forgotPasswordRules`)

**Fields:**

- `email` - Required, valid email format

### 4. Verify Reset Code Validation (`verifyResetCodeRules`)

**Fields:**

- `email` - Required, valid email format
- `token` - Required, 6-digit code

### 5. Reset Password Validation (`resetPasswordRules`)

**Fields:**

- `email` - Optional
- `token` - Required
- `newPassword` - Min 8 chars, requires lowercase, uppercase, digit, special char
- `confirmPassword` - Must match newPassword

### 6. Change Password Validation (`changePasswordRules`)

**Fields:**

- `currentPassword` - Required
- `newPassword` - Min 8 chars, requires lowercase, uppercase, digit, special char
- `confirmPassword` - Must match newPassword

## Frontend Validation Functions (validationRules.ts)

✅ **Implemented Validators:**

| Validator                   | Purpose                                        | Status     |
| --------------------------- | ---------------------------------------------- | ---------- |
| `validateUsername()`        | 3-30 chars, alphanumeric + underscore          | ✅ Synced  |
| `validateEmail()`           | Valid email format                             | ✅ Synced  |
| `validatePassword()`        | 8+ chars, lowercase, uppercase, digit, special | ✅ Synced  |
| `getPasswordStrength()`     | Password strength feedback                     | ✅ Synced  |
| `validatePasswordMatch()`   | Confirms passwords match                       | ✅ Synced  |
| `validateFullName()`        | Min 2 chars                                    | ✅ Synced  |
| `validatePhone()`           | Vietnamese format validation (optional)        | ✅ Synced  |
| `validateUsernameOrEmail()` | Required username or email                     | ✅ Synced  |
| `validateToken()`           | 6-digit reset code validation                  | ✅ **NEW** |
| `validateCurrentPassword()` | Current password required                      | ✅ **NEW** |
| `validateRole()`            | 'user' or 'landlord' (optional)                | ✅ **NEW** |

## Updated Components

### Frontend - validationRules.ts

- Added `validateToken()` - Validates 6-digit token format
- Added `validateCurrentPassword()` - Validates current password requirement
- Added `validateRole()` - Validates role is 'user' or 'landlord'

### Frontend - ForgotPasswordPage.tsx

- Updated imports to include `validateToken` and `validatePasswordMatch`
- Step 2 now uses:
  - `validateToken()` to validate 6-digit reset code
  - `validatePassword()` to validate new password strength
  - `validatePasswordMatch()` to validate password confirmation

## API Endpoints

### PUT /api/auth/change-password

**Request:**

```json
{
  "currentPassword": "CurrentPass123!@#",
  "newPassword": "NewPass123!@#"
}
```

**Authentication:** Required (Bearer token in Authorization header)
**Validation:** changePasswordRules
**Response:** Success message + user data

**Frontend Method:** `handleManualPasswordChange()`

- Validates current password is provided
- Validates new password strength
- Validates password confirmation match
- Calls endpoint with credentials

**Use Case:** User is logged in and wants to change password

### POST /api/auth/forgot-password

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Validation:** forgotPasswordRules
**Response:** Token (6-digit code) + success message

### POST /api/auth/verify-reset-code

**Request:**

```json
{
  "email": "user@example.com",
  "token": "123456"
}
```

**Validation:** verifyResetCodeRules
**Response:** Success message (token still valid)

### POST /api/auth/reset-password

**Request:**

```json
{
  "email": "user@example.com",
  "token": "123456",
  "newPassword": "NewPass123!@#"
}
```

**Validation:** resetPasswordRules (token + newPassword + confirmPassword)
**Note:** Frontend sends confirmPassword to Step 2 request, but backend validates in POST body
**Response:** Success message

## Error Messages - Vietnamese

All error messages use Vietnamese (Tiếng Việt) to match the UI language:

- "Tên đăng nhập không được để trống" - Username required
- "Tên đăng nhập phải có ít nhất 3 ký tự" - Username min 3 chars
- "Email không được để trống" - Email required
- "Định dạng email không hợp lệ" - Invalid email format
- "Mật khẩu không được để trống" - Password required
- "Mật khẩu phải có ít nhất 8 ký tự" - Password min 8 chars
- "Mật khẩu xác nhận không khớp" - Password confirmation mismatch
- "Mã xác nhận phải là 6 chữ số" - Token must be 6-digit code
- "Vai trò không hợp lệ" - Invalid role

## Validation Flow - Password Recovery

### Option 1: Manual Password Change (Logged-in Users)

```
Step 0: Choose Method
  ↓
  User clicks "Đổi mật khẩu thủ công"
  ↓

Step 1: Manual Password Form
  ↓
  Frontend: validateCurrentPassword() + validatePassword() + validatePasswordMatch()
  ↓
  Backend: PUT /api/auth/change-password → changePasswordRules + authMiddleware
  ↓
  Success: User logged out, redirected to login page
```

### Option 2: Email Verification (Forgot Password)

```
Step 0: Choose Method
  ↓
  User clicks "Xác thực qua Email"
  ↓

Step 1: Email Submission
  ↓
  Frontend: validateEmail()
  ↓
  Backend: POST /api/auth/forgot-password → forgotPasswordRules
  ↓
  User receives 6-digit token via email
  ↓

Step 2: Token + New Password
  ↓
  Frontend: validateToken() + validatePassword() + validatePasswordMatch()
  ↓
  Step 2a: POST /api/auth/verify-reset-code → verifyResetCodeRules
  ↓
  Step 2b: POST /api/auth/reset-password → resetPasswordRules
  ↓
  Success: Password reset, user can login with new password
```

## Implementation Checklist

- ✅ All backend validation rules documented
- ✅ Frontend validators created/synced
- ✅ ForgotPasswordPage updated to use validators
- ✅ Error messages in Vietnamese
- ✅ TypeScript compilation verified (0 errors)
- ✅ Validation function exports updated

## Notes

- Token validation checks for exactly 6 digits (regex: `/^\d{6}$/`)
- Password validation requires all 4 criteria: lowercase, uppercase, digit, special char
- Phone number validation is optional (returns valid if empty)
- Role validation is optional (returns valid if empty)
- All string inputs are trimmed before validation
- Email inputs are normalized to lowercase
