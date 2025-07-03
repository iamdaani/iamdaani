import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Summarizes the 6‑month internship I'm seeking: focus areas, core skills (cloud, data engineering, automation, AI, Shopify), and how to connect.",
  parameters: z.object({}),
  execute: async () => {
    return `🚀 **6‑Month Internship** (Sept ’25 start)

🔍 **Focus Areas**
- Cloud Architecture & Serverless (AWS Lambda, S3, EventBridge)
- Data Engineering & ETL (Glue, Airflow, BigQuery, Snowflake)
- Workflow Automation & Orchestration (n8n, Make.com)
- AI/ML Integration & Prompt Engineering (OpenAI, Vapi.ai, Ollama)
- Shopify Development & Apps (Liquid, GraphQL, Webhooks)

💡 **Core Strengths**
- Building end‑to‑end data pipelines and real‑time dashboards
- Automating complex workflows: voice calls → CRM → BI
- Integrating LLMs into production systems
- Designing scalable, secure microservices and no‑code solutions

📈 **Results & Experience**
- Automated call‑tracking + SMS flows for clients (Ringba + Vapi.ai)
- Deployed BI dashboards with drill‑through KPIs using Power BI & Sheets
- Delivered custom Shopify automations (inventory sync, order routing)
- Freelance on Upwork: 5★ client feedback for rapid deliverables

📎 **Want to know more about my skills?**  
*(triggers “Want to know more about my Skills”)*

📬 **Want to know about my contact information?**  
*(triggers “Want to know about my contact information”)*
`;
  },
});
