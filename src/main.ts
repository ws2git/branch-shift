import * as core from '@actions/core';
import { ConfigManager } from './config';
import { GitHubService } from './services/github.service';

async function run(): Promise<void> {
  try {
    core.info('-> Initializing action...');
    
    const inputs = ConfigManager.getInputs();
    core.info('✅ Inputs validated.');

    const gitService = new GitHubService(inputs.githubToken);

    core.info(`Starting the renaming of '${inputs.branch}' to '${inputs.newName}'...`);

    await gitService.renameBranch(inputs.owner, inputs.repo, inputs.branch, inputs.newName);

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
