# INTERNAL UAT — TPCO Platform (Updated)

---

## Internal UAT Summary — Admin

| Module | Total Cases | Passed | Failed | Blocked | Pass % |
|---|---|---|---|---|---|
| Authentication | 7 | 0 | 0 | 0 | 0% |
| Dashboard | 4 | 0 | 0 | 0 | 0% |
| Content Management | 3 | 0 | 0 | 0 | 0% |
| News Management | 6 | 0 | 0 | 0 | 0% |
| Events Management | 5 | 0 | 0 | 0 | 0% |
| Patent Management | 10 | 0 | 0 | 0 | 0% |
| IP Application Management | 8 | 0 | 0 | 0 | 0% |
| Services & Resources Management | 7 | 0 | 0 | 0 | 0% |
| User Management | 3 | 0 | 0 | 0 | 0% |
| **Progress** | **0** | | | | |

## Internal UAT Summary — Faculty

| Module | Total Cases | Passed | Failed | Blocked | Pass % |
|---|---|---|---|---|---|
| Faculty Authentication | 3 | 0 | 0 | 0 | 0% |
| Faculty Dashboard | 2 | 0 | 0 | 0 | 0% |
| Faculty IP Application Form | 5 | 0 | 0 | 0 | 0% |
| Faculty Application Tracking | 2 | 0 | 0 | 0 | 0% |
| Faculty Notifications | 2 | 0 | 0 | 0 | 0% |
| **Progress** | **0** | | | | |

## Internal UAT Summary — General User

| Module | Total Cases | Passed | Failed | Blocked | Pass % |
|---|---|---|---|---|---|
| Public Pages | 7 | 0 | 0 | 0 | 0% |
| AI Assistant (Tepee) | 5 | 0 | 0 | 0 | 0% |
| **Progress** | **0** | | | | |

---

# ADMIN MODULES

---

## INTERNAL UAT — Authentication

| Field | Value |
|---|---|
| Module | Authentication |
| System Component | Web |
| User Role Involved | Admin, Faculty |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-01: Admin Login with Valid Credentials

| Field | Value |
|---|---|
| Scenario | Admin accesses the system through secure login |
| Pre-condition | Admin account has been created and verified via Supabase Auth |
| Test Steps | 1. Navigate to the website URL 2. Click "Login" or navigate to /admin 3. Enter valid admin email and password 4. Click "Sign In" |
| Expected Result | Admin is redirected to the Admin Dashboard. Dashboard statistics are displayed. Navigation tabs are visible (Dashboard, Content, News, Events, Patents, IP Applications, Services, Resources, Users). |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-02: Admin Login with Invalid Credentials

| Field | Value |
|---|---|
| Scenario | Admin attempts login with incorrect credentials |
| Pre-condition | Admin account exists |
| Test Steps | 1. Navigate to the login page 2. Enter valid email but incorrect password 3. Click "Sign In" |
| Expected Result | Error message is displayed ("Invalid email/username or password."). Admin is not redirected to the dashboard. Login form remains on screen. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-03: Admin Login with "admin" Username Shorthand

| Field | Value |
|---|---|
| Scenario | Admin types "admin" as the username instead of a full email address |
| Pre-condition | At least one admin account exists in user_profiles |
| Test Steps | 1. Navigate to the login page 2. Type "admin" in the username field 3. Enter the correct password 4. Click "Sign In" |
| Expected Result | System resolves the "admin" username to the admin user's email automatically. Admin is logged in and redirected to the Admin Dashboard. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | The system looks up the email from user_profiles where role='admin'. |

### TC-04: Google OAuth Login (USTP Email)

| Field | Value |
|---|---|
| Scenario | User signs in via Google OAuth using a USTP university email (@ustp.edu.ph) |
| Pre-condition | Google OAuth is configured; no existing user_profiles row for this Google account |
| Test Steps | 1. Navigate to the login page 2. Click the Google Sign-In button 3. Select a USTP email account (@ustp.edu.ph) 4. Complete Google authentication |
| Expected Result | A new faculty profile is auto-created in user_profiles with role='faculty' and status='active'. User is redirected to the Faculty Dashboard (/faculty). |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-05: Google OAuth Login (Non-USTP Email Rejected)

| Field | Value |
|---|---|
| Scenario | User attempts Google OAuth with a non-USTP email address |
| Pre-condition | Google OAuth is configured |
| Test Steps | 1. Navigate to the login page 2. Click the Google Sign-In button 3. Select a non-USTP email account (e.g., @gmail.com) 4. Complete Google authentication |
| Expected Result | Error message is displayed: "Please use your USTP university email (@ustp.edu.ph) to sign in." User is signed out automatically and remains on the login page. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-06: Session Persistence / Auto-Login on Reload

| Field | Value |
|---|---|
| Scenario | Admin reloads the page or opens a new tab while still having an active Supabase session |
| Pre-condition | Admin is already logged in |
| Test Steps | 1. While logged in as admin, refresh the browser page 2. Observe the login state |
| Expected Result | Admin remains logged in after page reload. The Admin Dashboard is displayed without requiring re-authentication. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Supabase auth.getSession() checks for existing session on component mount. |

### TC-07: Inactive Account Login Blocked

| Field | Value |
|---|---|
| Scenario | A user with an inactive account status attempts to log in |
| Pre-condition | A user account exists with status='inactive' in user_profiles |
| Test Steps | 1. Navigate to the login page 2. Enter the inactive user's email and password 3. Click "Sign In" |
| Expected Result | Error message is displayed: "Your account is inactive. Please contact an administrator." User is signed out and remains on the login page. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Dashboard

| Field | Value |
|---|---|
| Module | Dashboard |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-08: View Dashboard Statistics

| Field | Value |
|---|---|
| Scenario | Admin views system overview metrics |
| Pre-condition | Admin is logged in |
| Test Steps | 1. Navigate to Admin Dashboard 2. Observe the statistics cards |
| Expected Result | Dashboard displays: Total Patents count, Published News count, Upcoming Events count, Service Requests count, Licensed Revenue amount. Recent Activities section shows latest actions. Notification bell is visible in the header. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Stats are loaded from get_dashboard_stats RPC or admin_dashboard_stats fallback table. |

### TC-09: View Recent Activities

| Field | Value |
|---|---|
| Scenario | Admin reviews recent system activities |
| Pre-condition | Admin is logged in; at least one activity log entry exists |
| Test Steps | 1. On the Dashboard, observe the Recent Activities section 2. Click "View All" to open the activity modal |
| Expected Result | Recent Activities section shows the latest 10 activities with type, action, title, and relative timestamp. Activity modal displays all activities with pagination (5 per page). |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-10: Filter Activity Logs by Type

