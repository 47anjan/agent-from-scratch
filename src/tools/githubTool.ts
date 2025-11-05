import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

export const githubToolDefinition = {
  name: 'github',
  parameters: z
    .object({
      query: z
        .string()
        .describe(
          'Describe the technologies or topics you’re interested in, e.g. "react typescript nextjs"'
        ),
      sort: z
        .enum(['stars', 'updated'])
        .optional()
        .default('stars')
        .describe('How to sort repositories (stars or updated)'),
      order: z
        .enum(['desc', 'asc'])
        .optional()
        .default('desc')
        .describe('Sort order: descending or ascending'),
    })
    .describe(
      'Use this tool to search GitHub repositories based on technologies or keywords. Returns active repos suitable for contribution.'
    ),
}

type Args = z.infer<typeof githubToolDefinition.parameters>

export const github: ToolFn<Args, string> = async ({ toolArgs }) => {
  const { query, sort, order } = toolArgs

  const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query + ' stars:>50'
  )}&sort=${sort}&order=${order}&per_page=10`

  const res = await fetch(searchUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'openai-github-tool',
    },
  })

  if (!res.ok) {
    return `GitHub API request failed: ${res.statusText}`
  }

  const data = await res.json()

  if (!data.items || data.items.length === 0) {
    return 'No active repositories found for your query.'
  }

  const repos = data.items.map((repo: any) => ({
    name: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    last_updated: repo.updated_at,
    open_issues: repo.open_issues_count,
  }))

  return JSON.stringify(repos, null, 2)
}
