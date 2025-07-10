
import { tool } from "ai";
import { z } from "zod";


export const getCrazy = tool({
  description:
    "This tool will show the Experience thing I've ever done. use it when the user ask someting like : 'Show me your story — where have you been, and what have you done?'",
  parameters: z.object({}),
  execute: async () => {
    return "Above lies my glorious trail of trials—featuring epic bugs, questionable decisions, and a front-row seat to my mistakes (yes, I took notes). Scroll on if you're into character-building crashes and breakthrough fixes.";
  },
});
