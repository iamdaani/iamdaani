'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, Cpu, PenTool, Users } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function Skills() {
  const skillsData = [
    {
      category: 'Data Engineering & Cloud Platforms',
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        'AWS (Lambda, S3, RDS, Glue, EventBridge)',
        'Google Cloud Platform (BigQuery)',
        'Microsoft Azure',
        'Amazon Redshift',
        'Snowflake',
      ],
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      category: 'Programming & Scripting',
      icon: <Code className="h-5 w-5" />,
      skills: ['Python', 'SQL', 'Shell Scripting', 'JavaScript'],
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    {
      category: 'ETL & Workflow Orchestration',
      icon: <PenTool className="h-5 w-5" />,
      skills: ['AWS Glue', 'Apache Airflow', 'n8n', 'Make.com', 'Zapier'],
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    },
    {
      category: 'Databases',
      icon: <Code className="h-5 w-5" />,
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'AWS RDS', 'BigQuery'],
      color: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
    {
      category: 'Data Analysis & Processing',
      icon: <Users className="h-5 w-5" />,
      skills: ['Apache Spark', 'Pandas', 'NumPy', 'Jupyter Notebook', 'Microsoft Excel'],
      color: 'bg-red-50 text-red-600 border border-red-200',
    },
    {
      category: 'Data Visualization & BI Tools',
      icon: <PenTool className="h-5 w-5" />,
      skills: ['Power BI', 'Tableau', 'Google Data Studio'],
      color: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    },
    {
      category: 'Version Control & DevOps',
      icon: <Cpu className="h-5 w-5" />,
      skills: ['Git', 'GitHub', 'Docker'],
      color: 'bg-purple-50 text-purple-600 border border-purple-200',
    },
    {
      category: 'Design & Presentation',
      icon: <PenTool className="h-5 w-5" />,
      skills: ['Canva', 'Figma'],
      color: 'bg-pink-50 text-pink-600 border border-pink-200',
    },
    {
      category: 'AI & Machine Learning',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'Building intelligent, scalable automation flows',
        'API-driven data infrastructure',
      ],
      color: 'bg-green-50 text-green-600 border border-green-200',
    },
    {
      category: 'Expert in n8n Automation',
      icon: <Users className="h-5 w-5" />,
      skills: [
        'Complex automations (nodes, logic, loops, error handling)',
        'Workflows: APIs, webhooks, CRON triggers, databases',
        'Reporting, alerting, lead tracking, syncing',
      ],
      color: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    {
      category: 'Proficient in Make.com (Integromat)',
      icon: <Users className="h-5 w-5" />,
      skills: [
        'Multi-step scenarios (modules, filters, routers, iterators)',
        'Connecting business apps, no-code deployments',
        'Auth tokens, rate limits, scalable data routing',
      ],
      color: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    },
    {
      category: 'API Integration & Workflow Architecture',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'RESTful APIs (OAuth2, headers, JSON payloads)',
        'External triggers (Ringba, Twilio, webhooks)',
        'Daily data pipelines: fetch, transform, store',
      ],
      color: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    },
    {
      category: 'Voice & AI Automation',
      icon: <Users className="h-5 w-5" />,
      skills: [
        'Integrating AI with phone data (Ringba + Vapi.ai + AWS)',
        'Inbound call pipelines, real-time ingestion',
        'Power BI integration for live reporting',
      ],
      color: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="shadow-none border-none pb-12 px-0">
        <CardHeader className="pb-1 px-0">
          <CardTitle className="text-primary text-4xl font-bold px-0">
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {skillsData.map((section, i) => (
              <motion.div key={i} variants={itemVariants} className="space-y-3">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                    >
                      <Badge className={`border px-3 py-1.5 font-normal`}>
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
