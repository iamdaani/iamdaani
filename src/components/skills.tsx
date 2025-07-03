"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Code,
  Cpu,
  Database,
  Network,
  Sliders,
  BarChart,
  Presentation,
  Bot,
  Share2,
  Mic,
  Users,
  Settings2,
  Zap,
  Cloud,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const Skills = () => {
  const skillsData = [
    {
      category: "Data Engineering & Cloud Platforms",
      icon: <Cloud className="h-5 w-5" />, // fallback
      skills: [
        "AWS (Lambda, S3, RDS, Glue, EventBridge)",
        "Google Cloud Platform (BigQuery)",
        "Microsoft Azure",
        "Amazon Redshift",
        "Snowflake",
      ],
      color: "bg-blue-50 text-blue-600 border border-blue-200",
    },
    {
      category: "Programming & Scripting",
      icon: <Code className="h-5 w-5" />,
      skills: ["Python", "SQL", "Shell Scripting", "JavaScript"],
      color: "bg-green-50 text-green-600 border border-green-200",
    },
    {
      category: "ETL & Workflow Orchestration",
      icon: <Sliders className="h-5 w-5" />,
      skills: ["AWS Glue", "Apache Airflow", "n8n", "Make.com", "Zapier"],
      color: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    },
    {
      category: "Databases",
      icon: <Database className="h-5 w-5" />,
      skills: ["PostgreSQL", "MySQL", "MongoDB", "AWS RDS", "BigQuery"],
      color: "bg-red-50 text-red-600 border border-red-200",
    },
    {
      category: "Data Analysis & Processing",
      icon: <BarChart className="h-5 w-5" />,
      skills: ["Apache Spark", "Pandas", "NumPy", "Jupyter Notebook", "Excel"],
      color: "bg-purple-50 text-purple-600 border border-purple-200",
    },
    {
      category: "Data Visualization & BI Tools",
      icon: <Presentation className="h-5 w-5" />,
      skills: ["Power BI", "Tableau", "Google Data Studio"],
      color: "bg-indigo-50 text-indigo-600 border border-indigo-200",
    },
    {
      category: "Version Control & DevOps",
      icon: <Settings2 className="h-5 w-5" />,
      skills: ["Git", "GitHub", "Docker"],
      color: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    {
      category: "Design & Presentation",
      icon: <Presentation className="h-5 w-5" />,
      skills: ["Canva", "Figma"],
      color: "bg-pink-50 text-pink-600 border border-pink-200",
    },
    {
      category: "AI & Machine Learning",
      icon: <Bot className="h-5 w-5" />,
      skills: [
        "Scalable automation flows",
        "API-driven data infrastructure",
      ],
      color: "bg-sky-50 text-sky-600 border border-sky-200",
    },
    {
      category: "Expert in n8n Automation",
      icon: <Zap className="h-5 w-5" />,
      skills: [
        "Complex workflows",
        "APIs, webhooks, CRON, DB triggers",
        "Reporting, alerts, syncing",
      ],
      color: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    {
      category: "Proficient in Make.com",
      icon: <Network className="h-5 w-5" />,
      skills: [
        "Modules, filters, routers, iterators",
        "No-code automation",
        "Scalable routing, rate limits",
      ],
      color: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    },
    {
      category: "API Integration & Architecture",
      icon: <Share2 className="h-5 w-5" />,
      skills: [
        "OAuth2, Headers, JSON",
        "External triggers",
        "Fetch, transform, store pipelines",
      ],
      color: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    },
    {
      category: "Voice & AI Automation",
      icon: <Mic className="h-5 w-5" />,
      skills: [
        "Call pipelines",
        "Real-time ingestion",
        "Power BI integration",
      ],
      color: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    },
    {
      category: "Soft Skills",
      icon: <Users className="h-5 w-5" />,
      skills: [
        "Communication",
        "Problem-Solving",
        "Adaptability",
        "Learning Agility",
        "Teamwork",
        "Creativity",
        "Focus",
      ],
      color: "bg-gray-100 text-gray-700 border border-gray-200",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-6xl rounded-4xl px-4"
    >
      <Card className="shadow-none border-none pb-12">
        <CardHeader className="pb-1">
          <CardTitle className="text-primary text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <Badge className={`border px-3 py-1.5 font-normal ${section.color}`}>
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
};

export default Skills;
