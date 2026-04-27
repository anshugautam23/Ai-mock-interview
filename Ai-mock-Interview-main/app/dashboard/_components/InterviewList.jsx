"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryIcon } from "lucide-react";

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState(null);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));
    setInterviewList(result);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-8 w-1 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full" />
        <div>
          <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-violet-500" />
            Previous Interviews
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {interviewList ? `${interviewList.length} session${interviewList.length !== 1 ? "s" : ""}` : "Loading..."}
          </p>
        </div>
      </div>

      {interviewList === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3">
              <Skeleton className="h-4 w-2/3 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-3 w-1/3 rounded-lg" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : interviewList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950 rounded-2xl flex items-center justify-center mb-4">
            <HistoryIcon className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No interviews yet</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">Start your first mock interview above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={interview.mockId} interview={interview} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
