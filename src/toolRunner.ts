import type OpenAI from 'openai'
import { generateImage } from './tools/generateImage'
import { dadJoke } from './tools/dadJoke'
import { reddit } from './tools/reddit'
import { github } from './tools/githubTool'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments),
  }
  switch (toolCall.function.name) {
    case 'generate_image':
      const image = await generateImage(input)
      return image

    case 'dad_joke':
      return dadJoke(input)

    case 'reddit':
      return reddit(input)

    case 'github':
      return github(input)

    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
