# Security Guidelines & Git Workflow

## 🚨 Project Scope & Access Restrictions

**Claude Code is RESTRICTED to working within this project directory ONLY:**
```
/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder
```

### ⛔ Access Restrictions
- No system files access
- No other project directories
- No user home directory files outside this project
- Only work within the semantic-talent-finder project scope

## 🚫 Git Safety Requirements

### Critical Git Rules
- **NEVER force push any code**
- Always use regular `git push` commands
- Never use `git push --force` or `git push -f`
- Respect the existing commit history

## 🔐 Security Requirements

### Sensitive Data Protection
- **NEVER commit API keys or secrets** to the repository
- **ALWAYS ensure .gitignore covers sensitive files**
- **OpenAI API Key**: Always use environment variables (OPENAI_API_KEY)
- **Database credentials**: Use environment variables in production
- **Before each commit**: Verify no sensitive data is included

### Environment Variables
```bash
# Required environment variables
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_db_password
GITHUB_CLIENT_ID=your_github_client_id (optional)
GITHUB_CLIENT_SECRET=your_github_secret (optional)
```

## 📝 Git Workflow - Mandatory

### Commit Requirements
- **ALWAYS make a git commit after completing any substantial changes**
- **Use descriptive commit messages** that explain what was changed and why
- **Push to remote repository**: git@github.com:Sungchunn/semantic-talent-finder.git
- **Commit frequency**: After each feature, bug fix, or configuration change
- **Include co-author attribution**: Co-Authored-By: Claude <noreply@anthropic.com>

### Commit Message Format
```
feat: Add semantic search functionality with OpenAI embeddings

- Implement SemanticSearchService with vector similarity search
- Add HNSW indexing for 50M+ profile dataset
- Configure batch processing for optimal performance

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Git Commands Reference
```bash
# Standard workflow
git add .
git commit -m "Your commit message"
git push origin main

# Check status before commit
git status
git diff

# Never use these commands
git push --force    # ❌ FORBIDDEN
git push -f         # ❌ FORBIDDEN
```

## 🔍 Security Checklist

Before each commit, verify:
- [ ] No API keys in code
- [ ] No passwords in configuration files
- [ ] Environment variables used for secrets
- [ ] .gitignore covers sensitive files
- [ ] No personal information in test data
- [ ] Database credentials externalized

## 🛡️ Code Security Best Practices

- Never hardcode credentials in source code
- Use parameterized queries to prevent SQL injection
- Validate all user inputs
- Implement proper error handling without exposing system details
- Use HTTPS for all external API calls
- Sanitize data before database storage