| Field | Value |
|---|---|
| Scenario | Admin filters activity logs by activity type |
| Pre-condition | Activity modal is open; multiple activity types exist |
| Test Steps | 1. Open the Activity modal 2. Select a filter option (e.g., "News", "Patent", "Service") 3. Observe the filtered results |
| Expected Result | Only activities matching the selected type are displayed. Changing the filter reloads and re-displays the results. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-11: Export Activity Logs to CSV

| Field | Value |
|---|---|
| Scenario | Admin exports activity logs as a CSV file |
| Pre-condition | Activity modal is open with at least one activity entry |
| Test Steps | 1. Open the Activity modal 2. Click the "Export CSV" button |
| Expected Result | A CSV file is downloaded containing Date, Type, Action, Title, and Description columns. File is named activity_logs_YYYY-MM-DD.csv. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Content Management

| Field | Value |
|---|---|
| Module | Content Management |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-12: Update Homepage Hero Content

| Field | Value |
|---|---|
| Scenario | Admin updates the public homepage hero section |
| Pre-condition | Admin is logged in; at least one homepage content record exists |
| Test Steps | 1. Click "Content" tab 2. Modify the hero title text 3. Modify the hero subtitle text 4. Click "Save" |
| Expected Result | Changes are saved successfully. When navigating to the public homepage, the updated hero title and subtitle are displayed. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-13: Upload Hero Image

| Field | Value |
|---|---|
| Scenario | Admin uploads a new hero background image |
| Pre-condition | Admin is logged in; on the Content tab |
| Test Steps | 1. Click "Content" tab 2. Click the hero image upload area 3. Select an image file 4. Click "Save" |
| Expected Result | Image is uploaded and saved as base64. The public homepage displays the new hero image. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Image is stored as base64 in admin_homepage_content.hero_image_url. |

### TC-14: Update Impact Statistics

| Field | Value |
|---|---|
| Scenario | Admin updates the Impact Statistics counters on the homepage |
| Pre-condition | Admin is logged in; on the Content tab |
| Test Steps | 1. Click "Content" tab 2. Locate the Impact Statistics section 3. Modify the Partners count value 4. Modify the Technologies count value 5. Click "Save" for Impact Statistics |
| Expected Result | Partners and Technologies counts are saved. Patents Granted is auto-derived from the IP Portfolio (not manually editable). Public homepage Impact Stats section reflects the updated values. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Patents count is derived live from admin_patents where published=true and status != 'Draft'. |

---

## INTERNAL UAT — News Management

| Field | Value |
|---|---|
| Module | News Management |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-15: Create and Publish News Article

| Field | Value |
|---|---|
| Scenario | Admin publishes a new news article |
| Pre-condition | Admin is logged in |
| Test Steps | 1. Click "News" tab 2. Click "Add News" button 3. Enter title, category, author, excerpt, full content 4. Upload cover image 5. Set publication status to "Published" 6. Click "Publish" |
| Expected Result | News article is saved with status "Published" and appears in the Published news list. Article is visible on the public Latest News page. Dashboard Published News count increases. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Content images and YouTube URL are optional fields. Activity is logged by DB trigger. |

### TC-16: Save News Article as Draft

| Field | Value |
|---|---|
| Scenario | Admin saves a news article without publishing |
| Pre-condition | Admin is logged in |
| Test Steps | 1. Click "News" tab 2. Click "Add News" button 3. Enter title and content (minimum required) 4. Click "Save as Draft" |
| Expected Result | News article is saved with status "Draft" and published=false. Article appears in the Drafts tab but NOT on the public Latest News page. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-17: Edit News Article

| Field | Value |
|---|---|
| Scenario | Admin modifies an existing news article |
| Pre-condition | At least one news article exists |
| Test Steps | 1. Click "News" tab 2. Select an existing article 3. Click the Edit button 4. Modify the title or content 5. Click "Publish" or "Save as Draft" |
| Expected Result | Changes are saved. Updated content is reflected on the public news page (if published). Existing content images are preserved; new images can be added. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-18: Duplicate News Article

| Field | Value |
|---|---|
| Scenario | Admin duplicates an existing news article for use as a template |
| Pre-condition | At least one news article exists |
| Test Steps | 1. Click "News" tab 2. Select an existing article 3. Click the Duplicate button 4. Observe the pre-filled form |
| Expected Result | A copy of the article is loaded into the form with title appended with " (Copy)". Admin can modify and save it as a new article. Original article is unchanged. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-19: Archive News Article

| Field | Value |
|---|---|
| Scenario | Admin archives an outdated news article |
| Pre-condition | At least one published news article exists |
| Test Steps | 1. Click "News" tab 2. Select a published article 3. Click the Archive button 4. Confirm action |
| Expected Result | Article no longer appears on the public Latest News page. Article is listed under the Archived tab in the admin panel. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-20: Delete News Article

| Field | Value |
|---|---|
| Scenario | Admin permanently deletes a news article |
| Pre-condition | At least one news article exists |
| Test Steps | 1. Click "News" tab 2. Select an article 3. Click the Delete button 4. Confirm deletion in the confirmation dialog |
| Expected Result | Confirmation dialog appears with the article title. After confirming, the article is permanently removed from the database. Article no longer appears in any admin tab or public page. If the article was published, the dashboard Published News count decreases. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Events Management

| Field | Value |
|---|---|
| Module | Events Management |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-21: Create Event

| Field | Value |
|---|---|
| Scenario | Admin creates a new event listing |
| Pre-condition | Admin is logged in |
| Test Steps | 1. Click "Events" tab 2. Click "Add Event" 3. Enter event title, type, date, time, location, capacity, description 4. Upload event image 5. Set registration to "Open" 6. Click "Save" |
| Expected Result | Event is saved and appears in the Active events list. Event is visible on the public Events page with registration open. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-22: Edit Event

| Field | Value |
|---|---|
| Scenario | Admin modifies an existing event |
| Pre-condition | At least one event exists |
| Test Steps | 1. Click "Events" tab 2. Select an existing event 3. Click Edit 4. Modify the title, date, or other fields 5. Click "Save" |
| Expected Result | Changes are saved and reflected in the events list and public Events page. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-23: Track Event Registrations

| Field | Value |
|---|---|
| Scenario | Admin views attendee registrations for an event |
| Pre-condition | At least one event has registrations from users |
| Test Steps | 1. Click "Events" tab 2. Select an event with registrations 3. Click the Registrations/Attendees button |
| Expected Result | Registration count and attendee details are displayed in a modal. Attendee list shows name, email, phone, organization, and registration date. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-24: Archive/Restore Event

| Field | Value |
|---|---|
| Scenario | Admin archives a completed event or restores an archived event |
| Pre-condition | At least one event exists |
| Test Steps | 1. Click "Events" tab 2. Switch to Active/Archived tab 3. Select an event 4. Click Archive (or Restore) |
| Expected Result | Archived event moves to the Archived tab and is no longer visible on the public Events page. Restored event returns to the Active tab and reappears on the public Events page. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Events with past dates or Completed/Cancelled status automatically appear in Archived tab. |

