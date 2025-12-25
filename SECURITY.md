# Security and Privacy Policy

## Overview

Virtual Company takes security and privacy seriously. This document outlines our current security measures, data handling practices, and recommendations for safe usage.

## Current Implementation Status

### ⚠️ Important Notice
**This is a demonstration/prototype application. The current implementation prioritizes simplicity and ease of use over enterprise-grade security. DO NOT use this application in production environments without implementing the recommended security improvements.**

---

## Data Storage

### Client-Side Storage
All data is currently stored in your browser's LocalStorage:

#### Stored Data Types
1. **User Credentials** (`virtualCompanyUsers`)
   - Email addresses
   - Usernames
   - Passwords (⚠️ Currently stored in plain text)
   - Full names

2. **Session Data** (`virtualCompanyUser`)
   - Current logged-in user information
   - No password stored in session

3. **Roles** (`virtualCompanyRoles`)
   - Role names
   - Role descriptions
   - AI instructions
   - Avatar selections

4. **Chat Messages** (`virtualCompanyChatMessages`)
   - All chat messages
   - Sender information
   - Timestamps

5. **AI Configuration** (`virtualCompanyAIConfig`)
   - ⚠️ API keys (stored in plain text)
   - AI provider selection
   - Custom endpoint URLs
   - Voice settings

### Data Retention
- Data persists in browser until:
  - User clears browser data
  - User manually logs out (session only)
  - LocalStorage is cleared by browser (quota exceeded)
- No automatic data expiration
- No server-side backups

### Data Limits
- LocalStorage typical limit: 5-10MB per domain
- No pagination or data archiving
- Large chat histories may hit storage limits

---

## Security Vulnerabilities (Current)

### 🔴 Critical Issues

#### 1. Password Storage
**Issue**: Passwords stored in plain text  
**Risk**: If someone gains access to your browser's LocalStorage, all passwords are visible  
**Mitigation**: Only use test passwords, never reuse passwords from other services  
**Fix Required**: Implement bcrypt or argon2 hashing

#### 2. API Key Storage
**Issue**: API keys stored in plain text in LocalStorage  
**Risk**: API keys can be stolen and used maliciously  
**Mitigation**: Use API keys with spending limits and monitor usage  
**Fix Required**: Encrypt API keys or use secure token exchange

#### 3. No Input Validation
**Issue**: User inputs not fully validated/sanitized  
**Risk**: Potential for XSS attacks, code injection  
**Mitigation**: Avoid entering untrusted content  
**Fix Required**: Implement comprehensive input validation and sanitization

### 🟡 Medium Issues

#### 4. No Session Management
**Issue**: No session timeout or token expiration  
**Risk**: Unauthorized access if device left unattended  
**Mitigation**: Always log out when finished  
**Fix Required**: Implement JWT with expiration

#### 5. No HTTPS Enforcement
**Issue**: Works on HTTP, data transmitted in clear text  
**Risk**: Man-in-the-middle attacks possible  
**Mitigation**: Always use HTTPS URLs  
**Fix Required**: Force HTTPS redirect

#### 6. CORS Not Configured
**Issue**: No CORS policy for API calls  
**Risk**: Potential for CSRF attacks  
**Mitigation**: Use trusted AI API endpoints only  
**Fix Required**: Implement proper CORS headers when backend added

### 🟢 Low Issues

#### 7. No Rate Limiting
**Issue**: No protection against brute force or spam  
**Risk**: Account enumeration, resource exhaustion  
**Mitigation**: Don't share your application URL publicly  
**Fix Required**: Implement rate limiting

---

## Privacy Practices

### What We Collect
The application collects and stores:
- Information you provide (name, email, username, password)
- Roles you create (names, descriptions, AI instructions)
- Messages you send in chat
- AI configuration (API keys, provider selection)

### What We DON'T Collect
- **No Analytics**: No usage tracking or analytics
- **No Cookies**: No tracking cookies (uses LocalStorage only)
- **No Server Transmission**: Data never leaves your browser
- **No Third-Party Sharing**: Zero data sharing (except optional AI API calls)

### Data Processing Location
- **Local Only**: All processing happens in your browser
- **No Server**: No backend server collecting data
- **AI APIs**: When configured, messages sent to AI providers (OpenAI, Claude, custom)

### Third-Party Services
When you configure AI integration:

#### OpenAI API
- Privacy Policy: https://openai.com/privacy/
- Data sent: Chat messages, role instructions
- Data usage: Subject to OpenAI's terms
- Recommendation: Review OpenAI's data usage policy

#### Anthropic Claude
- Privacy Policy: https://www.anthropic.com/privacy
- Data sent: Chat messages, role instructions
- Data usage: Subject to Anthropic's terms
- Recommendation: Review Anthropic's data usage policy

#### Custom Endpoints
- Data sent to your specified endpoint
- You are responsible for endpoint security
- Recommendation: Only use trusted, secure endpoints

