# 🚀 Commission Tracker Workflow Testing Guide

## 🎯 **What's New**
The app now has a **step-by-step workflow** that guides users through the entire commission statement processing:

1. **📥 Upload** - Drag & drop commission statements
2. **📋 Review** - Check parsed data accuracy  
3. **🗺️ Mapping** - Verify field mappings
4. **📊 Dashboard** - View live metrics and reports

## 🧪 **How to Test**

### **Step 1: Setup Database**
1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Run the `sample-data.sql` file to populate with realistic data
4. This will add 10 sample statements, 8 carriers, 5 reps, and 5 companies

### **Step 2: Test the Workflow**

#### **Upload Step**
- Create test files with these names (any content works):
  - `BCBS_Commission_Jan2024.pdf`
  - `Aetna_Commission_Feb2024.xlsx`
  - `UnitedHealth_Commission_Mar2024.pdf`
  - `Cigna_Commission_Apr2024.xlsx`
  - `Humana_Commission_May2024.pdf`

- **Drag & drop** multiple files at once
- Watch the **progress indicators** show processing status
- See **confidence scores** for each parsed statement

#### **Review Step**
- **Verify extracted data** for each statement
- Check **carrier names** are correctly identified
- Review **commission amounts** and **lives count**
- Use **Edit** and **Flag Issue** buttons (future feature)

#### **Mapping Step**
- See **mapping summary** with totals
- Review **field mappings** for each carrier
- Confirm **premium**, **commission**, and **lives** fields are mapped

#### **Dashboard Step**
- View **live metrics** from your database
- See **recent activity** with real statement data
- Check **carrier status** and **rep performance**
- Use **quick actions** to upload more or view reports

### **Step 3: Test Features**

#### **AI Copilot (Right Sidebar)**
- Ask questions about your data
- Get insights on commission trends
- Request help with specific carriers

#### **Real-time Updates**
- Upload new statements and see dashboard update
- Check that carriers are automatically added
- Verify commission totals are calculated correctly

## 📊 **Expected Results**

After running the sample data, you should see:

### **Dashboard Metrics**
- **Total Commissions**: ~$118,835
- **Lives Covered**: ~11,883
- **Carrier Count**: 8 active carriers
- **Statements Processed**: 10 total

### **Recent Activity**
- 10 recent commission statements
- Mix of PDF and Excel files
- Various confidence scores (85-96%)
- Different carriers and months

### **Carriers**
- Blue Cross Blue Shield (Active)
- Aetna (Active) 
- UnitedHealth Group (Active)
- Cigna (Active)
- Humana (Active)
- Kaiser Permanente (Pending)
- Anthem (Active)
- MetLife (Flagged)

## 🔧 **Troubleshooting**

### **If Upload Doesn't Work**
- Check browser console for errors
- Verify `.env.local` has correct Supabase credentials
- Make sure dev server is running on `http://localhost:3002`

### **If Database is Empty**
- Run the `sample-data.sql` in Supabase SQL Editor
- Check that tables exist with correct schema
- Verify API endpoints are working

### **If AI Copilot Doesn't Respond**
- Check that the sidebar is visible
- Try refreshing the page
- Verify parsed data is being passed correctly

## 🎉 **Success Indicators**

✅ **Workflow flows smoothly** from upload → review → mapping → dashboard  
✅ **Real data appears** in dashboard metrics  
✅ **File processing** shows progress indicators  
✅ **Confidence scores** display correctly  
✅ **AI copilot** responds to questions  
✅ **Database updates** with new uploads  

## 🚀 **Next Steps**

Once testing is complete:
1. **Deploy to Vercel** for production use
2. **Add real OpenAI API** for actual document parsing
3. **Implement user authentication**
4. **Add more advanced reporting features**

---

**Need help?** Check the terminal output and browser console for any error messages! 