### TC-25: Search and Filter Events

| Field | Value |
|---|---|
| Scenario | Admin searches for an event and filters by type |
| Pre-condition | Multiple events of different types exist |
| Test Steps | 1. Click "Events" tab 2. Type a keyword in the search bar 3. Select an event type from the filter dropdown |
| Expected Result | Event list is filtered by search term and event type. Results update in real time. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Patent Management

| Field | Value |
|---|---|
| Module | Patent Management |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-26: Add Patent Entry

| Field | Value |
|---|---|
| Scenario | Admin adds a new patent to the IP portfolio |
| Pre-condition | Admin is logged in |
| Test Steps | 1. Click "Patents" tab 2. Click "Add Patent" 3. Enter title, patent number, inventors, field, abstract, description, status, year 4. Upload file(s)/attachments 5. Click "Save" |
| Expected Result | Patent is saved and appears in the patent list with published=true by default. Patent is visible on the public IP Portfolio page. Multiple files can be uploaded and are stored in Supabase Storage. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Default status is "Filed". New patents start as published. |

### TC-27: Edit Patent (Modal)

| Field | Value |
|---|---|
| Scenario | Admin edits an existing patent entry |
| Pre-condition | At least one patent entry exists |
| Test Steps | 1. Click "Patents" tab 2. Select a patent 3. Click Edit to open the edit modal 4. Modify fields (title, inventors, status, etc.) 5. Optionally add new files or mark existing files for deletion 6. Click "Save" |
| Expected Result | Changes are saved. Updated patent data is reflected in the patent list and public IP Portfolio. New files are uploaded; files marked for deletion are removed. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-28: View Patent Detail (Modal)

| Field | Value |
|---|---|
| Scenario | Admin views full patent details in a detail modal |
| Pre-condition | At least one patent entry exists |
| Test Steps | 1. Click "Patents" tab 2. Click on a patent to open the detail modal 3. Review all fields and attached files |
| Expected Result | Patent detail modal displays: title, patent number, inventors, field, abstract, description, status, year, attached files. Files can be downloaded from the modal. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-29: View Patent Analytics Summary

| Field | Value |
|---|---|
| Scenario | Admin reviews patent portfolio statistics |
| Pre-condition | At least one patent entry exists |
| Test Steps | 1. Click "Patents" tab 2. Observe the Patent Analytics Summary section |
| Expected Result | Summary displays: Total Applications count, Approved Patents count, Under Review count, and other status breakdowns. Brochure-style pie charts visualize status distribution and field distribution. Counts match the actual patent records. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | PatentAnalyticsCard component with BrochurePieCharts. |

### TC-30: Record Licensed Revenue

| Field | Value |
|---|---|
| Scenario | Admin records revenue generated from a licensed patent |
| Pre-condition | At least one patent entry exists |
| Test Steps | 1. Click "Patents" tab 2. Locate the Licensed Revenue input 3. Enter or update the revenue amount 4. Click "Save" |
| Expected Result | Revenue amount is saved. Updated value appears in the patent details and dashboard statistics. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-31: Bulk Entry via CSV Upload

| Field | Value |
|---|---|
| Scenario | Admin adds multiple patents in bulk via CSV file |
| Pre-condition | Prepared CSV file for Bulk upload with the required columns |
| Test Steps | 1. Upload a .csv file via Bulk Upload button |
| Expected Result | Patents from the CSV are imported. Bulk-uploaded patents start with status "Filed" and published=false, so they do NOT appear on the public IP Portfolio until admin edits each one and publishes it. A visual indicator flags recently bulk-uploaded patents in the admin list. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Recently bulk-uploaded patent IDs are tracked in localStorage for the indicator. |

### TC-32: Export Analytics Report

| Field | Value |
|---|---|
| Scenario | Admin exports the Patent Analytics Summary report |
| Pre-condition | Must have Patent data for the Patent Analytics Summary |
| Test Steps | 1. Click on "Export CSV" button in Patent Analytics Summary 2. Select sections to export 3. Click "Download CSV" |
| Expected Result | A CSV file is downloaded containing the patent analytics data. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-33: Download Patent Portfolio (All)

| Field | Value |
|---|---|
| Scenario | Admin downloads all patents' contents |
| Pre-condition | Must have Patent data for exporting |
| Test Steps | 1. Click on "Download CSV" button in Existing Patents section 2. Select Fields to include 3. Click on "Download CSV" button |
| Expected Result | A CSV file is downloaded containing all patent records with the selected fields. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-34: Download Patent Portfolio (Selected)

| Field | Value |
|---|---|
| Scenario | Admin downloads selected patents' content/s |
| Pre-condition | Must have Patent data for exporting |
| Test Steps | 1. Click on "Download CSV" button in Existing Patents section 2. Click on the "Selected patents only" option 3. Check the patents to export 4. Select Fields to include 5. Click on "Download CSV" button |
| Expected Result | A CSV file is downloaded containing only the selected patent records with the selected fields. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-35: Publish/Unpublish Patent Toggle

| Field | Value |
|---|---|
| Scenario | Admin toggles the visibility of a patent on the public IP Portfolio |
| Pre-condition | At least one patent entry exists |
| Test Steps | 1. Click "Patents" tab 2. Find a patent 3. Click the Eye/EyeOff icon to toggle published status |
| Expected Result | When unpublished, the patent no longer appears on the public IP Portfolio page. When published, it reappears. The patent remains in the admin list regardless. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Homepage Patents Granted count is derived from published patents only. |

---

## INTERNAL UAT — IP Application Management

| Field | Value |
|---|---|
| Module | IP Application Management |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-36: Review Faculty IP Application

| Field | Value |
|---|---|
| Scenario | Admin reviews a submitted IP application |
| Pre-condition | At least one faculty application with status "Submitted for Internal Review" exists |
| Test Steps | 1. Click "IP Applications" tab 2. Select an application with "Submitted for Internal Review" status 3. Review applicant information, invention details, and uploaded documents |
| Expected Result | Application details are displayed including: applicant name, IP type, title, abstract, co-inventors, uploaded attachments, and admin-provided files (if any). Status summary counts are accurate. Faculty comment count indicator is visible. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-37: Add Review Comment to Application

| Field | Value |
|---|---|
| Scenario | Admin provides feedback on a faculty IP application |
| Pre-condition | At least one submitted application exists |
| Test Steps | 1. Click "IP Applications" tab 2. Select an application 3. Open the detail modal 4. Navigate to the comments section 5. Enter a review comment 6. Click "Submit Comment" |
| Expected Result | Comment is saved and visible in the application's comment history. Faculty member receives a notification about the new comment. Comment shows commenter name and role ("IP Committee"). |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-38: Request Revision on Application

