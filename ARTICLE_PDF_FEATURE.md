# Article File Upload & PDF Download Feature

## Overview
Articles now support file uploads with PDF viewing and download capabilities. Admins can upload PDF files when creating/editing articles, and users can view and download articles as PDFs.

## Features Implemented

### Admin Dashboard (Backend)

#### File Upload in Admin Panel
- **Location**: Admin Dashboard → Articles Tab
- **Add/Edit Article Modal**: Includes file upload input
- **Supported Format**: PDF files only
- **File Handling**: Base64 encoding for storage in MongoDB
- **File Display**: Shows current filename and upload status

#### How to Upload Article PDF
1. Go to Admin Dashboard → Articles tab
2. Click "+ Add New" or "Edit" on existing article
3. Fill in Title, Author, and Content
4. In the "Upload PDF File" section, click to select a PDF
5. Choose your PDF file from your computer
6. Click "Save"
7. Success notification appears

#### File Management in Admin
- Shows file status in articles table (📄 File indicator)
- Edit article to replace or update file
- Delete article also removes associated file
- Current filename displayed when editing

### Website (Frontend - Articles Section)

#### Article Card Display
- **Card Layout**: Grid of article cards (3 columns on desktop)
- **File Indicator**: 📄 badge shows if article has PDF
- **Click Card**: Opens full article view
- **Responsive**: Works on mobile, tablet, and desktop

#### Article View Page
- **Full Content**: Shows complete article text
- **PDF Controls**: Two buttons appear if file is attached
  - **📖 Open PDF**: Opens PDF in new tab
  - **⬇️ Download PDF**: Downloads PDF to computer

#### PDF Download Functionality
- Click "Download PDF" button to save to computer
- Automatic filename: Article title or provided filename
- Works with base64-encoded PDFs stored in database
- Compatible with all browsers

## Technical Implementation

### Database Schema (Article Model)
```javascript
{
  title: String (required),
  content: String (required),
  author: String (required),
  fileUrl: String (optional) - Base64 encoded PDF data
  fileName: String (optional) - Original filename
  createdAt: Date (default: now)
}
```

### Frontend State Management
```javascript
const [uploadedFile, setUploadedFile] = useState(null);  // Current file selected
const [formData, setFormData] = useState({});             // Form data with fileUrl/fileName
```

### File Upload Process
1. User selects PDF file in modal
2. File stored in `uploadedFile` state
3. On Save, FileReader converts file to base64
4. Base64 string sent to backend as `fileUrl`
5. Backend stores with original `fileName`
6. Database saves complete article with file data

### PDF Download Process
1. User clicks "Download PDF" button
2. Check if fileUrl is base64 (starts with 'data:')
3. Create temporary download link
4. Set filename from `article.fileName`
5. Trigger browser download
6. Clean up temporary link

## API Endpoints

### POST /api/articles
Create new article with optional PDF
```json
{
  "title": "Article Title",
  "author": "Author Name",
  "content": "Article content...",
  "fileUrl": "data:application/pdf;base64,JVBERi0xLjQ...",
  "fileName": "article.pdf"
}
```

### PUT /api/articles/:id
Update article (can update or replace PDF)
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "content": "Updated content...",
  "fileUrl": "data:application/pdf;base64,JVBERi0xLjQ...",
  "fileName": "updated-article.pdf"
}
```

### GET /api/articles
Fetch all articles with file data included

## File Size Considerations

### Base64 Encoding Impact
- **Conversion**: PDF → Base64 increases size by ~33%
- **Example**: 1MB PDF = ~1.33MB base64
- **Storage**: Stored in MongoDB (consider size limits)
- **Performance**: Large files (>5MB) may impact database performance

### Recommendations
- **Optimal Size**: Keep PDFs under 2-3MB
- **Compression**: Compress PDFs before upload to reduce size
- **Future Enhancement**: Implement external file storage (AWS S3, Google Cloud, etc.)

## Usage Examples

### Admin: Creating Article with PDF
1. Navigate to: http://localhost:5173/admin/login
2. Login with: admin / admin123
3. Click Articles tab
4. Click "+ Add New"
5. Fill form:
   - Title: "AI Best Practices"
   - Author: "Tech Team"
   - Content: "Complete guide to AI implementation..."
   - Upload: Select your-file.pdf
6. Click Save
7. Article appears in table with file indicator

### User: Reading Article and Downloading PDF
1. Navigate to: http://localhost:5173#articles (or Articles section)
2. See article cards in grid
3. Notice 📄 badge on articles with PDFs
4. Click card to view full article
5. See both "Open PDF" and "Download PDF" buttons
6. Click "Download PDF" to save to computer

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| File Upload | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Base64 Conversion | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| PDF Open | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| PDF Download | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

## Testing Checklist

- [ ] Admin can upload PDF when creating article
- [ ] Admin can view uploaded filename in edit modal
- [ ] Admin can replace PDF by uploading new file
- [ ] Admin can edit article without changing PDF
- [ ] Article appears with 📄 indicator on website
- [ ] Click article card opens full view
- [ ] "Open PDF" button opens PDF in new tab
- [ ] "Download PDF" button downloads file to computer
- [ ] Downloaded file has correct filename
- [ ] PDF file is readable and complete
- [ ] Delete article also removes file reference
- [ ] Mobile view works properly
- [ ] Responsive design on all screen sizes

## Troubleshooting

### PDF Not Uploading
- **Cause**: File size too large
- **Solution**: Compress PDF or split into smaller files
- **Check**: Console for errors in browser DevTools

### Download Not Working
- **Cause**: Browser download settings blocked
- **Solution**: Check browser security settings
- **Alternative**: Use "Open PDF" button instead

### File Size Error in Database
- **Cause**: MongoDB document size exceeded (16MB limit)
- **Solution**: Use smaller PDFs or external file storage
- **Future**: Implement cloud storage integration

### Base64 String Incomplete
- **Cause**: Large file conversion error
- **Solution**: Reduce PDF file size before upload
- **Note**: Files over 3MB may have issues

## Future Enhancements

1. **External File Storage**
   - Integrate AWS S3 or Google Cloud Storage
   - Store file references instead of base64
   - Improved performance and scalability

2. **File Management**
   - Multiple files per article
   - Different file types (DOCX, XLSX, etc.)
   - File versioning

3. **Advanced Features**
   - File compression before storage
   - Virus scanning for uploads
   - Download tracking/analytics
   - File preview thumbnails

4. **User Experience**
   - Drag-and-drop file upload
   - Upload progress bar
   - Bulk upload capability
   - File size preview before upload

## Important Notes

### Base64 Storage
- ✅ Works well for small to medium PDFs (< 3MB)
- ⚠️ Not ideal for large files or high volume
- 📝 Consider external storage for production

### Database Performance
- Monitor database size with file uploads
- Clean up old/unused articles periodically
- Implement regular backups

### Security Considerations
- Validate file type on frontend and backend
- Implement file size limits
- Use virus scanning for production
- Sanitize filenames

### User Privacy
- No automatic tracking of PDF downloads
- Files stored securely in database
- Only authenticated admins can upload

## Support & Questions

For issues or questions:
1. Check browser console for errors (F12)
2. Review server logs for backend errors
3. Verify file size is within limits
4. Test with different PDF files
5. Check MongoDB connection

## Summary

The article file upload and PDF download feature enables:
- ✅ Easy PDF management from admin dashboard
- ✅ Seamless PDF viewing on website
- ✅ One-click PDF downloads for users
- ✅ Base64 storage (no external dependencies)
- ✅ Full CRUD operations with files
- ✅ Mobile-friendly interface

Enjoy managing articles with PDFs!
