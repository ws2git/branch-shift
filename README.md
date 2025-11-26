# Branch Shift

This GitHub Action renames an existing branch in a GitHub repository using the GitHub API (via a Node.js script).
This is useful for teams who want to **automate branch maintenance or enforce naming conventions** in their CI/CD workflows.

---

## ✨ Features

- **Rename Capability**: Safely renames a specific branch to a new name.
- **Simple Integration**: One-step usage in any workflow.
- **API Driven**: Performs the operation using the GitHub API, ensuring reliability.
- **Flexible**: Requires standard branch name, new name, repository owner, and repository name as inputs.


## 🛠️ Usage

### 1. **Prerequisites**

- Your workflow **must pass all the necessary inputs** (owner, repo, branch, new_name) to this action.
- The environment variable `GH_TOKEN` must be set to a valid GitHub token with the required **write permissions** for the repository, specifically to **edit repository contents/branches**.
    * **Recommendation:** Use a **PAT (Personal Access Token) Secret** with `repo` scope for maximum reliability, as the default `${{ github.token }}` might not have the required permissions to rename branches in all repository security settings.

### 2. **Example Workflow Integration**

```yaml
name: Test Rename Branch

on:
  workflow_dispatch:
    inputs:      
      owner:
        description: 'Proprietário do Repositório (Ex: sua-org ou seu-usuario)'
        required: true
        default: '{{ github.repository_owner }}' # Sugestão: Preencher automaticamente com o owner atual
      
      repo:
        description: 'Nome do Repositório (Ex: meu-projeto)'
        required: true
        default: '{{ github.event.repository.name }}' # Sugestão: Preencher automaticamente com o repo atual
        
      branch:
        description: 'Nome da Branch Atual (para ser renomeada)'
        required: true
        
      new_name:
        description: 'Novo Nome para a Branch'
        required: true

jobs:
  exec_rename:
    runs-on: ubuntu-latest
    steps:
      - name: Exec Branch Shift
        uses: ws2git/branch-shift@v2
        
        with:
          github-token: ${{ secrets.YOUR_PAT }} 
          owner: ${{ github.event.inputs.owner }}
          repo: ${{ github.event.inputs.repo }}
          branch: ${{ github.event.inputs.branch }}
          new_name: ${{ github.event.inputs.new_name }}
````


## 📥 Inputs

| Name | Required | Description |
|---|---|---|
| `github-token` | Yes | GitHub Token with `repo` scope to authorize the API call. |
| `owner` | Yes | The owner of the repository (e.g., your-organization or your-username). |
| `repo` | Yes | The name of the repository (e.g., your-repo). |
| `branch` | Yes | The current name of the branch to be renamed. |
| `new_name` | Yes | The new desired name for the branch. |


## ⚙️ How It Works

This action executes a **Node.js script** (`dist/index.js`) that uses the GitHub API to rename a branch through a single, atomic operation. The action follows a clean, modular architecture with clear separation of concerns.

**Execution Flow:**

1. **Input Validation & Configuration**
   - The `ConfigManager` validates all required inputs (`github-token`, `owner`, `repo`, `branch`, `new_name`)
   - Ensures proper formatting and non-empty values
   - Converts input names from `snake_case` to `camelCase` for internal use

2. **GitHub API Operation**
   - The `GitHubService` uses the official GitHub Octokit SDK with full TypeScript typing
   - Makes a single API call to `repos.renameBranch` endpoint
   - Uses GitHub API version `2022-11-28` for compatibility

**Core Implementation:**

```typescript
// Single API call handling both creation and deletion internally
await this.octokit.rest.repos.renameBranch({
  owner,
  repo, 
  branch,      // Current branch name
  new_name: newName  // Target branch name
});
```

**Key Advantages:**

- **Atomic Operation**: GitHub's native `renameBranch` handles both creation and deletion in one API call
- **Type Safety**: Uses typed Octokit SDK methods instead of generic REST calls
- **Fail Fast**: Comprehensive input validation before any API calls
- **Clean Architecture**: Separated concerns between configuration, orchestration, and service layers

If **any required parameter is missing**, **input validation fails**, or the **token lacks necessary permissions**, the action will exit immediately with a descriptive error message.


## 🛡️ Security and Authentication

This Action requires a GitHub Token with **write permissions** to perform branch operations. The token is passed via the **`github-token` input** (note the exact parameter name).

**Token Requirements:**

The provided token must have sufficient permissions to call the GitHub API's `repos.renameBranch` endpoint. This typically requires:
- **`repo` scope** for personal access tokens
- **Write access** to the repository contents

**Recommended Setup:**

For most scenarios, especially in organizational contexts, we recommend using a **Personal Access Token (PAT)** stored as a repository secret:

```yaml
- name: Branch Rename
  uses: ws2git/branch-shift@v2
  with:
    github-token: ${{ secrets.REPO_RENAME_TOKEN }}
    owner: ${{ github.repository_owner }}
    repo: ${{ github.event.repository.name }}
    branch: 'old-branch-name'
    new_name: 'new-branch-name'
```

**Alternative Options:**

```yaml
# Using GitHub's automatically provided token (may have limited permissions)
github-token: ${{ github.token }}

# Using a custom PAT with explicit repo scope
github-token: ${{ secrets.REPO_RENAME_TOKEN }}
```

For production use, create a dedicated PAT with minimal required scopes and store it securely in your repository secrets.


## 📌 Notes

⚠️ Attention: Repository Access Permissions

**It is crucial to ensure that the token used has the `repo` scope or the necessary permissions to *push* and *delete* branches.** This is often the biggest hurdle for branch manipulation Actions.

These are the important points to consider regarding the branch renaming operation:

  * **Default Token Limitation**: The default token (`${{ github.token }}`) might be read-only or lack the necessary permissions to delete or create branches via the API, especially in certain contexts (like PRs from forks) or with stricter organization security settings.
  * **PAT is Safer**: For Actions that modify the repository structure (like renaming/deleting branches), using a **dedicated PAT stored as a secret** is the most reliable approach.
  * The token is validated early in the execution flow via ConfigManager
  * Invalid or insufficient tokens will cause immediate action failure
  * Token values are never logged or exposed in output
  * Never hardcode tokens in workflow files - always use secrets


## 🔗 Related Documentation

  * [GitHub Actions Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)
  * [GitHub REST API - Rename a Branch](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#rename-a-branch)


## ❓ Support

If you find a bug or have a question, [open an issue](https://github.com/ws2git/branch-shift/issues).
