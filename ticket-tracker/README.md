# Daily Ticket Review Tracker

**A complete ServiceNow ticket management dashboard for associates with Excel upload, edit, and export capabilities.**

![Status](https://img.shields.io/badge/status-LIVE-green)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Features

### Core Functionality
- ✅ **Excel Upload** - Import ServiceNow exports (.xlsx, .csv)
- ✅ **Edit Tickets** - Click any cell or use Edit button to modify
- ✅ **Add Tickets** - Create new tickets directly in the dashboard
- ✅ **Export to Excel** - Download all data with timestamp
- ✅ **Smart Filters** - By Technician, Mode, Concept, Type, Status
- ✅ **Sort Data** - Click column headers to sort
- ✅ **Local Storage** - Auto-saves all changes to browser
- ✅ **No Server Required** - 100% client-side application

### Fields Tracked
- Request ID
- Date
- Resolver Name (Technician)
- Requester
- Subject
- Mode of Support (Store Visit, Remote Support, Phone, Email, Chat)
- Concept
- Type (Incident, Request, Change, Problem)
- Age (days)
- Overdue Status

---

## 📥 How to Use

### Option 1: Open Directly (Easiest)
```bash
1. Download all files (index.html, styles.css, app.js)
2. Double-click index.html
3. Opens in your default browser
4. No installation needed!
```

### Option 2: Local Server

**Using Python:**
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

**Using Node.js:**
```bash
npx http-server
# Visit: http://localhost:8080
```

**Using PHP:**
```bash
php -S localhost:8000
# Visit: http://localhost:8000
```

### Option 3: Cloud Deployment

**GitHub Pages:**
```bash
1. Fork/clone this repo
2. Go to Settings → Pages
3. Set source to 'main' branch
4. Access: https://your-username.github.io/associate-dashboard
```

**Netlify (Free):**
```bash
1. Drag & drop the folder to https://app.netlify.com/drop
2. Instant live deployment
```

**Vercel (Free):**
```bash
1. Import repo: https://vercel.com/new
2. Automatic deployment on every push
```

---

## 📋 Getting Started

### Step 1: Download Template
```
Click "📄 Template" button → Saves ServiceNow_Template_YYYY-MM-DD.xlsx
```

### Step 2: Fill ServiceNow Data
```
Export from ServiceNow with these columns:
- Request ID
- Date
- Resolver Name
- Requester
- Subject
- Mode of support
- Concept
- Type
- Age
- Overdue
```

### Step 3: Upload File
```
Drag & drop into upload area or click "Choose File"
File formats: .xlsx, .xls, .csv
```

### Step 4: Manage Tickets
- **Edit** - Click "✏️ Edit" button
- **Add** - Click "+ New Ticket" button
- **Delete** - Click "🗑️ Delete" button
- **Filter** - Use dropdown filters
- **Sort** - Click column headers
- **Export** - Click "📊 Export" button

---

## 🔄 Data Flow

```
ServiceNow Export (Excel/CSV)
           ↓
    Upload to Tracker
           ↓
    View & Filter Data
           ↓
    Edit/Add/Delete Tickets
           ↓
    Browser Local Storage (Auto-saved)
           ↓
    Export Updated Data (Excel)
```

---

## 💾 Data Storage

**Stored in Browser's Local Storage:**
- Maximum: ~5-10MB per domain
- Persists until cleared
- Survives browser restart
- Private & secure
- No cloud required

### Clear Data
```javascript
// In browser console (F12)
localStorage.clear()
```

---

## 🎯 Filter Options

### Available Filters
- **Technician** - By resolver name
- **Mode** - Store Visit, Remote Support, Phone, Email, Chat
- **Concept** - Category of support
- **Type** - Incident, Request, Change, Problem
- **Status** - All, Overdue, Pending

### Combined Filters
Multiple filters work together:
```
Technician: John Smith
Mode: Remote Support
Concept: Access Management
= Show only John's remote access tickets
```

---

## 📊 Export Features

### What Gets Exported
- ✅ All visible/filtered tickets
- ✅ All columns (Request ID, Date, Technician, etc.)
- ✅ Includes timestamp in filename
- ✅ Excel format (.xlsx)

### Export Naming
```
TicketReview_2026-05-05.xlsx
```

---

## 🔐 Privacy & Security

- ✅ **No Backend** - Data never leaves your browser
- ✅ **No Tracking** - No analytics or telemetry
- ✅ **No Accounts** - No login required
- ✅ **No Cloud** - Completely offline capable
- ✅ **HTTPS Ready** - Safe deployment

---

## 🛠️ Technical Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Data Processing:** XLSX.js (Excel handling)
- **Storage:** Browser Local Storage API
- **Compatibility:** All modern browsers
  - Chrome 60+
  - Firefox 55+
  - Safari 11+
  - Edge 79+

---

## 📱 Responsive Design

- ✅ Desktop (1400px+)
- ✅ Tablet (768px - 1399px)
- ✅ Mobile (< 768px)

---

## 🚨 Troubleshooting

### File Won't Upload
```
1. Check file format (.xlsx, .csv)
2. Check column headers match template
3. Ensure file is not corrupted
4. Try a smaller test file
```

### Data Not Saving
```
1. Check browser Local Storage is enabled
2. Check available storage space
3. Clear browser cache
4. Try different browser
```

### Filter Not Working
```
1. Ensure data is uploaded
2. Check filter values exist in data
3. Click "Clear" to reset filters
```

### Export File Issues
```
1. Check for special characters in data
2. Ensure Excel is installed (to open file)
3. Try Google Sheets or LibreOffice
```

---

## 📈 Performance

- ✅ Handles 10,000+ tickets smoothly
- ✅ Fast filtering & sorting
- ✅ Minimal memory footprint
- ✅ No lag with large datasets

---

## 🎓 Excel Template Columns

| Column | Type | Example | Required |
|--------|------|---------|----------|
| Request ID | Text | INC0001234 | ✅ |
| Date | Date | 2026-05-01 | ✅ |
| Resolver Name | Text | John Smith | ✅ |
| Requester | Text | Alice Johnson | ✅ |
| Subject | Text | System Login Issue | ✅ |
| Mode of support | Text | Remote Support | ✅ |
| Concept | Text | Access Management | ✅ |
| Type | Text | Incident | ✅ |
| Age | Number | 2 | ✅ |
| Overdue | Text | No | ✅ |

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

---

## 📝 License

MIT License - Feel free to use for personal or commercial projects

---

## 💡 Tips & Tricks

### Power User Features
1. **Bulk Operations** - Upload large exports at once
2. **Filter Combinations** - Use multiple filters together
3. **Sort by Age** - Find oldest tickets quickly
4. **Sort by Overdue** - Prioritize overdue items
5. **Export Filtered** - Export only what you need
6. **Keyboard Shortcuts** - Tab through form fields

### Best Practices
1. **Daily Exports** - Keep backups of your data
2. **Regular Updates** - Update ticket status regularly
3. **Clear Filters** - Start fresh each session
4. **Browser Update** - Keep browser up to date
5. **Test Upload** - Try template first before real data

---

## 📞 Support

For issues or questions:
1. Check README thoroughly
2. Review browser console (F12) for errors
3. Try different browser
4. Clear cache and try again

---

## 🎉 What's Next?

- [ ] Add date range filters
- [ ] Add bulk edit features
- [ ] Add data validation
- [ ] Add dark mode
- [ ] Add mobile app version
- [ ] Add cloud sync option
- [ ] Add advanced reporting
- [ ] Add user preferences

---

**Built with ❤️ for ServiceNow users**

Version: 1.0 | Last Updated: 2026-05-05
