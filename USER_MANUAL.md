# USTP TPCO Web Application
## User Manual

**Prepared for:** USTP Technology Transfer & Patenting Coordinating Office (TPCO)
**Version:** 1.0
**Date:** May 2026

---

## Table of Contents

1. [About This Manual](#1-about-this-manual)
2. [System Overview](#2-system-overview)
3. [User Roles & Access](#3-user-roles--access)
4. [Getting Started](#4-getting-started)
5. [Public Website Guide](#5-public-website-guide)
6. [Admin Panel Guide (TPCO Staff)](#6-admin-panel-guide-tpco-staff)
7. [Faculty Portal Guide](#7-faculty-portal-guide)
8. [AI Chat Assistant](#8-ai-chat-assistant)
9. [Common Tasks — Quick Reference](#9-common-tasks--quick-reference)
10. [Troubleshooting & FAQ](#10-troubleshooting--faq)
11. [Support & Contact](#11-support--contact)

---

## 1. About This Manual

This manual is the official end-user guide for the **USTP TPCO Web Application**. It is intended for:

- **TPCO Administrators** who manage the website content, review faculty IP applications, and oversee the system.
- **Faculty / Inventors** who submit and track Intellectual Property (IP) applications through the portal.
- **Public visitors** (students, industry partners, researchers) who browse public information.

Read the section that matches your role. Administrators should read Sections 5–8 in full.

---

## 2. System Overview

The TPCO Web Application is an online portal that centralizes the office's public information, internal IP workflow, and stakeholder services. It has three major areas:

| Area | Audience | Access |
|------|----------|--------|
| **Public Website** | Anyone | No login required |
| **Faculty Portal** | USTP faculty/researchers | Google sign-in (`@ustp.edu.ph`) |
| **Admin Panel** | TPCO staff | Username + password, or Google |

### Key Features

- IP Portfolio showcase (patents, utility models, industrial designs, copyrights, trademarks)
- Online IP application submission (4-step guided form)
- Internal review workflow with status tracking and comments
- Service request intake (6 TPCO service lines)
- SSF facility booking inquiries
- News, events, and downloadable resources (forms, templates, guidelines)
- AI chat assistant for TPCO-related questions
- Notification center for faculty and admins
- Role-based user management (admin-only)

---

## 3. User Roles & Access

The system has three roles:

### 3.1 Public (no login)
Anyone can browse: Home, Our IP, Services, Resources, Latest News, About, Contact. They can also request services, book facilities, and chat with the AI assistant.

### 3.2 Faculty
- Must sign in with their **USTP Google account** (`@ustp.edu.ph`).
- Lands on the **Faculty Dashboard** (`/faculty`).
- Can create, edit, save as draft, submit, and track their own IP applications.
- Can receive notifications from TPCO reviewers.
- Cannot see other faculty's applications or access admin features.

### 3.3 Admin (TPCO Staff)
- Signs in with **username/email + password** or a TPCO Google account.
- Lands on the **Admin Panel** (`/admin`).
- Can manage all site content and review every faculty application.
- Can invite other users and assign roles (Admin → Users tab).

> **Note:** Faculty using a non-USTP Google email will be blocked and automatically signed out.

---

## 4. Getting Started

### 4.1 Opening the Website

1. Open a modern browser (Chrome, Edge, Firefox, or Safari — latest version recommended).
2. Visit the TPCO portal URL provided by the development team.
3. The home page loads with the main navigation at the top.

### 4.2 Logging In (Admins & Faculty)

1. Click the gold **Login** button in the top-right of the home page.
2. You will be taken to the **Sign-In screen**.
3. Choose one of two options:
   - **Username/Email + Password** — Enter credentials, then click **Sign In**.
   - **Sign in with Google** — Click the Google button and pick your `@ustp.edu.ph` account.
4. After a successful login:
   - **Faculty** are redirected to the Faculty Portal (`/faculty`).
   - **Admins** stay on the Admin Panel (`/admin`).

### 4.3 Logging Out

- **Admin Panel:** Click your profile menu → **Logout** (top-right of the admin header).
- **Faculty Portal:** Click **Logout** (top-right of the faculty header).

### 4.4 Forgot Password

- On the login screen, contact a TPCO Administrator.
- The Administrator can trigger a **password reset email** from the **Users** tab of the Admin Panel (see Section 6.9).

---

## 5. Public Website Guide

This section describes what any visitor sees. TPCO staff should also be familiar with it since it is the public face of the office.

### 5.1 Home Page (`/`)

- **Hero banner** with a call to action.
- **Impact Stats** (total IPs, granted patents, licensed revenue, etc.).
- **Featured Technologies** pulled from the IP Portfolio.
- **Services Overview** — quick entry to the 6 TPCO service lines.
- **Latest News** — most recent news cards.
- **Footer** with contact info and quick links.

### 5.2 Our IP — IP Portfolio (`/ip-portfolio`)

- Searchable and filterable catalog of USTP's intellectual property.
- Filters: **Field of Technology**, **Status** (Filed / Granted / Published), **Year**.
- **Pie charts** (Brochure Pie Charts) summarize the portfolio distribution.
- Click any card to open the **Technology Details** page (`/technology/:slug`).
- Public users can download attached patent documents if provided.

### 5.3 Services (`/services`)

The six TPCO service lines are displayed as cards:

1. IP Protection
2. Technology Transfer & Commercialization
3. IP Training & Capacity Building
4. Innovation & Startup Support
5. Technical Services (SSF)
6. Intellectual Property Advisory

Click **Request This Service** on any card to open a pre-filled request form.

### 5.4 Service Request (`/service-request?service=<slug>`)

1. Complete the request form: name, email, phone, organization, specific needs, preferred contact method.
2. Click **Submit Request**.
3. A confirmation dialog shows a tracking reference number.
4. TPCO staff receive the request in the Admin Panel → **Services** tab.

### 5.5 Additional Services / Facility Booking (`/facility-booking`)

- Lists USTP Shared Service Facilities (SSF) with equipment and capacity.
- Click **Book This Facility** to open an inquiry form (name, email, phone, organization, preferred date/time, purpose, notes).
- The inquiry is stored in the Admin Panel for TPCO to respond to.

### 5.6 Resources (`/resources`) & Browse Resources (`/browse-resources`)

Two tabs:
- **Templates** — downloadable forms (IPOPHL Forms 100, 110, 300, 400, Deed of Assignment, Patent Specification Template, etc.) grouped by category (Patent Forms, Utility Model Forms, Industrial Design Forms, Trademark Forms, Copyright Forms, Legal Agreements, Technology Transfer).
- **Guidelines** — informational PDFs (Patent Guidelines, Trademark Guidelines, IP Procedures, Technology Transfer, etc.).

Use the filter chips to narrow by category. Click **Download** on any item.

### 5.7 Latest News (`/latest-news`) and News Detail (`/news/:slug`)

- Browse all published news articles.
- Click a card to open the full article with cover image, body, and related links.

### 5.8 Events (`/events`)

- Upcoming and past TPCO events with date, time, venue, and registration info.

### 5.9 About (`/about`)

- TPCO mission, vision, organizational structure, team members, and partner institutions (logos in `/images/partners`).

### 5.10 Contact (`/contact`)

- Office address, phone, email, and an inquiry form.

---

## 6. Admin Panel Guide (TPCO Staff)

URL: `/admin` (after login).

The admin panel is organized into **9 tabs** (8 for non-super admins). Tabs are shown at the top of the page.

```
Dashboard · Content · News · Events · Patents · IP Applications · Services · Resources · Users*
```
*(*Users tab visible to Admin role only.)*

The **notification bell** and **profile menu** live in the header at all times.

### 6.1 Dashboard Tab

- **Top statistics cards:** Total Patents, Patents This Month, Published News, News This Week, Upcoming Events, Service Requests, Pending Requests.
- **Recent Activity feed:** Latest user actions across the system (new IP application submitted, news published, etc.). Click **View All** to open the activity modal with filters.
- **Patent Analytics Card:** Charts and breakdowns of IP portfolio health.

### 6.2 Content Tab

Manage the **homepage content** (Hero text, Impact Stats numbers, Featured Technologies selections, About page blocks, Footer info).

1. Edit a field inline or in its card.
2. Click **Save Changes**.
3. Changes appear on the public site immediately.

### 6.3 News Tab

Three sub-tabs: **Published**, **Drafts**, **Archived**.

**Creating a news article:**
1. Click **+ New Article**.
2. Fill title, slug, cover image, category, excerpt, body (rich text).
3. Click **Save Draft** or **Publish**.

**Editing:** Click the pencil icon on any article.
**Archiving:** Click the archive icon. Archived articles are hidden from the public site but not deleted.
**Deleting:** Click the trash icon (permanent).

Use the search bar and category filter to find articles quickly.

### 6.4 Events Tab

Two sub-tabs: **Active Events** and **Past/Archived Events**.

1. Click **+ New Event** — fill title, date, time, venue, description, cover image, registration link.
2. Save. The event appears on the public Events page.
3. Past events are moved to the archive automatically when the end date passes, but can also be archived manually.

### 6.5 Patents Tab (IP Portfolio Management)

This tab controls what appears on **Our IP** / `/ip-portfolio`.

**Add a single patent:**
1. Fill the Add New Patent form: Title, Patent ID, Inventors, Field, Description, Abstract, Status (Filed / Granted / Pending), Year.
2. Attach one or more files (PDFs of the patent document, drawings, etc.).
3. Click **Add Patent**.

**Bulk upload via CSV:**
1. Click **Bulk Upload CSV**.
2. Pick your CSV file (use the template — download it first with **Download CSV** if needed).
3. All rows are imported as **Filed + unpublished**. A yellow dot marks them in the table until they are reviewed.
4. Open each new patent, review/fill missing data, toggle **Published**, then save.

**Export:**
1. Click **Download CSV**.
2. Choose fields to include and either **All** or **Selected** rows.
3. The file downloads to your computer.

**Editing a patent:** Click the row or the edit icon → modal opens → update fields, add/remove files → **Save**.

**Licensed Revenue:** Enter the running total in the dedicated field and click **Save Revenue**. This value drives the Impact Stats on the homepage.

### 6.6 IP Applications Tab (Faculty Submissions Review)

This is the core reviewer workflow. Each row is an application submitted by a faculty member.

**Application list:**
- Search by applicant, title, or application number.
- Filter by **Status** and **IP Type** (Patent, Utility Model, Industrial Design, Copyright, Trademark).
- Pagination: 10 rows per page.

**Review an application:**
1. Click the row → **Application Detail Modal** opens.
2. Tabs inside the modal: **Overview**, **Applicant Info**, **Invention Details**, **Claims & Drawings**, **Attachments**, **Comments**.
3. Review all fields and download attachments.
4. Use the **Comments** section to leave internal feedback (visible to the faculty).
5. Click **Review** (top-right) to take action.

**Review actions:**
| Action | Effect | Faculty sees status |
|--------|--------|---------------------|
| **Approve for IPOPHL Filing** | Application passes internal review. | `Approved for IPOPHL Filing` |
| **Return for Revision** | Sent back to faculty with notes. | `Needs Revision` |
| **Reject** | Application rejected with reason. | `Rejected` |
| **Mark as Granted** | After IPOPHL grants the IP. | `Granted` |

You may also upload review files (e.g., signed review sheets) that will be visible to the faculty.

**Recording IPOPHL filing details:** In the detail modal, enter the **IPOPHL Filing Date** and **IPOPHL Application Number** when they become available, then save. The faculty's dashboard will reflect it.

### 6.7 Services Tab (Service Request Inbox)

Two sub-tabs: **Active Requests** and **Archived**.

1. Each request shows: requester name, email, service requested, specific needs, date submitted.
2. Click a row to view details.
3. Respond via email directly (use the requester's email) or update the status (In Progress, Completed, Archived).

### 6.8 Resources Tab

Manage the **Templates** and **Guidelines** visible on the public Resources page.

1. Click **+ Add Resource**.
2. Fill title, category, description, upload the file (PDF, DOCX, XLSX).
3. Toggle **Published** when ready.
4. Save.

Edit or delete any row using the icons on the right. Publish/unpublish toggles control public visibility.

### 6.9 Users Tab (Admin Only)

Manage all system users.

**Invite a new user:**
1. Click **+ Invite User**.
2. Enter full name, email, and choose role: **Admin** or **Faculty**.
3. The user receives an invitation/reset email.

**Edit a user:** Click the edit icon → change name, role, or active status.

**Reset a user's password:** Click **Send Password Reset** on the row — the user gets an email with a reset link.

**Deactivate / Delete a user:** Use the toggle or trash icon. Deactivation is reversible; deletion is permanent.

> **Best Practice:** Prefer deactivation over deletion to preserve historical records.

### 6.10 Notifications (Admin Header)

- The **bell icon** shows the unread count.
- Click the bell to see recent notifications (new IP application submitted, new service request, new booking inquiry, new faculty comment).
- Click a notification to jump directly to the related record.
- Use **Mark all as read** to clear the counter.

---

## 7. Faculty Portal Guide

URL: `/faculty` (after faculty Google login).

### 7.1 Faculty Dashboard

- **Welcome banner** with the faculty name.
- **Stats Cards:** Total Applications, Drafts, Pending Review, Approved, Filed to IPOPHL, Granted, Rejected.
- **Tabs to filter the applications table:** All, Drafts, Pending Review, Approved, Filed to IPOPHL, Granted, Rejected, Archived.
- **+ New IP Application** button (top-right of the table).
- **IPOPHL Filing Process Guide** card at the bottom with quick links.

### 7.2 Submitting a New IP Application

Click **+ New IP Application** to open the guided 4-step form.

#### Step 1 — Applicant Info
- IP Type (Patent / Utility Model / Industrial Design / Copyright / Trademark)
- Title of the Invention
- Applicant full name, address, nationality, phone, email
- Co-inventors (add as many as needed with their contact details)

#### Step 2 — Invention Details
- Field of Technology
- Background of the Invention
- Summary of the Invention
- Abstract
- Detailed Description

#### Step 3 — Claims & Drawings
- Claims (numbered list)
- Drawings / Figures — upload images
- Document checklist — upload mandatory documents (varies by IP type):
  - Deed of Assignment
  - Joint Affidavit of Inventorship
  - Patent Specification
  - Drawings
  - ID copies, etc.
- The form validates the checklist — missing required documents block submission.

#### Step 4 — Review & Submit
- Review all information on one page.
- Go back to any earlier step to edit.
- Two options:
  - **Save as Draft** — stays in the Drafts tab; editable anytime.
  - **Submit for Internal Review** — sent to TPCO reviewers; status becomes `Submitted for Internal Review`.

### 7.3 Tracking an Application

From the dashboard, click any row to open its **Application Detail** page.

You will see:
- Current **status** and **version number**.
- IPOPHL filing date and application number (once TPCO records them).
- **Comments** thread between you and TPCO reviewers.
- Uploaded attachments (downloadable).
- **Edit** button (only for Draft or Needs Revision statuses).

### 7.4 Application Statuses

| Status | Meaning |
|--------|---------|
| Draft | Saved but not submitted. Editable. |
| Submitted for Internal Review | Sent to TPCO; awaiting review. |
| Under Internal Review | Reviewer is actively evaluating it. |
| Needs Revision | Returned with reviewer notes; editable. |
| Approved for IPOPHL Filing | Passed internal review. |
| Filed to IPOPHL | Submitted to IPOPHL by TPCO. |
| Under IPOPHL Examination | Being examined by IPOPHL. |
| Published | Published by IPOPHL. |
| Granted | IP rights granted. |
| Rejected | Application rejected. |

### 7.5 Notifications (Faculty Header)

- The **bell icon** on the faculty header shows new comments, status changes, and review decisions.
- Click any notification to jump directly to the related application.

### 7.6 Archive & Delete

- **Archive:** Hides the application from the main list (moves to the **Archived** tab). Reversible.
- **Restore:** Brings an archived application back to the active list.
- **Delete:** Permanent — only available for drafts you created.

---

## 8. AI Chat Assistant

A **floating chat bubble** appears on every public page (bottom-right by default).

### 8.1 What It Can Answer
- TPCO services and processes
- IP procedure questions (Patent, Utility Model, Industrial Design, Trademark, Copyright)
- Filing requirements and document checklists
- Where to find specific forms and resources
- Office contact details

The assistant is grounded in the TPCO knowledge base (official documents and guidelines uploaded by the admin team).

### 8.2 How to Use
1. Click the **chat bubble** icon.
2. Type your question in the input box and press **Enter** or click **Send**.
3. The answer appears with **source references** (document names) where available.
4. Click the **expand icon** for a fullscreen view.
5. Click the **X** to close the chat; the conversation is preserved for the session.

### 8.3 Privacy
- Email addresses, phone numbers, and ID-like strings are automatically masked in the chat transcript.
- The chat does not save personal messages permanently; closing the browser clears the session.

---

## 9. Common Tasks — Quick Reference

### 9.1 Admin: Publish a new patent on the public site
Admin Panel → **Patents** tab → fill Add New Patent form → attach files → **Add Patent** → ensure status & publish toggle are correct.

### 9.2 Admin: Approve a faculty IP application
Admin Panel → **IP Applications** → click row → review tabs → **Review** → **Approve for IPOPHL Filing** → optionally add notes/files → confirm.

### 9.3 Admin: Record IPOPHL filing details
Admin Panel → **IP Applications** → open application → fill **IPOPHL Filing Date** and **IPOPHL Application Number** → Save. Status changes to `Filed to IPOPHL`.

### 9.4 Admin: Invite a new faculty member
Admin Panel → **Users** → **+ Invite User** → role = **Faculty** → submit.

### 9.5 Admin: Post a news article
Admin Panel → **News** → **+ New Article** → fill fields → **Publish**.

### 9.6 Admin: Respond to a service request
Admin Panel → **Services** → click the request → contact the requester via their email → mark **In Progress** / **Completed**.

### 9.7 Faculty: Start a new IP application
Faculty Dashboard → **+ New IP Application** → complete 4 steps → **Submit for Internal Review** (or **Save as Draft**).

### 9.8 Faculty: Fix an application returned for revision
Faculty Dashboard → filter **Pending Review** or locate application with `Needs Revision` → open → read comments → click **Edit** → update → **Submit for Internal Review**.

### 9.9 Public user: Download an IPOPHL form
Home → **Resources** → **Templates** tab → pick a category → click **Download** on the desired form.

### 9.10 Public user: Book a facility
Home → **Services** → **Additional Services** (or direct link) → pick a facility → **Book This Facility** → fill inquiry form → submit.

---

## 10. Troubleshooting & FAQ

**Q1. I cannot log in with my Google account.**
- Confirm you are using your `@ustp.edu.ph` address. Personal Gmail accounts are rejected.
- Clear browser cache and try again.
- If the issue persists, ask an Admin to check your user record in the **Users** tab.

**Q2. My faculty dashboard says "Access Denied".**
- Your account exists in Supabase Auth but does not have a faculty profile yet. An Admin must go to **Users** and assign the Faculty role.

**Q3. I uploaded a large PDF and the upload failed.**
- Maximum recommended file size is about 20 MB per attachment. Split or compress the PDF before uploading.

**Q4. The admin tab I need is missing.**
- Some tabs (e.g., **Users**) are admin-only. If you have the Faculty role, those tabs will not appear.

**Q5. I archived a patent by mistake.**
- In the Patents tab, change the filter to **Archived**, open the record, and restore it (or toggle **Published** back on).

**Q6. A faculty member cannot see an application I know exists.**
- Applications are tied to the faculty's account (`faculty_id`). If it was submitted by a different account, the owner is the only one who can see it. The admin can still see it in the **IP Applications** tab.

**Q7. The chatbot says it doesn't know the answer.**
- Rephrase the question with more context. If the topic is not covered by the uploaded knowledge base, contact TPCO directly via the Contact page.

**Q8. Notifications are not arriving.**
- Check the bell icon — notifications are in-app first, not via email.
- Email notifications require the email service to be configured in the server environment.

**Q9. The homepage stats look wrong.**
- Stats come directly from the database. Verify on the **Dashboard** and **Patents** tabs of the Admin Panel. Use **Save Revenue** to refresh the Licensed Revenue number.

**Q10. After a Google sign-in, I was redirected to `localhost`.**
- This only happens during development. In production, verify that the deployment URL is whitelisted in the Supabase Auth redirect settings. Ask IT/the development team.

---

## 11. Support & Contact

For issues not covered in this manual:

- **TPCO Office Email:** _(as listed on the Contact page)_
- **TPCO Office Location:** USTP Cagayan de Oro, Technology Transfer & Patenting Coordinating Office
- **Technical / System Issues:** Contact the development team who delivered this system.

---

### Document History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | May 2026 | Initial release alongside system turnover to TPCO. |

---

*End of User Manual.*
