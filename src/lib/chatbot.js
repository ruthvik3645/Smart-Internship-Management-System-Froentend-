export function buildChatReply(question, role = 'STUDENT') {
  const text = (question || '').trim();
  const normalized = text.toLowerCase();
  const currentRole = (role || 'STUDENT').toUpperCase();

  if (!normalized) {
    return 'Ask me about internships, applications, reports, or account setup.';
  }

  if (/(hi|hello|hey|good morning|good evening)/.test(normalized)) {
    return 'Hi! I can help with the platform. Ask me how to apply, review candidates, or export reports.';
  }

  if (/(apply|internship|job|role)/.test(normalized)) {
    if (currentRole === 'STUDENT') {
      return 'Go to the Find internships page, review the posting details, and click Apply. You can track your status in My applications and add daily logs once an internship is accepted.';
    }
    if (currentRole === 'COMPANY') {
      return 'Use Postings to create or edit a listing, then review incoming applicants from the Applicants page before accepting or rejecting them.';
    }
    return 'Use the Users and Reports sections to review account activity, approve pending actions, and export summaries for the programme.';
  }

  if (/(log|daily|timesheet|entry)/.test(normalized)) {
    if (currentRole === 'STUDENT') {
      return 'Open Daily logs and add each working day with a short note. Submitted entries are reviewed by your company mentor and may need a follow-up before approval.';
    }
    if (currentRole === 'COMPANY') {
      return 'Review student log entries in the Interns section or review queue. Approve valid daily work and send feedback when a submission needs changes.';
    }
    return 'Check the review queues and approve or reject entries to keep reporting accurate for the whole internship cycle.';
  }

  if (/(applicant|candidate|review|accept|reject)/.test(normalized)) {
    if (currentRole === 'COMPANY') {
      return 'Head to Applicants to review candidate profiles and status. You can shortlist, accept, or reject applicants and then move approved students into active internships.';
    }
    return 'Review the staffing pipeline in the Applicants area and approve company onboarding requests before they can post roles or hire interns.';
  }

  if (/(report|export|csv|pdf)/.test(normalized)) {
    if (currentRole === 'ADMIN') {
      return 'Open Reports and choose the export format you need, such as CSV or PDF. This is the fastest way to review applications and daily logs across the platform.';
    }
    return 'Reporting is managed from the admin side. If you need a data export, ask an administrator to generate the CSV or PDF report.';
  }

  if (/(user|approve|lock|unlock|pending)/.test(normalized)) {
    if (currentRole === 'ADMIN') {
      return 'Open Users to approve pending company accounts, lock or unlock users, and update account roles when needed.';
    }
    return 'Approval and access changes are managed by administrators, so you will usually see the relevant action only after the admin review is complete.';
  }

  if (/(help|how|what can you do)/.test(normalized)) {
    return 'I can explain the main workflow for students, companies, and admins: applying, posting roles, approving logs, and exporting reports.';
  }

  if (/(student|company|admin)/.test(normalized)) {
    if (currentRole === 'STUDENT') {
      return 'As a student, you can browse internships, apply, track applications, and submit daily logs for review.';
    }
    if (currentRole === 'COMPANY') {
      return 'As a company, you can post roles, assess applicants, approve logbook entries, and evaluate intern performance.';
    }
    return 'As an administrator, you can approve company accounts, manage users, and export programme reports.';
  }

  return 'I can help with the internship flow: applying, tracking status, approving logs, submitting evaluations, and exporting reports. Try asking about one of those steps.';
}
