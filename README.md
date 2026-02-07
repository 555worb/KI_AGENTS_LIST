# KI Agents List

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ki-agents-list.vercel.app)
[![Security](https://img.shields.io/badge/security-A+-green)](./SECURITY_AUDIT_REPORT.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Kuratierte Liste von 12 produktionsreifen Claude Code Subagent-Konfigurationen aus den offiziellen Anthropic-Docs und der Community.

## Live Demo

**https://ki-agents-list.vercel.app**

## Features

- 12 battle-tested Claude Code Subagents
- Konfigurationen aus offiziellen Anthropic-Docs
- Community-bewährte Prompts (bartsmykla, iannuttall, contains-studio)
- Interaktive Agent-Cards mit vollständigen System Prompts
- Cyberpunk-inspiriertes UI mit Neon-Effekten
- Responsive Design (Mobile-First)

## Agent-Kategorien

- **Code Quality:** code-reviewer, code-refactorer
- **Security:** security-auditor, security-auditor-enterprise
- **Testing:** test-writer, test-automator
- **Development:** debugger, vibe-coding-coach
- **Documentation:** doc-generator, pr-helper
- **Performance:** perf-analyzer
- **Data:** data-scientist

## Tech Stack

- **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS
- **Markdown:** marked.js v15.0.7
- **Security:** DOMPurify v3.2.4
- **Hosting:** Vercel
- **Security:** Comprehensive CSP, HSTS, Permissions-Policy

## Security

This project implements enterprise-grade security controls:

- Strict Content Security Policy with hash-based script whitelisting
- HTTP Strict Transport Security (HSTS) with 2-year max-age
- Comprehensive Permissions-Policy denying unnecessary features
- Subresource Integrity (SRI) for all CDN resources
- DOMPurify sanitization with strict allowlist configuration
- Input validation with size limits
- Rate limiting and timeout protection
- Responsible disclosure via security.txt (RFC 9116)

For security reports, see [SECURITY.md](./SECURITY.md)

For detailed audit report, see [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md)

### Security Verification

Run the automated security check:

```bash
./security-check.sh https://ki-agents-list.vercel.app
```

Or verify manually:
- [SecurityHeaders.com](https://securityheaders.com/?q=https://ki-agents-list.vercel.app)
- [Mozilla Observatory](https://observatory.mozilla.org/analyze/ki-agents-list.vercel.app)

## Local Development

```bash
# Clone the repository
git clone https://github.com/555worb/KI_AGENTS_LIST.git
cd KI_AGENTS_LIST

# Serve locally (any HTTP server works)
python3 -m http.server 8000
# or
npx serve

# Open in browser
open http://localhost:8000
```

## Project Structure

```
KI_AGENTS_LIST/
├── index.html              # Main HTML with security headers
├── script.js               # Vanilla JS with input validation
├── agents.md               # Agent data (Markdown format)
├── vercel.json             # Vercel config with security headers
├── SECURITY.md             # Security policy and disclosure process
├── SECURITY_AUDIT_REPORT.md # Comprehensive security audit report
├── security.txt            # RFC 9116 security contact info
├── robots.txt              # Crawler control
├── security-check.sh       # Automated security verification script
└── .well-known/
    └── security.txt        # RFC 9116 canonical location
```

## Contributing

Contributions are welcome! Please:

1. Read [SECURITY.md](./SECURITY.md) for security guidelines
2. Follow existing code style
3. Ensure all security checks pass
4. Test locally before submitting PR
5. Include agent source attribution

### Adding New Agents

Edit `agents.md` following this format:

```markdown
## Agent

- **Name:** your-agent-name
- **Funktion:** Brief description
- **Quelle:** Source attribution
- **Model:** opus | sonnet | haiku | inherit

Detailed description here.

\```
---
name: your-agent-name
description: Agent description
tools: [Read, Write, Bash]
model: sonnet
---

Your system prompt here.
\```
```

## Security Policy

For security vulnerabilities:
- **DO NOT** open public issues
- Use GitHub Security Advisories: https://github.com/555worb/KI_AGENTS_LIST/security/advisories/new
- Or report via security.txt contact methods

See [SECURITY.md](./SECURITY.md) for full policy.

## Credits

- **Anthropic Docs:** code-reviewer, debugger, data-scientist
- **bartsmykla/claude-agents:** security-auditor, perf-analyzer, test-writer, doc-generator, pr-helper
- **iannuttall/claude-agents:** security-auditor-enterprise, code-refactorer, vibe-coding-coach
- **Community:** test-automator (Medium/Kinjal Radadiya)

## License

MIT License - See LICENSE file for details

## Links

- **Live Demo:** https://ki-agents-list.vercel.app
- **Repository:** https://github.com/555worb/KI_AGENTS_LIST
- **Security:** https://ki-agents-list.vercel.app/.well-known/security.txt
- **Anthropic Docs:** https://docs.anthropic.com/

---

Made with Claude Code | Security Audited | Production Ready
