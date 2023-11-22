import Link from "next/link";
import MaxWidthWrapper from "../common/MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { AssignmentModal } from "../modal/AssignmentModal";

const Hero = () => {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-20 flex flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
        <p className="text-sm font-semibold text-gray-700">
          SummaQ is now public!
        </p>
      </div>
      <h1 className="max-w-4xl text-3xl font-bold md:text-6xl lg:text-7xl">
        Start conversing with your{" "}
        <span className="text-blue-600">documents</span>.
      </h1>
      <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg leading-7">
        SummaQ enables you to engage in dialogues with any PDF file. Just upload
        your document, and you can begin posing questions immediately. SummaQ is
        an all-in-one app designed for effortless school assignments. It
        streamlines letter writing, aids in research tasks, and supports nursing
        care studies.
      </p>

      <AssignmentModal />
      
    </MaxWidthWrapper>
  );
};

export default Hero;
