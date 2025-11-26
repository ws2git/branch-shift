import * as core from '@actions/core';

export interface ActionInputs {
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
  readonly newName: string;
  readonly githubToken: string;
}

export class ConfigManager {
  static getInputs(): ActionInputs {
    const inputs: ActionInputs = {
      owner: core.getInput('owner', { required: true }).trim(),
      repo: core.getInput('repo', { required: true }).trim(),
      branch: core.getInput('branch', { required: true }).trim(),
      newName: core.getInput('new_name', { required: true }).trim(),
      githubToken: core.getInput('github-token', { required: true }).trim(),
    };

    this.validate(inputs);
    return inputs;
  }

  private static validate(inputs: ActionInputs): void {
    const { owner, repo, branch, newName, githubToken } = inputs;

    if (!owner || !repo || !branch || !newName || !githubToken) {
      throw new Error('All inputs are required and cannot be empty.');
    }

    const branchRegex = /^[a-zA-Z0-9-_./]+$/;
    if (!branchRegex.test(newName)) {
      throw new Error(`Invalid branch name format: '${newName}'.`);
    }

  }
}