| Field | Value |
|---|---|
| Scenario | Admin requires changes to a faculty IP application |
| Pre-condition | At least one application with "Submitted for Internal Review" status exists |
| Test Steps | 1. Click "IP Applications" tab 2. Select the application 3. Add a comment explaining required changes 4. Change status from "Submitted for Internal Review" to "Needs Revision" 5. Confirm status change |
| Expected Result | Application status updates to "Needs Revision". Status history logs the transition. Faculty member receives a notification about the revision request. Application appears under the "Needs Revision" count. Comment is required for this action. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Comment is required when flagging for revision; validation prevents proceeding without a comment. |

### TC-39: Approve Application for IPOPHL Filing

| Field | Value |
|---|---|
| Scenario | Admin approves a faculty application for IPOPHL submission |
| Pre-condition | At least one application with "Submitted for Internal Review" or "Needs Revision" (after resubmission) status exists |
| Test Steps | 1. Click "IP Applications" tab 2. Select the application 3. Change status to "Approved for IPOPHL Filing" 4. Confirm status change |
| Expected Result | Application status updates to "Approved for IPOPHL Filing". Faculty member receives a notification about the approval. Status history logs the transition. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-40: Record IPOPHL Filing Details

| Field | Value |
|---|---|
| Scenario | Admin records filing information after submitting to IPOPHL |
| Pre-condition | At least one application with "Approved for IPOPHL Filing" status exists |
| Test Steps | 1. Click "IP Applications" tab 2. Select the approved application 3. Change status to "Filed to IPOPHL" 4. Enter the IPOPHL filing date 5. Enter the IPOPHL application number 6. Save changes |
| Expected Result | Application status updates to "Filed to IPOPHL". Filing date and reference number are saved. Faculty member receives a notification. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-41: Grant IP Application

| Field | Value |
|---|---|
| Scenario | Admin marks an IP application as Granted |
| Pre-condition | At least one application with "Filed to IPOPHL" or similar status exists |
| Test Steps | 1. Click "IP Applications" tab 2. Select the application 3. Select the "Granted" action 4. Upload at least one certification file (required) 5. Optionally add notes 6. Confirm |
| Expected Result | Application status updates to "Granted". If the application was archived, it is automatically restored (is_archived=false) so it appears in the faculty's Granted tab. Certification file is uploaded and visible to the faculty member. Faculty member receives a notification. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | At least one certification file is required; validation prevents proceeding without one. Auto-restore on Granted ensures the Granted stat card count matches. |

### TC-42: Reject IP Application

| Field | Value |
|---|---|
| Scenario | Admin rejects a faculty IP application |
| Pre-condition | At least one submitted application exists |
| Test Steps | 1. Click "IP Applications" tab 2. Select the application 3. Select the "Reject" action 4. Enter a comment explaining the rejection (required) 5. Confirm |
| Expected Result | Application status updates to "Rejected". Faculty member receives a notification. Comment is required for rejection; validation prevents proceeding without a comment. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-43: Search and Filter IP Applications

| Field | Value |
|---|---|
| Scenario | Admin searches for an application and filters by status or IP type |
| Pre-condition | Multiple IP applications exist |
| Test Steps | 1. Click "IP Applications" tab 2. Type a keyword in the search bar (title, applicant name, or email) 3. Select a status from the status filter dropdown 4. Select an IP type from the type filter dropdown |
| Expected Result | Application list is filtered by search term, status, and IP type. Results update in real time. Pagination adjusts to the filtered result count. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Services & Resources Management

| Field | Value |
|---|---|
| Module | Services & Resources Management |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-44: Manage Service Offerings (Add/Edit)

| Field | Value |
|---|---|
| Scenario | Admin adds or edits a service listing |
| Pre-condition | Admin is logged in |
| Test Steps | 1. Click "Services" tab 2. Click "Add Service" (or edit an existing one) 3. Enter service name, description, icon, features (add/remove), process steps (add/remove), pricing, timeline, order number 4. Click "Save" |
| Expected Result | Service is saved and appears on the public Services page with all details displayed. Features and process steps can be dynamically added and removed. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-45: Publish/Unpublish Service

| Field | Value |
|---|---|
| Scenario | Admin toggles the published status of a service |
| Pre-condition | At least one service exists |
| Test Steps | 1. Click "Services" tab 2. Find a service 3. Click the Eye/EyeOff icon to toggle published status |
| Expected Result | When unpublished, the service no longer appears on the public Services page. When published, it reappears. The service remains in the admin list regardless. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-46: View Service Request Logs

| Field | Value |
|---|---|
| Scenario | Admin reviews submitted service requests |
| Pre-condition | At least one service request has been submitted by a user |
| Test Steps | 1. Click "Services" tab 2. Navigate to "Service Request Logs" section 3. View submitted requests 4. Switch between Active and Archived tabs |
| Expected Result | Service request details are displayed: requester name, email, phone, organization, service type, status, and submission date. Active and archived requests are separated by tabs. Search and status filter are available. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-47: Manage Resources (Add/Edit)

| Field | Value |
|---|---|
| Scenario | Admin adds a new resource document |
| Pre-condition | Admin is logged in |
| Test Steps | 1. Click "Resources" tab 2. Click "Add Resource" 3. Enter title, category (Templates/Guidelines), type, description 4. Upload file or enter URL 5. Click "Save" |
| Expected Result | Resource is saved and appears on the public Resources page. Download link works correctly. Resources are separated into Templates and Guidelines tabs. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-48: Unpublish a Resource

| Field | Value |
|---|---|
| Scenario | Admin unpublishes a Template/Guideline |
| Pre-condition | Existing Template/Guideline is published |
| Test Steps | 1. Click "Resources" tab 2. Click the "Eye slash" icon to Unpublish a Resource |
| Expected Result | Resource will not be visible on the public Resources page. Resource remains in the admin list with published status toggled off. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-49: Delete Resource (with Confirmation)

| Field | Value |
|---|---|
| Scenario | Admin permanently deletes a resource |
| Pre-condition | At least one resource exists |
| Test Steps | 1. Click "Resources" tab 2. Select a resource 3. Click the Delete button 4. Confirm deletion in the confirmation dialog |
| Expected Result | Confirmation dialog appears with the resource title. After confirming, the resource is permanently removed. Resource no longer appears in any admin tab or public page. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-50: Search Resources

| Field | Value |
|---|---|
| Scenario | Admin searches for a resource by title |
| Pre-condition | Multiple resources exist |
| Test Steps | 1. Click "Resources" tab 2. Type a keyword in the search bar |
| Expected Result | Resource list is filtered by search term matching the title. Results update in real time. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — User Management

| Field | Value |
|---|---|
| Module | User Management |
| System Component | Web |
| User Role Involved | Admin |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-51: View User Accounts

