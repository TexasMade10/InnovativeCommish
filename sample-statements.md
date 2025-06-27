# Sample Commission Statements for Testing

## Sample 1: Blue Cross Blue Shield Statement
**File Name:** `BCBS_Commission_Statement_Jan2024.pdf`
- **Carrier:** Blue Cross Blue Shield
- **Month:** January 2024
- **Premium:** $125,000
- **Commission:** $12,500
- **Lives:** 1,250
- **Confidence:** 95%

## Sample 2: Aetna Commission Report
**File Name:** `Aetna_Commission_Report_Feb2024.xlsx`
- **Carrier:** Aetna
- **Month:** February 2024
- **Premium:** $89,500
- **Commission:** $8,950
- **Lives:** 895
- **Confidence:** 92%

## Sample 3: UnitedHealth Group Statement
**File Name:** `UnitedHealth_Commission_Mar2024.pdf`
- **Carrier:** UnitedHealth Group
- **Month:** March 2024
- **Premium:** $156,750
- **Commission:** $15,675
- **Lives:** 1,567
- **Confidence:** 88%

## Sample 4: Cigna Commission Data
**File Name:** `Cigna_Commission_Apr2024.xlsx`
- **Carrier:** Cigna
- **Month:** April 2024
- **Premium:** $98,200
- **Commission:** $9,820
- **Lives:** 982
- **Confidence:** 94%

## Sample 5: Humana Commission Statement
**File Name:** `Humana_Commission_May2024.pdf`
- **Carrier:** Humana
- **Month:** May 2024
- **Premium:** $112,300
- **Commission:** $11,230
- **Lives:** 1,123
- **Confidence:** 91%

## How to Test:

1. **Create Test Files:** Create any text file with these names and upload them
2. **Mock Data:** The API will return mock data based on the filename
3. **Workflow Testing:** Follow the complete workflow from upload → review → mapping → dashboard

## Expected Results:
- Total Commission: $58,175
- Total Lives: 5,817
- Total Premium: $581,750
- 5 Different Carriers
- 5 Months of Data (Jan-May 2024)

## Testing Tips:
- Upload multiple files at once
- Test the drag-and-drop functionality
- Verify the confidence scores
- Check the mapping step
- Review the final dashboard metrics 