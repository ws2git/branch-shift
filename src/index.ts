import * as core from '@actions/core'
import * as github from '@actions/github';

async function run() {
  try {
    const githubToken = core.getInput('github_token', { required: true })
    const owner = core.getInput('owner', { required: true })
    const repo = core.getInput('repo', { required: true })
    const branch = core.getInput('branch', { required: true })
    const newName = core.getInput('new_name', { required: true })

    const octokit = github.getOctokit(githubToken);

    core.info(`Renaming branch '${branch}' to '${newName}' in ${owner}/${repo}...`)

    await octokit.request('POST /repos/{owner}/{repo}/branches/{branch}/rename', {
      owner,
      repo,
      branch,
      new_name: newName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    core.info(`Branch '${branch}' renamed to '${newName}' successfully.`)
  } catch (error: any) {
    core.setFailed(`Failed to rename branch: ${error.message}`)
  }
}

run()
