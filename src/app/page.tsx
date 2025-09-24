"use client";

import {
  Blocks,
  Bot,
  Brain,
  CalendarDays,
  Code,
  Instagram,
  Mail,
  Palette,
  Shield,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import DepartmentCard from "@/components/DepartmentCard";
import { Button } from "@/components/ui/button";

interface Department {
  name: string;
  description: string;
  icon: React.ComponentType;
}

const departments: Department[] = [
  {
    name: "Events",
    description:
      "Organize talks, workshops, and networking opportunities for students.",
    icon: CalendarDays,
  },
  {
    name: "Marketing & Design",
    description:
      "Manages design, branding and promotion of our activities, as well as our social media presence.",
    icon: Palette,
  },
  {
    name: "Competitive Programming",
    description: "Train and prepare students for programming competitions.",
    icon: Code,
  },
  {
    name: "Cybersecurity",
    description:
      "Solve security challenges and promote cybersecurity awareness.",
    icon: Shield,
  },
  {
    name: "Blockchain & Web3",
    description:
      "Explores decentralized technologies, smart contracts and blockchain innovation.",
    icon: Blocks,
  },
  {
    name: "Artificial Intelligence",
    description: "Dedicated to AI, machine learning and data-driven projects.",
    icon: Brain,
  },
  {
    name: "Development",
    description:
      "Builds and maintains our website and other software projects.",
    icon: Wrench,
  },
  {
    name: "Robotics",
    description:
      "Designs, builds and programs robots for various competitions and projects.",
    icon: Bot,
  },
];

const isRecruiting = false;

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url(porto.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60" />

        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Logo */}
            <div className="h-32 sm:h-64 mx-auto flex items-center justify-center mb-8">
              <Image
                src="/acm_white_large_logo.png"
                alt="ACM Logo"
                width={400}
                height={128}
                className="hidden sm:block"
              />
              <Image
                src="/acm-square-white.png"
                alt="ACM Logo"
                width={128}
                height={128}
                className="block sm:hidden"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Welcome to ACM FEUP
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 text-pretty max-w-2xl mx-auto">
              The student organization for computing and technology at FEUP.
              Connect with like-minded students, develop your skills, and shape
              the future of tech.
            </p>

            <div className="pt-8">
              <Button
                size={"lg"}
                className="bg-background hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <a
                  href="https://www.instagram.com/acmfeup/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isRecruiting
                    ? "Join Us"
                    : "Recruitment Closed - Stay Tuned!"}
                </a>
              </Button>

              <p className="text-white/80 text-sm mt-4 max-w-md mx-auto">
                Follow us on{" "}
                <a
                  href="https://www.instagram.com/acmfeup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white transition-colors"
                >
                  Instagram
                </a>{" "}
                for recruitment announcements and updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Departments
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl  mx-auto text-pretty">
              Explore our diverse departments and find your passion in
              technology. Each department offers unique opportunities to learn,
              collaborate, and innovate.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {departments.map((dept) => {
              return (
                <div
                  key={dept.name}
                  className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]"
                >
                  <DepartmentCard department={dept} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Image
                src="/acm_logo.png"
                alt="ACM Logo"
                width={32}
                height={32}
              />
              <span className="text-2xl font-bold">ACM FEUP</span>
            </div>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              Association for Computing Machinery at Faculdade de Engenharia da
              Universidade do Porto
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="mailto:geral@acmfeup.eu"
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                  <Mail size={20} />

                  <span>geral@acmfeup.eu</span>
                </a>
                <a
                  href="https://www.instagram.com/acmfeup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                  <span>@acmfeup</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/60">
                &copy; {new Date().getFullYear()} ACM FEUP. All rights reserved.
              </p>
              <a className="text-primary max-w-md mx-auto" href="/meta.jpg">
                flag
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
