import { tool } from "ai";
import { z } from "zod";

export const getSports = tool({
  description:
    "This tool returns a playful gallery prompt of my best gaming moments—clutches, fails, and checkmates with friends. This tools can be used when the user asks about my gaming highlights, favorite games, or memorable moments in gaming. Or anything related to sports for exacmple tell me about your sports.",
  parameters: z.object({}),
  execute: async () => {
    return "Here are my top gaming highlights: headshots in Free Fire, epic blunders in Chess, and those ‘did-that-really-just-happen?’ squad moments. Ready to relive the fun?";
  },
});
