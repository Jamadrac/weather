# User API Documentation

Base URL: `http://localhost:3000/api/users`

## 1. Register User

Register a new user in the system.

- **URL**: `/create`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "Test@123",
  "phoneNumber": "1234567890",
  "role": "USER"
}
```

### Responses

#### Success Response (200 OK)

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "phoneNumber": "1234567890"
}
```

#### Error Response (403 Forbidden)

```json
"User already exists"
```

---

## 2. User Login

Authenticate a user and get their details.

- **URL**: `/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "email": "testuser@example.com",
  "password": "Test@123"
}
```

### Responses

#### Success Response (200 OK)

```json
{
  "userId": "user_id_here",
  "username": "testuser",
  "email": "testuser@example.com",
  "phoneNumber": "1234567890",
  "role": "USER",
  "group": null
}
```

#### Error Responses

- **404 Not Found**: `"User not found"`
- **401 Unauthorized**: `"Invalid Password"`

---

## 3. Forgot Password

Request an OTP for password reset.

- **URL**: `/forgot-password`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "email": "testuser@example.com"
}
```

### Responses

#### Success Response (200 OK)

```json
"OTP sent to your email account for password reset"
```

#### Error Response (404 Not Found)

```json
"User not found"
```

---

## 4. Verify Email and OTP

Verify OTP and update password.

- **URL**: `/verify-email-and-otp-password`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "otp": "123456",
  "email": "testuser@example.com",
  "password": "NewTest@123"
}
```

### Responses

#### Success Response (200 OK)

```json
"Password updated successfully"
```

#### Error Responses

- **400 Bad Request**: `"Invalid email"`
- **400 Bad Request**: `"Invalid OTP"`

---

## 5. Update User Profile

Update user profile information.

- **URL**: `/profile/update`
- **Method**: `PATCH`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "userId": "user_id_here",
  "username": "updateduser",
  "email": "updateduser@example.com",
  "phoneNumber": "9876543210"
}
```

### Responses

#### Success Response (200 OK)

```json
{
  "id": "user_id_here",
  "username": "updateduser",
  "email": "updateduser@example.com",
  "phoneNumber": "9876543210"
}
```

#### Error Response (404 Not Found)

```json
"Illegal request!"
```

---

## Testing in Postman

1. Create a new collection in Postman
2. For each endpoint:
   - Create a new request
   - Set the HTTP method (POST/PATCH)
   - Set the URL (Base URL + endpoint)
   - Go to the "Headers" tab and add:
     - Key: `Content-Type`
     - Value: `application/json`
   - Go to the "Body" tab
     - Select "raw"
     - Select "JSON" from the dropdown
     - Paste the example request body
3. Send the request and check the response

### Testing Flow

1. Register a new user
2. Try to login with the registered credentials
3. Test forgot password flow:
   - Request OTP
   - Check email for OTP
   - Use OTP to reset password
4. Try to login with the new password
5. Update the user profile

### Notes

- Replace `user_id_here` with an actual user ID when updating profile
- The OTP sent to email is required for password reset
- All responses include appropriate HTTP status codes
