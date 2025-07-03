import { tool } from "ai";
import { z } from "zod";

export const getSports = tool({
  description:
    "This tool returns a playful gallery prompt of my best gaming moments—clutches, fails, and checkmates with friends.",
  parameters: z.object({}),
  execute: async () => {
    return "Here are my top gaming highlights: headshots in Free Fire, epic blunders in Chess, and those ‘did-that-really-just-happen?’ squad moments. Ready to relive the fun?";
  },
});
