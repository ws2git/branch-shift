import * as core from '@actions/core'
import * as github from '@actions/github';

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

    const octokit = github.getOctokit(githubToken);

    core.info(`Renaming branch '${branch}' to '${newName}' in ${owner}/${repo}...`);

    await octokit.request('POST /repos/{owner}/{repo}/branches/{branch}/rename', {
      owner,
      repo,
      branch,
      new_name: newName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    core.info(`Branch '${branch}' renamed to '${newName}' successfully.`);
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Action failed due to error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error.');
    }
  }
}

void run();
