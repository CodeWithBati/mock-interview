import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import {
  getInterviewByUserId,
  latestInterviews,
} from "@/lib/actions/general.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterview] = await Promise.all([
    (await getInterviewByUserId(user?.id!)) || [],
    (await latestInterviews({ userId: user?.id! })) || [],
  ]);

  const hasPastInterviews = userInterviews?.length > 0;
  const upcomingInterview = latestInterview?.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready With AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real Interview questions and get instant Feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={500}
          height={500}
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch">
          {upcomingInterview ? (
            latestInterview.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no upcoming interviews</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