| Field | Value |
|---|---|
| Scenario | Admin reviews registered user accounts |
| Pre-condition | At least one user account exists besides the admin; admin role required (tab hidden from faculty) |
| Test Steps | 1. Click "Users" tab 2. Observe user statistics (admin count, faculty count, active users) 3. Browse the user list |
| Expected Result | User statistics are displayed. User list shows name, email, department, employee ID, phone, role, and account status for each user. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Users tab is only visible to admin role users. |

### TC-52: Add User Account

| Field | Value |
|---|---|
| Scenario | Admin creates a new user account |
| Pre-condition | Admin is logged in with admin role |
| Test Steps | 1. Click "Users" tab 2. Click "Add User" 3. Enter full name, email, password, department, employee ID, phone, role (admin/faculty), status 4. Click "Save" |
| Expected Result | User account is created in Supabase Auth and a corresponding user_profiles row is inserted. New user appears in the user list. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-53: Edit User Account

| Field | Value |
|---|---|
| Scenario | Admin modifies an existing user account |
| Pre-condition | At least one user account exists |
| Test Steps | 1. Click "Users" tab 2. Select a user 3. Click Edit 4. Modify name, department, role, or status 5. Click "Save" |
| Expected Result | User account details are updated. Changes are reflected in the user list. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

# FACULTY MODULES

---

## INTERNAL UAT — Faculty Authentication

| Field | Value |
|---|---|
| Module | Faculty Authentication |
| System Component | Web |
| User Role Involved | Faculty |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-54: Faculty Login with Valid Credentials

| Field | Value |
|---|---|
| Scenario | Faculty member logs in with valid credentials |
| Pre-condition | Faculty account has been created and verified |
| Test Steps | 1. Navigate to the website URL 2. Click "Login" or navigate to /admin 3. Enter valid faculty email and password 4. Click "Sign In" |
| Expected Result | Faculty member is redirected to the Faculty Dashboard (/faculty). Application statistics are displayed. "New IP Application" button is visible. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Faculty users are auto-redirected from the admin login page to /faculty. |

### TC-55: Faculty Login via Google OAuth

| Field | Value |
|---|---|
| Scenario | Faculty member signs in using Google OAuth with USTP email |
| Pre-condition | Google OAuth is configured |
| Test Steps | 1. Navigate to the login page 2. Click Google Sign-In 3. Select a USTP email account (@ustp.edu.ph) |
| Expected Result | Faculty profile is auto-created (if first time) or loaded. User is redirected to the Faculty Dashboard. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-56: Faculty Access Denied to Admin Panel

| Field | Value |
|---|---|
| Scenario | Faculty member attempts to access admin-only features |
| Pre-condition | Faculty is logged in |
| Test Steps | 1. Navigate to /admin directly while logged in as faculty |
| Expected Result | Faculty member is redirected back to /faculty. Admin-only tabs (e.g., Users) are not visible. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Faculty Dashboard

| Field | Value |
|---|---|
| Module | Faculty Dashboard |
| System Component | Web |
| User Role Involved | Faculty |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-57: View Dashboard Statistics

| Field | Value |
|---|---|
| Scenario | Faculty member views application overview |
| Pre-condition | Faculty is logged in |
| Test Steps | 1. Navigate to Faculty Dashboard 2. Observe the statistics cards |
| Expected Result | Dashboard displays: Total Applications, Drafts, Pending Review, Filed to IPOPHL, and Granted counts. Application list shows all submitted and draft applications with current status. Tabs for filtering: All, Drafts, Pending Review, Approved, Filed to IPOPHL, Granted, Rejected, Archived. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-58: Archive/Restore/Delete Application

| Field | Value |
|---|---|
| Scenario | Faculty member manages their applications from the dashboard |
| Pre-condition | At least one application exists for the faculty member |
| Test Steps | 1. From Faculty Dashboard, click on an application 2. Click Archive to move to archive 3. Switch to Archived tab 4. Click Restore to bring it back, or Delete to permanently remove |
| Expected Result | Archived application moves to the Archived tab and is excluded from status counts. Restored application returns to its original tab. Deleted application is permanently removed. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Faculty IP Application Form

| Field | Value |
|---|---|
| Module | Faculty IP Application Form |
| System Component | Web |
| User Role Involved | Faculty |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-59: Create New IP Application — Step 1 (Applicant Information)

| Field | Value |
|---|---|
| Scenario | Faculty member begins a new IP application |
| Pre-condition | Faculty is logged in |
| Test Steps | 1. Click "New IP Application" button 2. Select IP type (Patent, Utility Model, Industrial Design, Trademark, Copyright) 3. Enter applicant full name, address, nationality, email, phone 4. Enter invention title, abstract, field of technology, background of invention, summary of invention 5. Add co-inventor details (name, address, nationality) 6. Click "Next" to proceed to Step 2 |
| Expected Result | Step 1 form accepts all inputs. Co-inventor fields can be added/removed dynamically. Validation prevents proceeding with required fields empty. Data is preserved when navigating to Step 2. Classification fields appear for applicable IP types (e.g., trademark goods/services for Trademark). |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Co-inventors stored as JSONB array in Supabase. |

### TC-60: Create New IP Application — Step 2 (Document Upload)

| Field | Value |
|---|---|
| Scenario | Faculty member uploads supporting documents |
| Pre-condition | Step 1 has been completed |
| Test Steps | 1. On Step 2, click "Upload" or drag-and-drop area 2. Select a PDF or document file 3. Select document type (drawing, document, supporting) 4. Add description 5. Verify file appears in the attachment list 6. Upload a second file 7. Click "Next" to proceed to Step 3 |
| Expected Result | Files are uploaded successfully. File names, types, and sizes are displayed in the attachment list. Multiple files can be uploaded. Invalid file types are rejected with an error message. Oversized files trigger validation feedback. Joint Affidavit template is available as a downloadable reference document. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Files uploaded to Supabase Storage bucket 'application-files' with fallback to 'patent-files'. |

### TC-61: Create New IP Application — Step 3 (Review and Submit)

| Field | Value |
|---|---|
| Scenario | Faculty member reviews and submits the application |
| Pre-condition | Steps 1 and 2 have been completed |
| Test Steps | 1. On Step 3, review all entered information 2. Review uploaded documents 3. Check the declaration confirmation checkbox 4. Click "Submit" 5. Confirm submission |
| Expected Result | Application is submitted successfully. Status changes to "Submitted for Internal Review". Success confirmation message is displayed. Application appears in the dashboard with the new status. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-62: Save Application as Draft

| Field | Value |
|---|---|
| Scenario | Faculty member saves an incomplete application for later |
| Pre-condition | Faculty is logged in; on Step 1 or Step 2 of the application form |
| Test Steps | 1. Fill in some (not all) required fields 2. Click "Save as Draft" 3. Navigate back to Faculty Dashboard 4. Observe the application in the list |
| Expected Result | Application is saved with "Draft" status. Partially entered data is preserved. Application appears in the dashboard's Draft count and Drafts tab. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-63: Resume Saved Draft

