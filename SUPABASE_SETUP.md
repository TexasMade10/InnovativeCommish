# 🚀 Supabase Setup Guide

## Step 1: Create a Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Create a new project**
3. **Wait for the project to be ready** (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. **Create a `.env.local` file** in your project root
2. **Add your credentials:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up the Database

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the entire contents** of `supabase-schema.sql`
3. **Paste and run** the SQL in the editor
4. **This will create all the tables and sample data**

## Step 5: Test the App

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Open http://localhost:3000**

3. **Test the features:**
   - Upload a file in the "Statement Upload" tab
   - Check the "Dashboard" tab for live metrics
   - View "Carriers" and "Reps" tabs with real data
   - Chat with the AI assistant

## 🎯 What You'll See

### **Dashboard Tab:**
- Live metrics from your database
- Recent activity feed
- Real-time updates when you upload files

### **Carriers Tab:**
- Sample carriers (Blue Cross, Aetna, Cigna, UnitedHealth)
- Status indicators (active, pending, flagged)
- Setup dates and notes

### **Reps Tab:**
- Sample reps (John Smith, Sarah Johnson, Mike Davis)
- Commission rates and earnings
- Contact information

### **Statement Upload:**
- File upload with real parsing
- Data saved to Supabase
- Automatic carrier detection

## 🔧 Troubleshooting

### **"Missing Supabase environment variables"**
- Make sure your `.env.local` file exists
- Check that the variable names are exactly correct
- Restart your dev server after adding the file

### **"Failed to fetch data"**
- Check your Supabase project is active
- Verify your API keys are correct
- Make sure you ran the SQL schema

### **"Database connection error"**
- Check your Supabase project URL
- Verify your anon key is correct
- Make sure your project is not paused

## 🚀 Next Steps

Once Supabase is working, you can:

1. **Add real GPT integration** (replace mock parsing)
2. **Build out the Companies tab** with real data
3. **Add user authentication** and roles
4. **Create more advanced dashboards**
5. **Add real-time notifications**

## 📞 Need Help?

- Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Look at the console for error messages
- Make sure all environment variables are set correctly

---

**🎉 You're all set! Your commission tracker now has a real database and can persist data between sessions.** 