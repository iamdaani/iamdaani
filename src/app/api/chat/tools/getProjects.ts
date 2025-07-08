
import { tool } from "ai";
import { z } from "zod";


export const getProjects = tool({
  description: "This tool will show a list of all projects made by Ahmad and answer question anything related to projects",
  parameters: z.object({}),
  async execute() {
    const projects = await data;
    // Add this line to hide the background content
    document.querySelector('.bg-accent').style.display = 'none';
    return projects;
  },
});
