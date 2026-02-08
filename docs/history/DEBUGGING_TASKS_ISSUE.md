# Debugging: Tasks Disappearing After Logout/Login

## Issue Description
Tasks disappear when a user logs out and logs back in. The tasks show "No tasks yet" even though tasks were created in a previous session.

## Root Cause Analysis
The issue is related to **user ID consistency** across authentication sessions:

1. **Better Auth** manages user authentication and stores user data in the `user` table
2. When users log in, Better Auth creates a JWT token with the user's ID in the `sub` claim
3. **Backend** filters tasks by `user_id` extracted from the JWT token
4. **Issue**: The user ID from the JWT token may be inconsistent between sessions OR there's a data retrieval problem

## Debugging Steps

### Step 1: Check Browser Console Logs

1. Open the frontend application in your browser
2. Open Developer Tools (F12)
3. Go to the **Console** tab
4. **Login** with your test account
5. Check the console logs for:
   ```
   Current user ID from token: [USER_ID]
   ```

6. **Create a task** and check the logs for:
   ```
   Creating task for user ID: [USER_ID]
   Task created: [TASK_OBJECT]
   ```

7. **Logout** from the application

8. **Login again** with the same credentials

9. Check the console logs again for:
   ```
   Current user ID from token: [USER_ID]
   Fetched tasks: [NUMBER] tasks
   ```

### Step 2: Compare User IDs

**IMPORTANT**: Compare the user ID from Step 5 (first login) with the user ID from Step 9 (second login)

- **If the user IDs are DIFFERENT** → The issue is with Better Auth not maintaining consistent user IDs
- **If the user IDs are the SAME but no tasks are found** → The issue is with database queries or task storage

### Step 3: Check Backend Logs

1. Open the terminal where your backend is running
2. Look for these log messages:
   ```
   INFO: Creating task for user_id: [USER_ID]
   INFO: Task created with ID: [TASK_ID] for user_id: [USER_ID]
   INFO: Fetching tasks for user_id: [USER_ID]
   INFO: Found [NUMBER] tasks for user_id: [USER_ID]
   ```

3. Compare the `user_id` values between task creation and task fetching

### Step 4: Direct Database Check (Optional)

If you want to verify the data in the database directly:

```sql
-- Check Better Auth user table
SELECT id, email, name, "createdAt" FROM user ORDER BY "createdAt" DESC;

-- Check tasks table
SELECT id, title, user_id, created_at FROM tasks ORDER BY created_at DESC;

-- Join to see which user owns which tasks
SELECT
    t.id as task_id,
    t.title,
    t.user_id,
    u.email as user_email,
    t.created_at
FROM tasks t
LEFT JOIN "user" u ON t.user_id = u.id
ORDER BY t.created_at DESC;
```

## Expected Results

### Correct Behavior
1. User ID should be **consistent** across login sessions for the same user
2. Tasks created in one session should be visible in subsequent sessions
3. The `user_id` in the JWT token should match the `user_id` in the tasks table

### What to Look For

#### Scenario A: Different User IDs Between Sessions
**Symptom**: User ID changes between logout/login cycles

**Cause**: Better Auth might be creating multiple user records for the same email

**Solution**:
- Check if Better Auth is configured to use email as the unique identifier
- Verify that the database has a UNIQUE constraint on the email field in the user table
- Check for duplicate user records in the database

#### Scenario B: Same User ID But No Tasks Found
**Symptom**: User ID is consistent, but tasks query returns empty

**Cause**:
- Tasks might be stored with a different format of user_id (e.g., with extra quotes or whitespace)
- Database query filtering might be case-sensitive
- Tasks table might not have the data

**Solution**:
- Check the exact format of `user_id` in the tasks table
- Verify that the JWT token's `sub` claim matches exactly with the stored `user_id`

## Quick Fix to Test

If you want to quickly test if this is a user ID consistency issue, you can:

1. **Create a new test account** with a fresh email
2. **Create some tasks**
3. **DO NOT logout** - just close the browser
4. **Reopen the browser** and navigate back to the app
5. Check if tasks are still there

If tasks persist after closing/reopening the browser but disappear after explicit logout/login, then the issue is definitely with how the user ID is being handled during the authentication flow.

## Need More Help?

Share the following information from your debugging session:

1. The user IDs from console logs (both first and second login)
2. Backend log messages showing user_id values
3. Number of tasks created vs number of tasks fetched
4. Any error messages from browser console or backend logs

This will help identify the exact cause of the issue.
