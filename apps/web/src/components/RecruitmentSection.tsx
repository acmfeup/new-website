"use client";

import { useState } from "react";
import Countdown from "@/components/Countdown";
import { Button } from "@/components/ui/button";

export default function RecruitmentSection({
  isRecruiting,
  recruitmentDeadline,
}: {
  isRecruiting: boolean;
  recruitmentDeadline: Date;
}) {
  const [deadlinePassed, setDeadlinePassed] = useState(
    new Date() > recruitmentDeadline,
  );
  const applicationsOpen = isRecruiting && !deadlinePassed;

  return (
    <div className="pt-8">
      {applicationsOpen && (
        <div className="mb-8">
          <Countdown
            target={recruitmentDeadline}
            onEnd={() => setDeadlinePassed(true)}
          />
        </div>
      )}
      <Button
        size={"lg"}
        className="bg-background hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        asChild
      >
        {applicationsOpen ? (
          <a
            href="https://forms.gle/FXjf82jfQjgCom789"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Us
          </a>
        ) : (
          <p>Recruitment Closed - Stay Tuned!</p>
        )}
      </Button>

      {!applicationsOpen && (
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
      )}
    </div>
  );
}
