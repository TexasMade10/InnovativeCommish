# Vercel Error Codes - Quick Reference

## 🚨 Most Common Errors (Fix These First)

| Error Code | Type | Quick Fix |
|------------|------|-----------|
| **FUNCTION_INVOCATION_FAILED** | Function500 | Test build locally: `npm run build` |
| **BODY_NOT_A_STRING_FROM_FUNCTION** | Function502 | Check component returns valid JSX |
| **DEPLOYMENT_BLOCKED** | Deployment403 | Check repository permissions |
| **NOT_FOUND** | Deployment404 | Verify file structure and entry points |
| **DEPLOYMENT_NOT_FOUND** | Deployment404 | Check if deployment was deleted |

## 🔧 Build & Function Errors

### **Function500 Series**
- **FUNCTION_INVOCATION_FAILED**: Build process failed
  ```bash
  # Fix: Test locally first
  npm install
  npm run build
  ```

- **EDGE_FUNCTION_INVOCATION_FAILED**: Edge function error
  ```bash
  # Fix: Check edge function code
  # Ensure proper exports and syntax
  ```

### **Function502 Series**
- **BODY_NOT_A_STRING_FROM_FUNCTION**: Invalid component return
  ```tsx
  // ✅ Correct
  const Component = () => <div>Hello</div>
  
  // ❌ Wrong
  const Component = () => "Hello"
  ```

- **NO_RESPONSE_FROM_FUNCTION**: Component not returning anything
  ```tsx
  // ✅ Correct
  const Component = () => {
    return <div>Hello</div>
  }
  ```

### **Function504 Series**
- **FUNCTION_INVOCATION_TIMEOUT**: Function took too long
  - Increase timeout in `vercel.json`
  - Optimize code performance

## 🚀 Deployment Errors

### **Deployment403**
- **DEPLOYMENT_BLOCKED**: Access denied
  - Check GitHub repository permissions
  - Verify Vercel account limits
  - Ensure repository is accessible

### **Deployment404**
- **DEPLOYMENT_NOT_FOUND**: Deployment doesn't exist
  - Check if deployment was deleted
  - Verify deployment URL
  - Re-deploy if necessary

- **NOT_FOUND**: Missing files or wrong structure
  ```
  Required files:
  ├── pages/_app.tsx
  ├── pages/index.tsx
  ├── package.json
  ├── next.config.js
  └── tsconfig.json
  ```

### **Deployment410**
- **DEPLOYMENT_DELETED**: Deployment was removed
  - Re-deploy from Vercel dashboard
  - Check deployment history

## 🌐 DNS & Routing Errors

### **DNS502 Series**
- **DNS_HOSTNAME_NOT_FOUND**: Domain not found
  - Check domain configuration
  - Verify DNS settings

### **Routing502 Series**
- **ROUTER_CANNOT_MATCH**: Route not found
  - Check Next.js routing
  - Verify page files exist

## ⚡ Performance & Timeout Errors

### **Function504**
- **FUNCTION_INVOCATION_TIMEOUT**: Function timeout
  ```json
  // In vercel.json
  {
    "functions": {
      "pages/api/**/*.ts": {
        "maxDuration": 30
      }
    }
  }
  ```

### **Function413**
- **FUNCTION_PAYLOAD_TOO_LARGE**: Request too large
  - Reduce payload size
  - Use streaming for large data

## 🔍 Quick Diagnostic Commands

```bash
# 1. Test build locally
npm run build

# 2. Check TypeScript
npm run type-check

# 3. Check linting
npm run lint

# 4. Test development server
npm run dev

# 5. Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## 🛠 Emergency Fixes

### **If Build Fails Immediately**
```bash
# Nuclear option - start fresh
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

### **If Components Don't Render**
1. Check browser console for errors
2. Verify all imports are correct
3. Ensure components return valid JSX
4. Check for missing dependencies

### **If Styling Issues**
1. Verify styled-jsx is working
2. Check for CSS conflicts
3. Ensure responsive design works

## 📞 When to Contact Vercel Support

Contact Vercel support for these **Internal500** errors:
- **INTERNAL_FUNCTION_SERVICE_UNAVAILABLE**
- **INTERNAL_CACHE_ERROR**
- **INTERNAL_UNEXPECTED_ERROR**
- **INTERNAL_DEPLOYMENT_FETCH_FAILED**

## 🎯 Deployment Checklist

Before deploying:
- [ ] `npm run build` works locally
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] All files committed to Git
- [ ] Repository is accessible to Vercel
- [ ] Environment variables set (if needed)

---

**Remember**: Most errors can be resolved by testing locally first and ensuring all files are properly committed to Git. 