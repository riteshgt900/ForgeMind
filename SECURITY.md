# SECURITY

## Security Policy
- Never commit secrets or credentials.
- Enforce least privilege for GitHub, Slack, and MCP tokens.
- Use environment variables and external secret stores.

## Reporting Vulnerabilities
- Email security@forgemind.local with reproduction details.
- Include impact, affected versions, and mitigation suggestions.

## Secure Development Controls
- ESLint and TypeScript strict mode required.
- Dependency audit and Trivy scans in CI.
- Reviewer security agent checks for OWASP-style risks.

## Runtime Controls
- Webhook signatures validated by secret.
- Approval gate events audited in structured logs.
- Rollback pathway enabled for P0 incidents.
