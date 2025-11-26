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
name: Rename Branch

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
        uses: ws2git/branch-shift@v1.5
        
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

This action executes a **Node.js script** (`dist/index.js`) that uses the GitHub API to perform two main steps to effectively "rename" a branch:

1.  **Create a New Branch:** It creates a new branch using the `new_name` that points to the same commit as the `branch` (the old name).
2.  **Delete the Old Branch:** It deletes the original `branch` (the old name).

The use of a Node.js script allows for precise control over the API calls.

**Script logic (Conceptual):**

```javascript
// Step 1: Create a new branch pointing to the old branch's commit SHA
const create_ref_url = `/repos/${owner}/${repo}/git/refs`;
// API Call: POST /repos/{owner}/{repo}/git/refs
// Body: { "ref": "refs/heads/new_name", "sha": <SHA_of_old_branch> }

// Step 2: Delete the old branch
const delete_ref_url = `/repos/${owner}/${repo}/git/refs/heads/${branch}`;
// API Call: DELETE /repos/{owner}/{repo}/git/refs/heads/branch

```

If **any required parameter is missing** or the **token lacks the necessary permissions**, the script will exit with an error.


## 🛡️ Security and Authentication

This Action requires a GitHub Token with **write permissions** on the repository to perform branch operations. The token is passed via the **`github_token` input**.

**Recommended**: Since renaming a branch is a highly privileged operation, it's highly recommended to use a **Personal Access Token (PAT)** stored as a **Secret** that explicitly has the `repo` scope, as the default **`${{ github.token }}`** might not have sufficient permissions, especially in organizational setups.

```yaml
env:
  # Using an explicitly created Secret PAT (e.g., REPO_RENAME_TOKEN)
  # stored in your repository secrets.
  GH_TOKEN: ${{ secrets.REPO_RENAME_TOKEN }}
```

**Never expose the PAT in plain text.**


## 📌 Notes

⚠️ Attention: Repository Access Permissions

**It is crucial to ensure that the token used has the `repo` scope or the necessary permissions to *push* and *delete* branches.** This is often the biggest hurdle for branch manipulation Actions.

These are the important points to consider regarding the branch renaming operation:

  * **Default Token Limitation**: The default token (`${{ github.token }}`) might be read-only or lack the necessary permissions to delete or create branches via the API, especially in certain contexts (like PRs from forks) or with stricter organization security settings.
  * **PAT is Safer**: For Actions that modify the repository structure (like renaming/deleting branches), using a **dedicated PAT stored as a secret** is the most reliable approach.


## 🔗 Related Documentation

  * [GitHub Actions Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)
  * [GitHub REST API - Rename a Branch](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#rename-a-branch)


## ❓ Support

If you find a bug or have a question, [open an issue](https://github.com/ws2git/branch-shift/issues).
