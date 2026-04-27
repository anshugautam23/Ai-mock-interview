"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BriefcaseIcon, CalendarIcon, ClockIcon, PlayCircleIcon, BarChart2Icon } from "lucide-react";

const GRADIENT_PAIRS = [
  "from-indigo-500 to-violet-600",
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

const InterviewItemCard = ({ interview, index = 0 }) => {
  const router = useRouter();
  const gradient = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-950/50 transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <BriefcaseIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {interview?.jobPosition}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {interview?.jobExperience} yrs experience
              </span>
            </div>
          </div>
        </div>

        {/* Date badge */}
        <div className="flex items-center gap-1.5 mb-5">
          <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {interview?.createdAt}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/dashboard/interview/" + interview?.mockId + "/feedback")}
            size="sm"
            variant="outline"
            className="flex-1 rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-700 dark:hover:text-indigo-400 transition-all text-xs font-medium h-9"
          >
            <BarChart2Icon className="w-3.5 h-3.5 mr-1.5" />
            Feedback
          </Button>
          <Button
            onClick={() => router.push("/dashboard/interview/" + interview?.mockId)}
            size="sm"
            className={`flex-1 rounded-xl bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 shadow-md text-xs font-semibold h-9 transition-all`}
          >
            <PlayCircleIcon className="w-3.5 h-3.5 mr-1.5" />
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewItemCard;
