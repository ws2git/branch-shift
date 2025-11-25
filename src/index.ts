import * as core from '@actions/core';
import * as github from '@actions/github';

interface ActionInputs {
  readonly githubToken: string;
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
  readonly newName: string;
}

/**
* Helper function to validate inputs before execution.
* Throws an error if any validation fails.
*/
function validateInputs(inputs: ActionInputs): void {
  const { owner, repo, branch, newName, githubToken } = inputs;

  if (!owner || !repo || !branch || !newName || !githubToken) {
    throw new Error('All input fields (owner, repo, branch, new_name) are required.');
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
    const inputs: ActionInputs = {
      githubToken: core.getInput('github_token', { required: true }).trim(),
      owner: core.getInput('owner', { required: true }).trim(),
      repo: core.getInput('repo', { required: true }).trim(),
      branch: core.getInput('branch', { required: true }).trim(),
      newName: core.getInput('new_name', { required: true }).trim(),
    };
    
    validateInputs(inputs);

    const octokit = github.getOctokit(inputs.githubToken);

    core.info(`Starting the renaming of '${inputs.branch}' to '${inputs.newName}'...`);

    await octokit.request('POST /repos/{owner}/{repo}/branches/{branch}/rename', {
      owner: inputs.owner,
      repo: inputs.repo,
      branch: inputs.branch,
      new_name: inputs.newName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    core.info(`✅ Branch renamed successfully.`);

  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Action failed due to error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error.');
    }
  }
}

void run();
