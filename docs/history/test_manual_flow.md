# Manual Frontend Authentication Test

## Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000` (or check the port in terminal)

## Test Steps

### 1. Sign Up
1. Open browser to `http://localhost:3000`
2. Click "Get Started" or navigate to `/signup`
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123!`
4. Click "Create Account"
5. **Expected**: Redirect to `/dashboard`

### 2. View Dashboard
1. Should see empty task list
2. Should see "Add New Task" button
3. Check browser DevTools > Network tab for any errors

### 3. Create Task
1. Click "Add New Task" button
2. Enter:
   - Title: "Test Task 1"
   - Description: "Testing authentication flow"
3. Click "Save" or "Create"
4. **Expected**: Task appears in the list

### 4. Verify Backend Integration
Open browser DevTools > Network tab and check the task creation request:
- **URL**: Should be `http://localhost:8000/api/tasks`
- **Method**: POST
- **Headers**: Should include `Authorization: Bearer <token>`
- **Response**: Should be 200/201 with task data

### 5. Sign Out and Sign In
1. Click "Sign Out" in navbar
2. Navigate to `/login`
3. Enter same credentials
4. **Expected**: Redirect to `/dashboard` with tasks visible

## Common Issues

### Issue: "Invalid token" error
- **Check**: Is `/api/token` endpoint working?
- **Test**: `curl http://localhost:3000/api/token` (should require auth)
- **Fix**: Ensure `jsonwebtoken` package is installed

### Issue: Tasks not loading
- **Check**: Network tab for 401 errors
- **Check**: Backend logs for JWT validation errors
- **Fix**: Verify JWT_SECRET matches in both frontend and backend `.env` files

### Issue: CORS errors
- **Check**: Backend CORS configuration in `main.py`
- **Should allow**: `http://localhost:3000` origin

## Success Criteria
- ✅ User can sign up
- ✅ User can sign in
- ✅ Dashboard loads without errors
- ✅ Tasks can be created
- ✅ Tasks appear in the list
- ✅ Backend receives valid JWT tokens