| Field | Value |
|---|---|
| Scenario | Faculty member continues a previously saved draft |
| Pre-condition | At least one application with "Draft" status exists |
| Test Steps | 1. From Faculty Dashboard, click on a Draft application 2. Click "Edit" or "Resume" 3. Verify previously entered data is preserved 4. Complete remaining fields 5. Submit the application |
| Expected Result | All previously saved data (applicant info, documents) is preserved and displayed. Faculty can continue from where they left off. After submission, status changes to "Submitted for Internal Review." |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Faculty Application Tracking

| Field | Value |
|---|---|
| Module | Faculty Application Tracking |
| System Component | Web |
| User Role Involved | Faculty |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-64: View Application Status

| Field | Value |
|---|---|
| Scenario | Faculty member checks the progress of a submitted application |
| Pre-condition | At least one submitted application exists |
| Test Steps | 1. Navigate to Faculty Dashboard 2. Click on a submitted application 3. Review the application detail page |
| Expected Result | Current status is displayed clearly with a status badge and IP type badge. Status history shows all transitions with timestamps. Admin comments are visible. Version history is accessible. Admin-provided files (e.g., certifications) are displayed in a separate section. Attachments can be downloaded. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-65: Respond to Revision Request

| Field | Value |
|---|---|
| Scenario | Faculty member addresses admin's revision comments |
| Pre-condition | At least one application with "Needs Revision" status exists, and admin has added review comments |
| Test Steps | 1. Navigate to Faculty Dashboard 2. Click on the application with "Needs Revision" status 3. Read admin's review comments 4. Click "Edit" to make the required changes to the application 5. Upload additional documents if requested 6. Click "Resubmit" |
| Expected Result | Application status changes from "Needs Revision" to "Submitted for Internal Review." Admin receives a notification about the resubmission. Updated information is saved. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — Faculty Notifications

| Field | Value |
|---|---|
| Module | Faculty Notifications |
| System Component | Web |
| User Role Involved | Faculty |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-66: Receive Notification on Status Change

| Field | Value |
|---|---|
| Scenario | Faculty member receives a notification when admin changes application status |
| Pre-condition | Faculty is logged in; an admin changes the status of the faculty's application |
| Test Steps | 1. (Admin changes application status to "Needs Revision") 2. Faculty observes the notification bell in the navigation bar 3. Click the notification bell or navigate to the Notifications page |
| Expected Result | A new notification appears regarding the status change. Notification displays: type (e.g., "Revision Required"), title, message, and timestamp. Notification has an action link to the relevant application. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Notifications are stored in faculty_notifications table. Real-time updates via Supabase. |

### TC-67: Mark Notification as Read

| Field | Value |
|---|---|
| Scenario | Faculty member marks a notification as read |
| Pre-condition | At least one unread notification exists |
| Test Steps | 1. Navigate to Notifications page 2. Observe unread notifications (visually distinct) 3. Click on a notification or mark it as read |
| Expected Result | Notification changes from unread to read status. Visual indicator (bold/color) changes. Unread count in the notification bell decreases. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

# GENERAL USER MODULES

---

## INTERNAL UAT — General User Public Pages

| Field | Value |
|---|---|
| Module | General User Public Page |
| System Component | Web |
| User Role Involved | General User (unauthenticated) |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-68: Browse Home Page

| Field | Value |
|---|---|
| Scenario | User visits the website homepage |
| Pre-condition | System is running; no login required |
| Test Steps | 1. Navigate to the website URL 2. Observe the hero section with dynamic title and subtitle 3. Observe Impact Statistics (Patents Granted, Industry Partners, Technologies Developed) 4. Scroll down to view Services Overview section 5. Scroll to view Recent News articles 6. Click on a news article |
| Expected Result | Homepage loads correctly. Hero section displays admin-managed content. Impact statistics counters are displayed with live Patents count derived from IP Portfolio. Services Overview shows published services. Recent news articles are visible and clickable. Tepee chat widget icon is visible in the bottom-right corner. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-69: Browse IP Portfolio

| Field | Value |
|---|---|
| Scenario | User searches and views IP portfolio entries, and downloads the Technical Datasheet |
| Pre-condition | System is running; at least one published patent exists |
| Test Steps | 1. Click "IP Portfolio" in the navigation 2. Observe the portfolio overview and brochure-style pie charts (status distribution, field distribution) 3. Use the search bar to search for a patent 4. Filter by field or status 5. Click on a patent card to view details 6. Click on "Technical Datasheet" for available PDFs of the patent card |
| Expected Result | IP Portfolio page loads with published patents displayed. Pie charts visualize status and field distributions. Search returns relevant results. Filters work correctly. Patent detail page shows: title, inventors, abstract, status, licensing info, and related recommendations. Technical datasheet PDFs can be downloaded if available. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Only published patents with status != 'Draft' are shown. Pagination applies. |

### TC-70: Browse Services

| Field | Value |
|---|---|
| Scenario | User explores TPCO service offerings |
| Pre-condition | System is running; at least one published service exists |
| Test Steps | 1. Click "Services" in the navigation 2. Browse the service listings 3. Click on a service to view details 4. Review process steps, features, pricing, and timeline 5. Click "Request Service" or service request link |
| Expected Result | Services page lists all published offerings. Detail page shows description, features, process steps, pricing, and timeline. Service request form is accessible, and patent's technical worksheet is accessible if available. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-71: Submit Service Request

| Field | Value |
|---|---|
| Scenario | User submits a request for a TPCO service |
| Pre-condition | System is running; user is on a service detail page or service request page |
| Test Steps | 1. Click "Request Service" 2. Fill in the service request form (name, email, phone, organization, specific needs, preferred contact) 3. Click "Submit" |
| Expected Result | Service request is submitted successfully. Confirmation message is displayed. Request appears in the admin's Service Request Logs. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Service slug is passed as a URL parameter to pre-fill the service type. |

### TC-72: Browse Resources

| Field | Value |
|---|---|
| Scenario | User accesses downloadable resources and event listings |
| Pre-condition | System is running; at least one published resource exists |
| Test Steps | 1. Click "Resources" in the navigation 2. Browse Legal Templates and Research Guidelines sections (tab-based) 3. Use category filter chips 4. Click on a resource to view details 5. Download a file 6. Navigate to the Workshops and Events section |
| Expected Result | Resources page displays categorized listings. Templates and Guidelines are separated by tabs with subcategory filter chips. Download works correctly. Workshops and Events section shows upcoming events with registration options. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-73: Register for Event

