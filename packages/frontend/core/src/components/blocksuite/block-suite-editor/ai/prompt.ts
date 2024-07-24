// manually synced with packages/backend/server/src/data/migrations/utils/prompts.ts
// TODO(@Peng): automate this
export const promptKeys = [
  'debug:chat:gpt4',
  'debug:action:gpt4',
  'debug:action:vision4',
  'debug:action:dalle3',
  'debug:action:fal-sd15',
  'debug:action:fal-upscaler',
  'debug:action:fal-remove-bg',
  'debug:action:fal-face-to-sticker',
  'debug:action:fal-summary-caption',
  'chat:gpt4',
  'Summary',
  'Summary the webpage',
  'Explain this',
  'Explain this image',
  'Explain this code',
  'Translate to',
  'Write an article about this',
  'Write a twitter about this',
  'Write a poem about this',
  'Write a blog post about this',
  'Write outline',
  'Change tone to',
  'Brainstorm ideas about this',
  'Expand mind map',
  'Improve writing for it',
  'Improve grammar for it',
  'Fix spelling for it',
  'Find action items from it',
  'Check code error',
  'Create headings',
  'Make it real',
  'Make it real with text',
  'Make it longer',
  'Make it shorter',
  'Continue writing',
  'workflow:presentation',
  'workflow:brainstorm',
  'workflow:image-sketch',
  'workflow:image-clay',
  'workflow:image-anime',
  'workflow:image-pixel',
] as const;

export type PromptKey = (typeof promptKeys)[number];
