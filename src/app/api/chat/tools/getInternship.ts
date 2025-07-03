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
### 🔧 Core Focus
- **Cloud & Serverless:** AWS Lambda, S3, EventBridge  
- **Data Engineering:** ETL with Glue & Airflow, BigQuery, Snowflake  
- **Automation & Orchestration:** n8n, Make.com, Zapier  
- **AI/ML Integration:** OpenAI, Vapi.ai, Ollama, RAG & Prompt Engineering  
- **Shopify Development:** Liquid, GraphQL, Webhooks, Custom Apps  

### 📈 Key Strengths
- Building **end‑to‑end data pipelines** and **real‑time dashboards**  
- Automating **voice → CRM → BI** workflows with AI agents  
- Deploying **secure, scalable microservices** (Docker, CI/CD)  
- Driving **Shopify store automations** (inventory sync, order routing)  

### ⭐️ Proven Results
- **Call‑tracking + SMS bots** (Ringba + Vapi.ai)  
- **Interactive BI Dashboards** (Power BI + Google Sheets + Excel)  
- **Upwork 5★ Freelance Projects** delivering rapid, high‑quality solutions  

---

> **Want to know more about my skills?**  
*(sends “Want to know more about my Skills” to the chat)*

> **Want to know about my contact information?**  
*(sends “Want to know about my contact information” to the chat)*
`;
  },
});