import Button from "../Button";
import MaxWidthWrapper from "../common/MaxWidthWrapper";

const LeftSection = () => (
  <MaxWidthWrapper>
    <section className="flex md:flex-row flex-col sm:py-16 py-6">
      <div className="flex-1 flex justify-center items-start flex-col">
        <h2 className="font-poppins font-semibold xs:text-[38px] text-[30px] text-black xs:leading-[66.8px] leading-[56.8px] w-full">
          Understand the full scope of our 
          capabilities to support you.
        </h2>
        <p
          className={`font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-[470px] mt-5`}
        >
          SummaQ is an inclusive PDF interaction application for everyone. It
          allows users to summarize uploaded PDFs, answer questions from them,
          and offers professional assistance for school presentations, letter
          writing, home work/assignments, essay paraphrasing, research work,
          nursing care studies, and more...
        </p>

        <Button styles={`mt-10`} />
      </div>

      <div className="flex-1 flex justify-center items-center md:mr-10 mr-0 md:mt-0 mt-10 relative">
        <img
          src="/assets/right.png"
          alt="billing"
          className="w-[100%] h-[100%] relative z-[5] rounded-3xl"
        />

        {/* gradient start */}
        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
        {/* gradient end */}
      </div>
    </section>
  </MaxWidthWrapper>
);

export default LeftSection;
