function fieldRow(label, value) {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return ''
  const val = Array.isArray(value) ? value.join(', ') : String(value)
  return `
    <tr>
      <td style="padding:8px 24px;border-bottom:1px solid #f0f0f0;vertical-align:top;width:180px;font-size:13px;color:#888;font-weight:500;text-transform:uppercase;letter-spacing:0.5px">${label}</td>
      <td style="padding:8px 24px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;font-weight:400">${val}</td>
    </tr>`
}

function buildTable(fields) {
  const rows = fields.map(f => fieldRow(f.label, f.value)).filter(Boolean).join('')
  if (!rows) return ''
  return `
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;margin-bottom:24px">
      <tbody>${rows}</tbody>
    </table>`
}

function renderWrapper(title, body) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#f4f6f9;padding:40px 16px">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
          <tr>
            <td style="background:linear-gradient(135deg,#1a365d 0%,#2a4a7f 100%);padding:32px 24px;text-align:center">
              <h1 style="margin:0 0 4px;font-size:20px;color:#fff;font-weight:700;letter-spacing:-0.3px">N.A.R.S. Associates</h1>
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);font-weight:400">Chartered Accountants</p>
              <div style="width:40px;height:3px;background:#f59e0b;margin:12px auto 0;border-radius:2px"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:0">
              <div style="background:#f59e0b;padding:14px 24px;text-align:center">
                <h2 style="margin:0;font-size:15px;color:#fff;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">New ${title}</h2>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px">
              ${body}
              <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:16px">
                <tr>
                  <td style="border-top:1px solid #e8e8e8;padding:20px 0 0;text-align:center">
                    <p style="margin:0 0 4px;font-size:12px;color:#999">
                      Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p style="margin:0;font-size:12px;color:#bbb">
                      N.A.R.S. Associates &bull; Gaushala, Kathmandu, Nepal &bull; +977-9855052288
                    </p>
                    <p style="margin:4px 0 0;font-size:11px;color:#ccc">
                      This is an automated notification from your website. Please do not reply directly.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#aaa;text-align:center">
          &copy; ${new Date().getFullYear()} N.A.R.S. Associates. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function get(data, key) {
  if (data[key] !== undefined && data[key] !== null && data[key] !== '') return data[key]
  if (data.metadata && data.metadata[key] !== undefined && data.metadata[key] !== null && data.metadata[key] !== '') return data.metadata[key]
  return undefined
}

exports.renderContactEmail = function renderContactEmail(data) {
  const typeLabels = {
    general: 'General Inquiry',
    rfp: 'Request for Proposal',
    consultation: 'Consultation Booking',
  }
  const formType = typeLabels[data.type] || data.type

  const fields = [
    { label: 'Type', value: formType },
    { label: 'Name', value: get(data, 'name') },
    { label: 'Email', value: get(data, 'email') },
    { label: 'Phone', value: get(data, 'phone') },
    { label: 'Company', value: get(data, 'company') },
    { label: 'Subject', value: get(data, 'subject') },
    { label: 'Industry', value: get(data, 'industry') },
    { label: 'Company Size', value: get(data, 'companySize') },
    { label: 'Annual Revenue', value: get(data, 'annualRevenue') },
    { label: 'Position', value: get(data, 'position') },
    { label: 'Services Interested', value: get(data, 'serviceInterests') },
    { label: 'Project Timeline', value: get(data, 'projectTimeline') },
    { label: 'Budget Range', value: get(data, 'budgetRange') },
    { label: 'Meeting Type', value: get(data, 'meetingType') },
    { label: 'Preferred Date', value: get(data, 'preferredDate') },
    { label: 'Preferred Time', value: get(data, 'preferredTime') },
    { label: 'Duration', value: get(data, 'meetingDuration') },
    { label: 'Topics', value: get(data, 'topics') },
  ]

  const sections = [buildTable(fields)]

  const message = get(data, 'message')
  if (message) {
    sections.push(`
      <div style="background:#f8f9fa;border-radius:8px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">${data.type === 'consultation' ? 'Additional Notes' : 'Message'}</p>
        <p style="margin:0;font-size:14px;color:#444;line-height:1.6">${message.replace(/\n/g, '<br>')}</p>
      </div>`)
  }

  const challenges = get(data, 'currentChallenges')
  const outcomes = get(data, 'expectedOutcomes')
  if (challenges || outcomes) {
    let extra = ''
    if (challenges) extra += `<p style="margin:0 0 4px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Current Challenges</p><p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.6">${challenges.replace(/\n/g, '<br>')}</p>`
    if (outcomes) extra += `<p style="margin:0 0 4px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Expected Outcomes</p><p style="margin:0 0 0;font-size:14px;color:#444;line-height:1.6">${outcomes.replace(/\n/g, '<br>')}</p>`
    sections.push(`<div style="background:#f8f9fa;border-radius:8px;padding:20px 24px;margin-bottom:24px">${extra}</div>`)
  }

  if (data.metadata && typeof data.metadata === 'object') {
    const knownKeys = ['subject', 'industry', 'companySize', 'annualRevenue', 'position', 'projectTimeline', 'budgetRange', 'currentChallenges', 'expectedOutcomes', 'meetingType', 'preferredDate', 'preferredTime', 'meetingDuration', 'topics']
    const extras = Object.entries(data.metadata).filter(([k]) => !knownKeys.includes(k))
    if (extras.length > 0) {
      const metaFields = extras.map(([k, v]) => ({
        label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
        value: Array.isArray(v) ? v.join(', ') : v,
      }))
      sections.push(`
        <h3 style="font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px">Additional Details</h3>
        ${buildTable(metaFields)}`)
    }
  }

  return renderWrapper(`${formType}`, sections.join('\n'))
}

exports.renderCareerEmail = function renderCareerEmail(data) {
  const fields = [
    { label: 'Full Name', value: data.fullName },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Position', value: data.position },
  ]

  const sections = [buildTable(fields)]

  if (data.coverLetter) {
    sections.push(`
      <div style="background:#f8f9fa;border-radius:8px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Cover Letter</p>
        <p style="margin:0;font-size:14px;color:#444;line-height:1.6">${data.coverLetter.replace(/\n/g, '<br>')}</p>
      </div>`)
  }

  if (data.resumeUrl) {
    sections.push(`
      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px">
        <tr>
          <td style="background:#1a365d;border-radius:6px;padding:12px 24px">
            <a href="${data.resumeUrl}" style="color:#fff;text-decoration:none;font-size:14px;font-weight:600">Download Resume</a>
          </td>
        </tr>
      </table>`)
  }

  return renderWrapper('Job Application', sections.join('\n'))
}
