import * as github from '@actions/github';

type OctokitClient = ReturnType<typeof github.getOctokit>;

/**
 * GitHubService
 */
export class GitHubService {
  private readonly octokit: OctokitClient;

  constructor(token: string) {
    this.octokit = github.getOctokit(token);
  }

  /**
   * renameBranch
   */
  async renameBranch(owner: string, repo: string, branch: string, newName: string): Promise<void> {
    await this.octokit.rest.repos.renameBranch({
      owner,
      repo,
      branch,
      new_name: newName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  }
}
