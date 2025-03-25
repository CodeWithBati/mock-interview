import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-4 max-w-lg">
          <h2>Get Interview-Ready With AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real Interview questions and get instant Feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default page;
