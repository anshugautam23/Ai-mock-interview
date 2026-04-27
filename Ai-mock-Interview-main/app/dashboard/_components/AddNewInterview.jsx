// "use client";
// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { chatSession } from "@/utils/GeminiAIModal";
// import { LoaderCircle, Plus, Sparkles, BriefcaseIcon, FileTextIcon, StarIcon } from "lucide-react";
// import { db } from "@/utils/db";
// import { MockInterview } from "@/utils/schema";
// import { v4 as uuidv4 } from "uuid";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";
// import { useRouter } from "next/navigation";

// const AddNewInterview = () => {
//   const [openDailog, setOpenDialog] = useState(false);
//   const [jobPosition, setJobPosition] = useState();
//   const [jobDesc, setJobDesc] = useState();
//   const [jobExperience, setJobExperience] = useState();
//   const [loading, setLoading] = useState(false);
//   const [jsonResponse, setJsonResponse] = useState([]);
//   const { user } = useUser();
//   const router = useRouter();

//   const onSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();

//     const InputPrompt = `
//   Job Positions: ${jobPosition},
//   Job Description: ${jobDesc},
//   Years of Experience: ${jobExperience}.
//   Based on this information, please provide 5 interview questions with answers in JSON format, ensuring "Question" and "Answer" are fields in the JSON.
// `;

//     const result = await chatSession.sendMessage(InputPrompt);
//     const rawText = result.response.text();
//     const jsonMatch = rawText.match(/\[[\s\S]*\]/);
//     const MockJsonResp = jsonMatch ? jsonMatch[0].trim() : null;
//     if (!MockJsonResp) throw new Error("No JSON found in AI response");
//     setJsonResponse(MockJsonResp);

//     if (MockJsonResp) {
//       const resp = await db
//         .insert(MockInterview)
//         .values({
//           mockId: uuidv4(),
//           jsonMockResp: MockJsonResp,
//           jobPosition: jobPosition,
//           jobDesc: jobDesc,
//           jobExperience: jobExperience,
//           createdBy: user?.primaryEmailAddress?.emailAddress,
//           createdAt: moment().format("YYYY-MM-DD"),
//         })
//         .returning({ mockId: MockInterview.mockId });

//       if (resp) {
//         setOpenDialog(false);
//         router.push("/dashboard/interview/" + resp[0]?.mockId);
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       {/* Add New Card */}
//       <div
//         onClick={() => setOpenDialog(true)}
//         className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 p-8 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-indigo-950"
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
//         <div className="flex flex-col items-center gap-4 text-center">
//           <div className="relative">
//             <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
//             <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//               <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
//             </div>
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
//               New Interview
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI-powered questions for your role</p>
//           </div>
//           <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <Sparkles className="w-3.5 h-3.5" />
//             Powered by Gemini AI
//           </div>
//         </div>
//       </div>

//       {/* Dialog */}
//       <Dialog open={openDailog}>
//         <DialogContent className="max-w-lg rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
//           {/* Dialog Header with gradient */}
//           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-6 pt-6 pb-8">
//             <DialogHeader>
//               <div className="flex items-center gap-2 mb-1">
//                 <Sparkles className="w-5 h-5 text-indigo-200" />
//                 <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">AI Mock Interview</span>
//               </div>
//               <DialogTitle className="text-white text-2xl font-bold">
//                 Set up your interview
//               </DialogTitle>
//               <DialogDescription className="text-indigo-200 mt-1">
//                 Tell us about the role and we'll generate personalized questions.
//               </DialogDescription>
//             </DialogHeader>
//           </div>

