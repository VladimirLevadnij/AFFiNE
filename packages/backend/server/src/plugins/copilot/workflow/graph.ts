import { NodeExecutorType } from './executor';
import type {
  WorkflowGraphs,
  WorkflowNodeState,
  WorkflowParams,
} from './types';
import { WorkflowNodeType } from './types';

export const WorkflowGraphList: WorkflowGraphs = [
  {
    name: 'presentation',
    graph: [
      {
        id: 'start',
        name: 'Start: check language',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatText,
        promptName: 'workflow:presentation:step1',
        paramKey: 'language',
        edges: ['step2'],
      },
      {
        id: 'step2',
        name: 'Step 2: generate presentation',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatText,
        promptName: 'workflow:presentation:step2',
        edges: ['step3'],
      },
      {
        id: 'step3',
        name: 'Step 3: format presentation if needed',
        nodeType: WorkflowNodeType.Decision,
        condition: (nodeIds: string[], params: WorkflowNodeState) => {
          const lines = params.content?.split('\n') || [];
          return nodeIds[
            Number(
              !lines.some(line => {
                try {
                  if (line.trim()) {
                    JSON.parse(line);
                  }
                  return false;
                } catch {
                  return true;
                }
              })
            )
          ];
        },
        edges: ['step4', 'step5'],
      },
      {
        id: 'step4',
        name: 'Step 4: format presentation',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatText,
        promptName: 'workflow:presentation:step4',
        edges: ['step5'],
      },
      {
        id: 'step5',
        name: 'Step 5: finish',
        nodeType: WorkflowNodeType.Nope,
        edges: [],
      },
    ],
  },
  {
    name: 'brainstorm',
    graph: [
      {
        id: 'start',
        name: 'Start: check language',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatText,
        promptName: 'workflow:brainstorm:step1',
        paramKey: 'language',
        edges: ['step2'],
      },
      {
        id: 'step2',
        name: 'Step 2: generate brainstorm mind map',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatText,
        promptName: 'workflow:brainstorm:step2',
        edges: [],
      },
    ],
  },
  {
    name: 'image-sketch',
    graph: [
      {
        id: 'start',
        name: 'Start: extract edge',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatImage,
        promptName: 'debug:action:fal-teed',
        paramKey: 'controlnets',
        paramToucher: params => {
          if (Array.isArray(params.controlnets)) {
            const controlnets = params.controlnets.map(image_url => ({
              path: 'diffusers/controlnet-canny-sdxl-1.0',
              image_url,
            }));
            return { controlnets } as WorkflowParams;
          } else {
            return {};
          }
        },
        edges: ['step2'],
      },
      {
        id: 'step2',
        name: 'Step 2: generate tags',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatText,
        promptName: 'workflow:image-sketch:step2',
        paramKey: 'tags',
        paramToucher: params => ({
          ...params,
          model_name: 'stabilityai/stable-diffusion-xl-base-1.0',
        }),
        edges: ['step3'],
      },
      {
        id: 'step3',
        name: 'Step3: generate image',
        nodeType: WorkflowNodeType.Basic,
        type: NodeExecutorType.ChatImage,
        promptName: 'debug:action:fal-lora-i2i',
        edges: [],
      },
    ],
  },
];