---

## User Rights & Data Control

### Your Rights
1. **Access**: You can view all your data in browser DevTools (Application → LocalStorage)
2. **Export**: Use browser DevTools to export LocalStorage data (future: built-in export)
3. **Delete**: Clear browser data or use logout to remove session
4. **Modify**: Edit any stored data directly through the application

### Data Deletion
To completely delete your data:
1. **Session Only**: Click "Logout" button
2. **All Data**: Clear browser LocalStorage or browser data for the domain
3. **Selective**: Use browser DevTools to remove specific items

---

## Best Practices for Users

### Account Security
1. ✅ Use a unique password (different from other services)
2. ✅ Use a strong password (12+ characters, mixed case, numbers, symbols)
3. ✅ Never share your login credentials
4. ✅ Log out when finished using the application
5. ✅ Don't use on shared/public computers
6. ✅ Keep your browser and OS updated

### API Key Security
1. ✅ Use API keys with spending limits
2. ✅ Monitor API usage regularly
3. ✅ Rotate API keys periodically
4. ✅ Never share API keys
5. ✅ Revoke unused API keys
6. ✅ Use project-specific API keys (not master keys)

### Data Privacy
1. ✅ Don't enter sensitive personal information
2. ✅ Don't share confidential business data
3. ✅ Review AI provider privacy policies
4. ✅ Understand that AI providers may log requests
5. ✅ Don't use for regulated data (HIPAA, financial, etc.)

### Browser Security
1. ✅ Use modern, updated browsers (Chrome, Firefox, Edge, Safari)
2. ✅ Enable automatic browser updates
3. ✅ Use browser extensions carefully (some can access LocalStorage)
4. ✅ Use private/incognito mode for extra privacy
5. ✅ Clear browser data periodically

---

## Recommended Security Improvements

### For Production Use
If you want to use this in production, implement these improvements:

#### 1. Password Security
```javascript
// Use bcrypt for password hashing
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### 2. Input Validation
```javascript
// Sanitize all user inputs
function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

#### 3. API Key Encryption
```javascript
// Encrypt API keys before storing
const CryptoJS = require('crypto-js');
const encrypted = CryptoJS.AES.encrypt(apiKey, userPassword).toString();
const decrypted = CryptoJS.AES.decrypt(encrypted, userPassword).toString(CryptoJS.enc.Utf8);
```

#### 4. HTTPS Enforcement
```javascript
// Force HTTPS redirect
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

#### 5. Session Timeout
```javascript
// Implement session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
let lastActivity = Date.now();

setInterval(() => {
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    logout();
  }
}, 60000);
```

#### 6. Content Security Policy
```html
<!-- Add CSP header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://api.openai.com https://api.anthropic.com">
```

---

## Incident Response

### If You Suspect a Security Issue

1. **Stop Using**: Immediately stop using the application
2. **Change Passwords**: Change passwords on any services where you used the same password
3. **Revoke API Keys**: Immediately revoke any API keys you configured
4. **Clear Data**: Clear browser data for the domain
5. **Report**: Open a GitHub issue with details (don't include sensitive data)

### Reporting Security Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. **DO** email the maintainer privately
3. **DO** provide details: steps to reproduce, impact, suggested fix
4. **DO** allow reasonable time for a fix before public disclosure

Contact: Open a security advisory in GitHub Security tab

---

## Compliance & Regulations

### Current Status
This application is NOT compliant with:
- ❌ GDPR (no proper consent, data processing agreements)
- ❌ HIPAA (no PHI protection)
- ❌ SOC 2 (no security controls audit)
- ❌ PCI DSS (no payment card data protection)
- ❌ CCPA (no privacy notice, opt-out mechanisms)

### For Regulated Industries
**DO NOT** use this application for:
- Healthcare data (HIPAA)
- Payment card information (PCI DSS)
- Financial data (SOX, GLBA)
- Personal data in EU (GDPR) without proper consent
- California resident data (CCPA) without compliance

### Future Compliance Plans
See ROADMAP.md for enterprise compliance features planned for 2026.

---

## Transparency

### Open Source
- All code is open source and auditable
- No hidden data collection
- No obfuscated code
- Community can review and suggest improvements

### Version Control
- All changes tracked in Git
- Public change history
- Security fixes clearly documented

---

## Contact & Questions

For security or privacy questions:
- GitHub Issues: For general questions
- GitHub Security: For vulnerability reports
- Email: For private security disclosures

---

## Updates to This Policy

This security and privacy policy is updated as the application evolves. Check the Git commit history to see when changes were made.

**Last Updated**: December 2024  
**Version**: 1.0.0

---

## Acknowledgments

We welcome security researchers and contributors who help make Virtual Company more secure. Responsible disclosure is appreciated.

---

**Remember**: This is a prototype/demo application. Always implement proper security measures before using in production environments.