//           {/* Form */}
//           <form onSubmit={onSubmit} className="px-6 py-6">
//             <div className="space-y-5">
//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
//                   <BriefcaseIcon className="w-4 h-4 text-indigo-500" />
//                   Job Role / Position
//                 </label>
//                 <Input
//                   placeholder="e.g. Full Stack Developer"
//                   required
//                   className="rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-800"
//                   onChange={(e) => setJobPosition(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
//                   <FileTextIcon className="w-4 h-4 text-indigo-500" />
//                   Tech Stack / Job Description
//                 </label>
//                 <Textarea
//                   placeholder="e.g. React, Node.js, PostgreSQL, REST APIs"
//                   required
//                   rows={3}
//                   className="rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-800 resize-none"
//                   onChange={(e) => setJobDesc(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
//                   <StarIcon className="w-4 h-4 text-indigo-500" />
//                   Years of Experience
//                 </label>
//                 <Input
//                   placeholder="e.g. 3"
//                   max="50"
//                   type="number"
//                   required
//                   className="rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-800"
//                   onChange={(e) => setJobExperience(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 mt-7">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpenDialog(false)}
//                 className="flex-1 rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900 border-0 font-semibold"
//               >
//                 {loading ? (
//                   <span className="flex items-center gap-2">
//                     <LoaderCircle className="w-4 h-4 animate-spin" />
//                     Generating...
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     <Sparkles className="w-4 h-4" />
//                     Start Interview
//                   </span>
//                 )}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AddNewInterview;
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle, Plus, Sparkles, BriefcaseIcon, FileTextIcon, StarIcon } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // Retry helper with exponential backoff for Gemini 503 errors
  const generateWithRetry = async (prompt, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await chatSession.sendMessage(prompt);
        return result;
      } catch (error) {
        const errorMsg = error?.message || "";
        
        const isHighDemand = errorMsg.includes("503") || 
                            errorMsg.includes("high demand") ||
                            errorMsg.includes("overloaded");

        if (!isHighDemand || attempt === maxRetries) {
          throw error; // Re-throw if not retryable or last attempt
        }

        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Gemini busy (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!jobPosition || !jobDesc || !jobExperience) return;

    setLoading(true);

    try {
      const InputPrompt = `
Job Position: ${jobPosition}
Job Description: ${jobDesc}
Years of Experience: ${jobExperience}

Based on this information, generate exactly 5 interview questions with detailed answers.
Return ONLY a valid JSON array in this format:
[
  {
    "Question": "Question text here",
    "Answer": "Detailed answer here"
  }
]
Do not include any other text or explanation.
`;

      // Use retry logic
      const result = await generateWithRetry(InputPrompt);
      
      const rawText = result.response.text();
      
      // Improved JSON extraction
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      const MockJsonResp = jsonMatch ? jsonMatch[0].trim() : null;

      if (!MockJsonResp) {
        throw new Error("Failed to extract valid JSON from AI response");
      }

      // Save to database
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (resp && resp[0]?.mockId) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0].mockId}`);
      } else {
        throw new Error("Failed to save interview");
      }

    } catch (error) {
      console.error("Interview generation error:", error);

      const errorMsg = error?.message || "";
      
      if (errorMsg.includes("503") || errorMsg.includes("high demand")) {
        alert("Gemini AI is currently experiencing high demand.\n\nPlease wait 10-20 seconds and try again.");
      } else {
        alert("Failed to generate interview questions. Please check your inputs and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add New Card - unchanged */}
      <div
        onClick={() => setOpenDialog(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 p-8 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-indigo-950"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              New Interview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI-powered questions for your role</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Gemini AI
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-6 pt-6 pb-8">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">AI Mock Interview</span>
              </div>
              <DialogTitle className="text-white text-2xl font-bold">
                Set up your interview
              </DialogTitle>
              <DialogDescription className="text-indigo-200 mt-1">
                Tell us about the role and we'll generate personalized questions.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={onSubmit} className="px-6 py-6">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <BriefcaseIcon className="w-4 h-4 text-indigo-500" />
                  Job Role / Position
                </label>
                <Input
                  placeholder="e.g. Full Stack Developer"
                  required
                  className="rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-800"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <FileTextIcon className="w-4 h-4 text-indigo-500" />
                  Tech Stack / Job Description
                </label>
                <Textarea
                  placeholder="e.g. React, Node.js, PostgreSQL, REST APIs"
                  required
                  rows={3}
                  className="rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-800 resize-none"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <StarIcon className="w-4 h-4 text-indigo-500" />
                  Years of Experience
                </label>
                <Input
                  placeholder="e.g. 3"
                  max="50"
                  type="number"
                  required
                  className="rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-800"
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="flex-1 rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900 border-0 font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Start Interview
                  </span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;