| Field | Value |
|---|---|
| Scenario | User registers for an upcoming TPCO event |
| Pre-condition | At least one event with open registration exists |
| Test Steps | 1. Navigate to Workshops and Events section (or Events page) 2. Click on an event with open registration 3. Fill in registration form (name, email, phone, organization, position, dietary requirements, special requests) 4. Click "Register" |
| Expected Result | Registration is successful. Confirmation message is displayed. Event attendee count increases. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-74: Browse Latest News

| Field | Value |
|---|---|
| Scenario | User reads TPCO news and announcements |
| Pre-condition | System is running; at least one published news article exists |
| Test Steps | 1. Click "Latest News" in the navigation 2. Browse articles chronologically 3. Use category tabs or year filter 4. Use the search bar 5. Click on an article to read full content |
| Expected Result | News page displays articles chronologically. Category tabs and year filtering work. Search returns relevant articles. Article detail page shows full content, author, date, category, content images, embedded YouTube video (if any), and related articles. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

---

## INTERNAL UAT — AI Assistant (Tepee)

| Field | Value |
|---|---|
| Module | AI Assistant (Tepee) |
| System Component | Web |
| User Role Involved | General User (unauthenticated) |
| Build / Version | 1.0 |
| Environment | Dev |
| Tested By | Internal |
| Date Tested | |

### TC-75: Ask TPCO-Related Question

| Field | Value |
|---|---|
| Scenario | User asks a question about TPCO services or IP processes |
| Pre-condition | System is running; Tepee chat widget is visible |
| Test Steps | 1. Click the Tepee chat icon (bottom-right corner) 2. Type "What are the requirements for filing a patent?" 3. Press Enter or click Send 4. Wait for the response |
| Expected Result | Tepee generates a relevant response based on TPCO documents (via RAG API with Mistral backend, or predefined fallback). Response is displayed within a reasonable time (under 10 seconds). Sources accordion may be shown if RAG API returns source documents. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Predefined responses handle common topics (team, journey, partners, contact, mission, IP portfolio, forms, guidelines, services, news, events, etc.) before falling back to the RAG API. |

### TC-76: Ask Off-Topic Question

| Field | Value |
|---|---|
| Scenario | User asks a question unrelated to TPCO |
| Pre-condition | Tepee chat widget is open |
| Test Steps | 1. Type "What's the weather today?" or "Tell me a joke" 2. Press Enter or click Send |
| Expected Result | Tepee responds indicating the question is outside TPCO's scope. Tepee suggests asking about TPCO-related topics instead. If no predefined response matches and the RAG API cannot answer, an error or redirect message is shown. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | |

### TC-77: Click Suggested Question

| Field | Value |
|---|---|
| Scenario | User selects a suggested question from the chat interface |
| Pre-condition | Tepee chat widget is open (freshly opened) |
| Test Steps | 1. Open Tepee chat widget 2. Observe the 4 suggested questions displayed 3. Click on one of the suggested questions |
| Expected Result | Clicked question is sent as a query. Tepee generates a relevant response. Suggested questions change on the next chat widget open (randomly selected from a pool of 28 questions). |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Questions are randomly shuffled and 4 are displayed each time the widget is opened. |

### TC-78: Click Navigation Link in Response

| Field | Value |
|---|---|
| Scenario | User clicks a link embedded in Tepee's response |
| Pre-condition | Tepee has generated a response containing a clickable link |
| Test Steps | 1. Ask Tepee "Where can I find the IP portfolio?" 2. Wait for response 3. Click the navigation link in the response (e.g., "IP Portfolio page" link) |
| Expected Result | Clicking the link navigates the user to the referenced page. Chat widget remains accessible after navigation. Response includes clickable navigation links to relevant pages (e.g., Services, About, Resources, IP Portfolio). |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Markdown-style links [text](url) are parsed into clickable HTML links. Relative URLs use the current origin. |

### TC-79: Chat History Persistence and Expand/Collapse

| Field | Value |
|---|---|
| Scenario | User reopens the chat widget and expands it |
| Pre-condition | User has previously sent messages in the chat |
| Test Steps | 1. Have an active chat conversation with at least 2 messages 2. Close the chat widget 3. Reopen the chat widget 4. Verify previous messages are still visible 5. Click the expand/maximize button |
| Expected Result | Previous chat messages are preserved and displayed when the widget is reopened (stored in localStorage). Expanding the widget provides a larger chat area. Escape key collapses (if expanded) or closes (if collapsed) the widget. |
| Actual Result | |
| Status | |
| Defect Ref ID | |
| Remarks | Chat history is persisted per session ID in localStorage. |

---

# APPENDIX: Test Case Change Log

