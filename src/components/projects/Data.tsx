import Image from 'next/image';
import { Image as Img } from 'lucide-react';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { url } from 'inspector';

// Enhanced project content array with all projects
const PROJECT_CONTENT = [
  {
    title: 'Ringba Call Tracking & Dashboard System',
        description:
          'An end-to-end pipeline that automates Ringba call data ingestion and reporting. From API data fetch to AWS Lambda, Glue transformation, RDS storage, and Power BI dashboard creation—this project automates everything. Designed for a client to monitor marketing calls, trends, and campaign performance.',
        techStack: [
          'AWS Lambda',
          'AWS EventBridge',
          'AWS S3',
          'AWS Glue (PySpark)',
          'PostgreSQL (RDS)',
          'Power BI',
          'Python',
          'Ringba API'
        ],
        date: '2025',
        links: [
          {
            name: 'Blog Post',
            url: 'https://ahamdjin.github.io/Ahmad-YAR/blog/Project-Ringba/',
          }
        ],
        images: [
          {
            src: '/ringba-architecture-diagram.png',
            alt: 'High-Level Architecture Diagram of the Ringba Data Pipeline',
          },
          {
            src: '/lambda-fetch-s3-code.png',
            alt: 'Lambda Function Code to Fetch Ringba Data and Upload to S3',
          },
          {
            src: '/glue-job-script.png',
            alt: 'AWS Glue Job Script Showing PySpark Transformations',
          },
          {
            src: '/cloudwatch-glue-logs.png',
            alt: 'CloudWatch Logs Showing Success and Row Counts',
          },
          {
            src: '/powerbi-call-dashboard .png',
            alt: 'Power BI Dashboard Showing Ringba Call Metrics',
          },
          {
            src: '/powerbi-query-editor.png',
            alt: 'Power BI Query Editor Connecting to PostgreSQL via ODBC',
          },
        ],
    },
  {
        title: 'Unlocking Lending Insights',
        description:
          'A two-phase data analytics project for TheLook Fintech that analyzes loan activity and delivers a Looker dashboard for decision-making. The report reveals trends from 2012–2019 and visualizes key loan health metrics including outstanding balance, borrower location, and income index.',
        techStack: [
          'looker Studio',
          'Excel/CSV',
          'Data Analyst',
          'Data Modeling',
          'SQL',
          'Data Visualization'
        ],
        date: '2025',
        links: [
          {
            name: 'Case Study',
            url: 'https://ahamdjin.github.io/Ahmad-YAR/blog/Lending-Insights/',
          }
        ],
        images: [
          {
            src: '/loan-count-by-year.png',
            alt: 'Line chart showing Loan Count by Year from 2012 to 2019',
          },
          {
            src: '/interactive-dashboard.png',
            alt: 'Power BI Dashboard with key loan metrics and borrower segmentation',
          }
        ],
      },
    {  
       title: 'Voice-Based Table Booking for Restaurang Göteborg',
        description:
          'Developed for a real client, this project combines Voiceflow, Twilio, and n8n to let customers book restaurant tables via voice call. When a user dials the Twilio number, they interact with a Voiceflow assistant that gathers booking details. These details are forwarded to n8n, which adds the reservation to Google Calendar and sends an SMS confirmation. The workflow includes full error handling and logging.',
        techStack: [
          'n8n',
          'Twilio Voice',
          'Google Calendar API',
          'Voiceflow',
          'Node.js (for custom webhook handling)',
          'Twilio SMS',
        ],
        date: '2025',
        links: [
          {
            name: 'Workflow Screenshots',
            url: '/restaurang-goteborg-n8n.png',
          },
        ],
        images: [
          {
            src: '/restaurang-goteborg-voiceflow.png',
            alt: 'Voiceflow assistant handling table booking call',
          },
          {
            src: '/restaurang-goteborg-n8n.png',
            alt: 'n8n automation flow integrating Twilio, Google Calendar, and SMS',
          },
          {
            src: '/restaurang-goteborg-sms-confirmation.png',
            alt: 'SMS confirmation sent to customer after voice booking',
          },
        ],
      },
];

// Define interface for project prop
interface ProjectProps {
  title: string;
  description?: string;
  techStack?: string[];
  date?: string;
  links?: { name: string; url: string }[];
  images?: { src: string; alt: string }[];
}

const ProjectContent = ({ project }: { project: ProjectProps }) => {
  // Find the matching project data
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header section with description */}
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="font-sans text-base leading-relaxed md:text-lg text-gray-800 dark:text-gray-200">
            {projectData.description}
          </p>

          {/* Tech stack */}
          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
                <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                <span className="font-light capitalize">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main data export with updated content
export const data = [
  {
    category: 'Data Engineering',
    title: 'Ringba Call Tracking Automation',
    src: '/Ringba-Preview.png',
    content: <ProjectContent project={{ title: 'Ringba Call Tracking & Dashboard System' }} />,
  },
  {
    category: 'Data Analytics',
    title: 'Metric Mindset',
    src: '/Unlocking-Lending-Insights-preview.png',
    content: <ProjectContent project={{ title: 'Unlocking Lending Insights' }} />,
  },
  {
    category: 'AI Voice Automation',
    title: 'AI Agent',
    src: '/restaurang-goteborg-preview.png',
    content: <ProjectContent project={{ title: 'Voice-Based Table Booking for Restaurang Göteborg' }} />,
  },
];
