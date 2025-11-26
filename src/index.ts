import * as core from '@actions/core';
import * as github from '@actions/github';
import { ConfigManager } from './config';

/**
 * Main asynchronous function.
 * @returns {Promise<void>}
 */
async function run(): Promise<void> {
  try {
    core.info('-> Initializing action...');

    const inputs = ConfigManager.getInputs();
    core.info('✅ Inputs validated.');

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

    core.info(`✅ Branch renomeada com sucesso.`);

  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Action failed due to error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error.');
    }
  }
}

void run();