| Change | Original TC | Updated TC | Description |
|---|---|---|---|
| RENAMED | TC-01 | TC-01 | Clarified: "Admin Login with Valid Credentials" |
| UPDATED | TC-02 | TC-02 | Updated expected error message to match implementation |
| ADDED | — | TC-03 | Admin login with "admin" username shorthand |
| ADDED | — | TC-04 | Google OAuth login (USTP email auto-creates faculty) |
| ADDED | — | TC-05 | Google OAuth login (non-USTP email rejected) |
| ADDED | — | TC-06 | Session persistence / auto-login on reload |
| ADDED | — | TC-07 | Inactive account login blocked |
| RENUMBERED | TC-03 | TC-08 | Dashboard: View Dashboard Statistics |
| ADDED | — | TC-09 | Dashboard: View Recent Activities |
| ADDED | — | TC-10 | Dashboard: Filter Activity Logs by Type |
| ADDED | — | TC-11 | Dashboard: Export Activity Logs to CSV |
| RENUMBERED | TC-04 | TC-12 | Content Management: Update Homepage Hero Content |
| ADDED | — | TC-13 | Content Management: Upload Hero Image |
| ADDED | — | TC-14 | Content Management: Update Impact Statistics (Partners, Technologies; Patents auto-derived) |
| RENUMBERED | TC-05 | TC-15 | News: Create and Publish News Article (updated with Draft/Publish distinction) |
| ADDED | — | TC-16 | News: Save News Article as Draft |
| RENUMBERED | TC-06 | TC-17 | News: Edit News Article |
| ADDED | — | TC-18 | News: Duplicate News Article |
| RENUMBERED | TC-07 | TC-19 | News: Archive News Article |
| ADDED | — | TC-20 | News: Delete News Article (with confirmation dialog) |
| RENUMBERED | TC-08 | TC-21 | Events: Create Event |
| ADDED | — | TC-22 | Events: Edit Event |
| RENUMBERED | TC-09 | TC-23 | Events: Track Event Registrations |
| ADDED | — | TC-24 | Events: Archive/Restore Event |
| ADDED | — | TC-25 | Events: Search and Filter Events |
| RENUMBERED | TC-10 | TC-26 | Patents: Add Patent Entry (updated with multiple file upload, published by default) |
| ADDED | — | TC-27 | Patents: Edit Patent (Modal) |
| ADDED | — | TC-28 | Patents: View Patent Detail (Modal) |
| RENUMBERED | TC-11 | TC-29 | Patents: View Patent Analytics Summary (updated with brochure pie charts) |
| RENUMBERED | TC-12 | TC-30 | Patents: Record Licensed Revenue |
| RENUMBERED | TC-13 (duplicate) | TC-31 | Patents: Bulk Entry via CSV Upload (fixed duplicate TC number) |
| RENUMBERED | TC-14 | TC-32 | Patents: Export Analytics Report |
| RENUMBERED | TC-15 | TC-33 | Patents: Download Patent Portfolio (All) |
| RENUMBERED | TC-16 | TC-34 | Patents: Download Patent Portfolio (Selected) |
| ADDED | — | TC-35 | Patents: Publish/Unpublish Patent Toggle |
| RENUMBERED | TC-13 (duplicate) | TC-36 | IP Applications: Review Faculty IP Application (fixed duplicate TC number) |
| RENUMBERED | TC-14 | TC-37 | IP Applications: Add Review Comment (updated with faculty notification) |
| RENUMBERED | TC-15 | TC-38 | IP Applications: Request Revision (updated with comment required validation) |
| RENUMBERED | TC-16 | TC-39 | IP Applications: Approve Application for IPOPHL Filing |
| RENUMBERED | TC-17 | TC-40 | IP Applications: Record IPOPHL Filing Details |
| ADDED | — | TC-41 | IP Applications: Grant IP Application (with certification file requirement, auto-restore) |
| ADDED | — | TC-42 | IP Applications: Reject IP Application (with comment required) |
| ADDED | — | TC-43 | IP Applications: Search and Filter IP Applications |
| RENUMBERED | TC-18 | TC-44 | Services: Manage Service Offerings (updated with dynamic features/process steps) |
| ADDED | — | TC-45 | Services: Publish/Unpublish Service |
| RENUMBERED | TC-19 | TC-46 | Services: View Service Request Logs (updated with Active/Archived tabs, search, filter) |
| RENUMBERED | TC-20 | TC-47 | Resources: Manage Resources (updated with Templates/Guidelines tabs) |
| RENUMBERED | TC-21 (duplicate) | TC-48 | Resources: Unpublish a Resource (fixed duplicate TC number) |
| ADDED | — | TC-49 | Resources: Delete Resource (with confirmation) |
| ADDED | — | TC-50 | Resources: Search Resources |
| RENUMBERED | TC-21 (duplicate) | TC-51 | Users: View User Accounts (fixed duplicate TC number, admin-only tab) |
| ADDED | — | TC-52 | Users: Add User Account |
| ADDED | — | TC-53 | Users: Edit User Account |
| RENUMBERED | TC-22 | TC-54 | Faculty Auth: Faculty Login with Valid Credentials |
| ADDED | — | TC-55 | Faculty Auth: Faculty Login via Google OAuth |
| ADDED | — | TC-56 | Faculty Auth: Faculty Access Denied to Admin Panel |
| RENUMBERED | TC-23 | TC-57 | Faculty Dashboard: View Dashboard Statistics (updated with Granted, Rejected, Archived tabs) |
| ADDED | — | TC-58 | Faculty Dashboard: Archive/Restore/Delete Application |
| RENUMBERED | TC-24 | TC-59 | Faculty App Form: Step 1 (updated with IP types, background, summary, classification fields) |
| RENUMBERED | TC-25 | TC-60 | Faculty App Form: Step 2 (updated with Joint Affidavit template, file size validation) |
| RENUMBERED | TC-26 | TC-61 | Faculty App Form: Step 3 |
| RENUMBERED | TC-27 | TC-62 | Faculty App Form: Save as Draft |
| RENUMBERED | TC-28 | TC-63 | Faculty App Form: Resume Saved Draft |
| RENUMBERED | TC-29 | TC-64 | Faculty Tracking: View Application Status (updated with admin-provided files section) |
| RENUMBERED | TC-30 | TC-65 | Faculty Tracking: Respond to Revision Request |
| RENUMBERED | TC-31 | TC-66 | Faculty Notifications: Receive Notification on Status Change (updated with real-time) |
| RENUMBERED | TC-32 | TC-67 | Faculty Notifications: Mark Notification as Read |
| RENUMBERED | TC-33 | TC-68 | Public: Browse Home Page (updated with Impact Stats details, Services Overview) |
| RENUMBERED | TC-34 | TC-69 | Public: Browse IP Portfolio (updated with brochure pie charts, technical datasheet) |
| RENUMBERED | TC-35 | TC-70 | Public: Browse Services |
| RENUMBERED | TC-36 | TC-71 | Public: Submit Service Request (updated with service slug parameter) |
| RENUMBERED | TC-37 | TC-72 | Public: Browse Resources (updated with tab-based Templates/Guidelines, filter chips) |
| RENUMBERED | TC-38 | TC-73 | Public: Register for Event |
| RENUMBERED | TC-39 | TC-74 | Public: Browse Latest News (updated with year filter, YouTube embed, related articles) |
| RENUMBERED | TC-40 | TC-75 | Tepee: Ask TPCO-Related Question (updated with RAG API + predefined fallback) |
| RENUMBERED | TC-41 | TC-76 | Tepee: Ask Off-Topic Question |
| RENUMBERED | TC-42 | TC-77 | Tepee: Click Suggested Question (updated: pool of 28 questions, 4 random each open) |
| RENUMBERED | TC-43 | TC-78 | Tepee: Click Navigation Link in Response |
| ADDED | — | TC-79 | Tepee: Chat History Persistence and Expand/Collapse |

---

# Summary Statistics

| Category | Original Count | Updated Count | Added | Removed |
|---|---|---|---|---|
| Admin - Authentication | 2 | 7 | +5 | 0 |
| Admin - Dashboard | 1 | 4 | +3 | 0 |
| Admin - Content Management | 1 | 3 | +2 | 0 |
| Admin - News Management | 3 | 6 | +3 | 0 |
| Admin - Events Management | 2 | 5 | +3 | 0 |
| Admin - Patent Management | 7 | 10 | +3 | 0 |
| Admin - IP Application Mgmt | 5 | 8 | +3 | 0 |
| Admin - Services & Resources | 4 | 7 | +3 | 0 |
| Admin - User Management | 1 | 3 | +2 | 0 |
| Faculty - Authentication | 1 | 3 | +2 | 0 |
| Faculty - Dashboard | 1 | 2 | +1 | 0 |
| Faculty - IP Application Form | 5 | 5 | +0 | 0 |
| Faculty - Application Tracking | 2 | 2 | +0 | 0 |
| Faculty - Notifications | 2 | 2 | +0 | 0 |
| General User - Public Pages | 7 | 7 | +0 | 0 |
| General User - AI Assistant | 4 | 5 | +1 | 0 |
| **TOTAL** | **43** | **79** | **+36** | **0** |
