import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Returns a summary of the internship I'm looking for, including my technical focus, skills, and how to get in touch. Use when the user asks about my internship, what I specialize in, or how to contact me.",
  parameters: z.object({}),
  execute: async () => {
    return `Here’s what I’m looking for 👇

- 📅 **Duration**: 6-month internship starting **September 2025**
- 🌍 **Location**: Preferably **Remote**, or onsite in **Lahore** or anywhere in **Pakistan**
- 🧠 **Focus Areas**: AI Automation, Shopify Development, Prompt Engineering, API Integration, Data Pipelines
- ⚙️ **Tech Highlights**:
  - Built automation pipelines using **n8n**, **Make.com**, and custom scripts
  - Integrated **AI agents** with **Vapi.ai**, **OpenAI**, and **Ollama**
  - Automated **Shopify** stores (inventory sync, order flows, analytics)
  - Used **Power BI**, **Google Sheets**, and **Excel** for real-time dashboards
  - Freelance experience on **Upwork**, delivering full solutions to clients

🛠️ Strong grasp of:
- API architecture, webhooks, and real-time sync across tools
- Building practical systems that automate manual work
- Connecting automation with voice, sheets, CRM, dashboards, and AI

📎 **See more skills** → *[Click to trigger “getSkills”]*  
📬 **Connect** → *[Click to trigger “getContact”]*

🚀 Let’s automate, analyze, and ship useful systems together.
    `;
  },
});
