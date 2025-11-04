import 'dotenv/config'
import { runAgent } from './src/agent'
import { z } from 'zod'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

const weatherTool = {
  name: 'weather',
  description:
    'use this to get the weather, the weather does not required any city for country',
  parameters: z.object({
    reasoning: z.string().describe('why did you pick this tool?'),
  }),
}

await runAgent({ userMessage, tools: [weatherTool] })
