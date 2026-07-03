# Quick Start Guide - Admin Dashboard

## Setup Instructions

### 1. Ensure Backend is Running
```bash
cd backend
npm install  # if needed
npm start
# Server should run on http://localhost:5001
```

### 2. Ensure Frontend is Running
```bash
cd frontend
npm install  # if needed
npm run dev
# Frontend should run on http://localhost:5173
```

### 3. Access Admin Panel
```
http://localhost:5173/admin/login
```

## Test Credentials
- **Username**: admin
- **Password**: admin123

## Testing Workflow

### Test 1: Login
1. Go to http://localhost:5173/admin/login
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click Login
5. ✅ Should redirect to dashboard

### Test 2: View Statistics
1. On dashboard, check the 4 stat cards at top
2. ✅ Should show counts for:
   - Total Contacts
   - Total Articles
   - Total Events
   - Total Gallery Items

### Test 3: Create Article
1. Click "Articles" tab
2. Click "+ Add New" button
3. Fill in:
   - Title: "Test Article"
   - Author: "Your Name"
   - Content: "Test content here"
4. Click Save
5. ✅ Success notification appears
6. ✅ Article appears in table

### Test 4: Edit Article
1. Click Edit button on any article
2. Change the title or content
3. Click Save
4. ✅ Article updates in table

### Test 5: Delete Article
1. Click Delete button on any article
2. Confirm deletion
3. ✅ Article removed from table
4. ✅ Success notification shows

### Test 6: Test Other Sections
- Click on Events, Gallery, Demos tabs
- Each tab has Create, Edit, Delete buttons
- Contacts and Feedback tabs show view and delete only

### Test 7: Logout
1. Click "Logout" button (top right)
2. ✅ Redirected to login page
3. ✅ Token cleared from storage
4. Try accessing /admin/dashboard
5. ✅ Should redirect back to login

## Features Checklist

- ✅ Professional gradient UI
- ✅ Multi-tab interface
- ✅ CRUD operations for Articles
- ✅ CRUD operations for Events
- ✅ CRUD operations for Gallery
- ✅ CRUD operations for Demos
- ✅ Read/Delete for Contacts
- ✅ Read/Delete for Feedback
- ✅ Real-time statistics
- ✅ Modal forms
- ✅ Success/Error alerts
- ✅ Protected routes
- ✅ Logout functionality
- ✅ Token management

## Troubleshooting

### "Cannot GET /admin/login"
- Make sure frontend dev server is running
- Check port is 5173

### "Invalid credentials"
- Use credentials: admin / admin123
- Check MongoDB is connected
- Check backend server logs

### API calls failing
- Verify backend is running on port 5001
- Check CORS settings
- Verify MongoDB connection
- Check .env variables

### Logout not working
- Check browser console for errors
- Verify localStorage is being cleared
- Try manual browser cache clear

## API Response Examples

### Login Response
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Article Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Test Article",
  "author": "Your Name",
  "content": "Test content here",
  "createdAt": "2024-05-14T10:30:00.000Z"
}
```

## Next Steps

After confirming everything works:
1. Customize admin credentials if needed
2. Add more customization to UI colors
3. Implement pagination for large datasets
4. Add search/filter functionality
5. Set up audit logs for admin actions

## Support Commands

```bash
# Check if backend is running
curl http://localhost:5001/api/articles

# Check if frontend is running
curl http://localhost:5173

# Verify MongoDB
# (Check .env MONGO_URI is accessible)

# View backend logs
# (Terminal where 'npm start' is running)
```

## Important Notes

1. **Token Storage**: Token stored in localStorage - check DevTools Application tab
2. **Session Duration**: JWT tokens last 24 hours by default
3. **Security**: Always use HTTPS in production
4. **Backup**: Create backups before bulk deletes
5. **Performance**: Data reloads on every operation for consistency

---

**Last Updated**: May 14, 2024
**Admin Dashboard Version**: 2.0 (Professional)
