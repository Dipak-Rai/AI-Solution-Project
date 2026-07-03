# Quick Start - Article PDF Upload & Download

## For Admins: Upload PDF Files

### Step 1: Login to Admin Dashboard
```
URL: http://localhost:5173/admin/login
Username: admin
Password: admin123
```

### Step 2: Navigate to Articles Section
- Click on the **"Articles"** tab in the dashboard

### Step 3: Create New Article with PDF

**Option A: Add New Article**
1. Click **"+ Add New"** button
2. Fill in the form:
   - **Title**: "AI Implementation Guide"
   - **Author**: "Your Name"
   - **Content**: "Article description or summary..."
   - **PDF File**: Click "Upload PDF File" section and select your PDF
3. Confirm file is selected (shows filename)
4. Click **"Save"**
5. See success notification

**Option B: Edit Existing Article to Add/Replace PDF**
1. Find article in table
2. Click **"Edit"** button
3. Make changes if needed
4. Upload new PDF file in the modal
5. Click **"Save"**

### Step 4: Verify Upload
- Check Articles table for 📄 indicator
- Shows filename in "File" column
- File is ready for users to download

---

## For Users: View & Download Articles

### Step 1: Go to Articles Section
```
URL: http://localhost:5173
Scroll to "Articles" section or click in navigation
```

### Step 2: Browse Article Cards
- See grid of article cards
- Notice 📄 badge on articles with PDFs
- "With PDF" indicator shows file availability

### Step 3: Click Article Card to Open
- Card opens showing full article content
- Author name and date displayed
- PDF controls visible if file attached

### Step 4: View or Download PDF

**Option A: Open PDF in Browser**
- Click **"📖 Open PDF"** button
- Opens PDF in new browser tab
- Can read online or print from browser

**Option B: Download PDF to Computer**
- Click **"⬇️ Download PDF"** button
- Browser downloads file to your computer
- Filename automatically set to article title
- Save location: Default downloads folder

### Step 5: Read Offline
- Open downloaded PDF with your PDF reader
- Works on any device (desktop, tablet, phone)
- No internet needed after download

---

## File Upload Tips

### Best Practices
- **File Size**: Keep PDFs under 2-3 MB
- **Quality**: Compress PDFs before upload to reduce size
- **Format**: Only PDF files supported (.pdf)
- **Naming**: Use clear, descriptive filenames

### Supported File Formats
- ✅ PDF files (.pdf)
- ❌ Word documents (.docx) - Not supported
- ❌ Images (.jpg, .png) - Not supported
- ❌ Others - Not supported

### Compression Tips (Before Upload)
**On Mac:**
- Open PDF in Preview
- File → Export → Reduce file size
- Adjust compression level

**On Windows:**
- Use online PDF compressor (ilovepdf.com)
- Or use software like Adobe Acrobat
- Aim for 50-70% size reduction

**Free Online Options:**
- https://www.ilovepdf.com/compress_pdf
- https://www.smallpdf.com/compress-pdf
- https://pdfcompressor.com/

---

## Troubleshooting

### Upload Not Working
**Problem**: File won't upload
**Solution**: 
- Check file is PDF format (.pdf)
- Reduce file size if too large
- Refresh page and try again
- Check browser console for errors

### Download Not Working
**Problem**: Download button doesn't work
**Solution**:
- Try "Open PDF" instead
- Check browser download settings
- Disable pop-up blockers
- Try different browser

### File Too Large Error
**Problem**: Upload fails with size error
**Solution**:
- Compress PDF before uploading
- Split large PDF into multiple articles
- Use online compression tool

### PDF Not Opening
**Problem**: Downloaded file won't open
**Solution**:
- Update your PDF reader
- Download again and retry
- Try online PDF viewer (Google Docs)

---

## Feature Overview

### What's New
| Feature | Status | Details |
|---------|--------|---------|
| Upload PDF in Admin | ✅ Live | Click "Upload PDF File" in article form |
| View PDF online | ✅ Live | "Open PDF" button on article view |
| Download PDF | ✅ Live | "Download PDF" button on article view |
| File indicator | ✅ Live | 📄 badge shows on article cards |
| PDF filename | ✅ Live | Stored and used for downloads |
| Edit PDF | ✅ Live | Replace file when editing article |
| Delete PDF | ✅ Live | Automatic when article deleted |

### Technical Details
- Files stored as Base64 in database
- No external file storage needed
- Works on all browsers
- Mobile-friendly interface
- Automatic filename handling

---

## Common Tasks

### Task 1: Upload Research Paper as Article
1. Admin Dashboard → Articles
2. Click "+ Add New"
3. Title: "Research on AI Ethics"
4. Author: "Research Team"
5. Content: "Key findings from our research..."
6. Upload: research-paper.pdf
7. Save → Users can download!

### Task 2: Update Article with New PDF Version
1. Admin Dashboard → Articles
2. Find article in table
3. Click "Edit"
4. Same modal appears with old file shown
5. Upload new PDF file
6. Save → New version available!

### Task 3: Download Article as User
1. Go to website → Articles section
2. Find article with 📄 badge
3. Click article card
4. Click "⬇️ Download PDF"
5. File saves to Downloads folder

---

## Performance Notes

### Expected Behavior
- **Upload**: Takes 1-2 seconds (depends on file size)
- **Download**: Instant for files under 3MB
- **Storage**: MongoDB stores files (size increases ~33% due to base64)
- **Performance**: Smooth on files under 2MB

### Optimization Tips
- Keep PDF files under 2MB
- Compress images in PDFs
- Use monochrome when possible
- Remove embedded fonts if not needed

---

## Statistics

### Usage Metrics
- **Articles with PDF**: Shows in admin dashboard
- **File Upload Format**: Base64 encoded
- **Storage Method**: MongoDB database
- **Download Format**: Original PDF format
- **Browser Support**: All modern browsers

### Limitations
- **Max File Size**: ~3MB (practical limit)
- **Database Limit**: 16MB per document
- **Format**: PDF only
- **Storage**: In MongoDB (not cloud)

---

## Future Enhancements

Coming Soon:
- [ ] Multiple files per article
- [ ] Different file types (DOCX, XLSX)
- [ ] Cloud storage (AWS S3)
- [ ] File preview thumbnails
- [ ] Drag & drop upload
- [ ] Upload progress bar
- [ ] Bulk article import

---

## Support

### Quick Fixes
1. **Page not loading?** → Refresh browser
2. **Can't upload?** → Check file size
3. **Download not working?** → Try different browser
4. **PDF corrupted?** → Upload again

### Need Help?
- Check browser console (F12) for errors
- Review admin dashboard guide
- Check article file size
- Verify PDF file is valid

---

## Summary

✅ **For Admins**:
- Upload PDFs in article editor
- See file status in table
- Edit/replace files anytime

✅ **For Users**:
- View articles with PDF
- Open PDFs in browser
- Download to computer
- Read offline

Enjoy the new PDF feature!
