# Security Policy

## Supported Versions

This project is currently in active development. We take security seriously and encourage responsible disclosure.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We appreciate security researchers and users who report vulnerabilities responsibly.

### How to Report

**Please DO NOT open public issues for security vulnerabilities.**

Instead, please report security vulnerabilities by:

1. **GitHub Security Advisories** (preferred):
   - Go to https://github.com/555worb/KI_AGENTS_LIST/security/advisories/new
   - Fill out the form with details about the vulnerability

2. **Email** (if you prefer private communication):
   - Contact the project maintainers via GitHub

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: What an attacker could do with this vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Proof of Concept**: If applicable, code or screenshots demonstrating the issue
- **Affected Components**: Which files, functions, or features are affected
- **Suggested Fix**: If you have ideas on how to fix it

### Response Timeline

- **Initial Response**: Within 48 hours of report
- **Status Update**: Within 7 days with assessment
- **Fix Timeline**: Depends on severity
  - Critical: Within 24-48 hours
  - High: Within 7 days
  - Medium: Within 30 days
  - Low: Within 90 days

### Security Measures in Place

This project implements multiple security layers:

- **Content Security Policy (CSP)**: Strict CSP with minimal inline script permissions
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Input Sanitization**: DOMPurify for all Markdown rendering
- **Subresource Integrity (SRI)**: All CDN resources verified with SRI hashes
- **HTTPS Only**: Enforced via upgrade-insecure-requests CSP directive
- **XSS Protection**: Multiple layers including CSP and DOMPurify
- **Path Traversal Protection**: Input validation on file paths
- **DoS Protection**: Response size limits

## Security Best Practices for Contributors

When contributing to this project, please:

1. **Never commit secrets**: API keys, tokens, passwords
2. **Validate all inputs**: Especially user-provided data
3. **Use parameterized queries**: If database code is added
4. **Keep dependencies updated**: Run `npm audit` regularly
5. **Follow secure coding guidelines**: OWASP Top 10 awareness
6. **Test security controls**: Verify that security features work
7. **Document security decisions**: Explain why security choices were made

## Acknowledgments

We would like to thank the following security researchers for responsibly disclosing vulnerabilities:

- [List will be updated as reports come in]

## Security Contact

For security-related questions or concerns:
- GitHub: https://github.com/555worb/KI_AGENTS_LIST/security
- Security Advisory: https://github.com/555worb/KI_AGENTS_LIST/security/advisories/new

## Out of Scope

The following are explicitly out of scope for security reports:

- Issues in third-party dependencies that have already been publicly disclosed
- Denial of service attacks requiring excessive bandwidth
- Social engineering attacks
- Issues requiring physical access to the device
- Browser-specific issues not reproducible in latest Chrome, Firefox, or Safari

Thank you for helping keep this project secure!
