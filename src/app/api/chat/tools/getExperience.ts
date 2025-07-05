import { tool } from 'ai';
import { z } from 'zod';

export const getExperience = tool({
  description:
    "Returns a detailed and humorous timeline of my journey from Shopify assistant to certified automation and data specialist. This tool will answer the question like what about experience or journey or anything about my experience",
  parameters: z.object({}),
  execute: async () => {
    return `Here's my experience journey in a nutshell:

🛍️ In 2023, I started as a Shopify Assistant doing product research, managing listings, and occasionally breaking themes (and getting scolded by my brother for it).

📚 Then came my self-taught phase — I dove into cloud data analytics, learned Python, SQL, and even how to convince JSON to behave. Built dashboards that were both beautiful and actually worked.

🚀 In 2025, I officially launched into freelancing. My first client got a complete Ringba call tracking pipeline with automation and analytics. Since then, I’ve been working with APIs, automation tools, and real data pipelines.

📜 In 2024, I earned two fancy certificates — Google Cloud Data Analyst and Make.com Expert — which I now proudly flash as proof I know what I’m doing (most of the time).

Click below to see it beautifully illustrated!`;
  },
});
