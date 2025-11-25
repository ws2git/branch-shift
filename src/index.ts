import * as core from '@actions/core'
import * as github from '@actions/github';

/**
* Helper function to validate inputs before execution.
* Throws an error if any validation fails.
*/
function validateInputs(owner: string, repo: string, branch: string, newName: string): void {
  if (!owner || !repo || !branch || !newName) {
    throw new Error('All input fields (owner, repo, branch, new_name) are required..');
  }
  
  const branchRegex = /^[a-zA-Z0-9-_./]+$/;
  if (!branchRegex.test(newName)) {
    throw new Error(`The new branch name is invalid: '${newName}'. Allowed characters: a-z, A-Z, 0-9, -, _, ., /`);
  }
}


/**
 * Main asynchronous function.
 * @returns {Promise<void>}
 */
async function run(): Promise<void> {
  try {
    const githubToken: string = core.getInput('github_token', { required: true }).trim();
    const owner: string = core.getInput('owner', { required: true }).trim();
    const repo: string = core.getInput('repo', { required: true }).trim();
    const branch: string = core.getInput('branch', { required: true }).trim();
    const newName: string = core.getInput('new_name', { required: true }).trim();
    
    validateInputs(owner, repo, branch, newName);
    
    const octokit = github.getOctokit(githubToken);

    core.info(`Iniciando a renomeação da branch '${branch}' para '${newName}' no repositório ${owner}/${repo}...`);

    await octokit.request('POST /repos/{owner}/{repo}/branches/{branch}/rename', {
      owner,
      repo,
      branch,
      new_name: newName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    core.info(`✅ Branch '${branch}' renomeada com sucesso para '${newName}'.`);
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Action failed due to error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error.');
    }
  }
}

void run();
