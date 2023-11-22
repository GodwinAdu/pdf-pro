import MaxWidthWrapper from "../common/MaxWidthWrapper";

const RightSection = () => (
  <MaxWidthWrapper>
    <section
      id="product"
      className="flex md:flex-row flex-col-reverse sm:py-16 py-6"
    >
      <div className="flex-1 flex justify-center items-center md:mr-10 mr-0 md:mt-0 mt-10 relative">
        <img
          src="/assets/left.png"
          alt="billing"
          className="w-[100%] h-[100%] relative z-[5] rounded-3xl"
        />

        {/* gradient start */}
        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
        {/* gradient end */}
      </div>

      <div className="flex-1 flex justify-center items-start flex-col">
        <h2 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full">
          Easily interaction with <br className="sm:block hidden" /> Our Application
        </h2>
        <p
          className={`font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-[470px] mt-5`}
        >
          SummaQ offers a collaborative PDF interaction platform with real-time
          editing, integrated citation generation, AI-based writing suggestions,
          and language translation support. Users can personalize profiles,
          track progress, and benefit from in-app learning challenges. The
          application also features offline mode, community forums, and
          responsive customer support, making it a versatile and user-friendly
          tool for students' diverse academic needs.
        </p>

        <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
          <img
            src="/assets/apple.svg"
            alt="google_play"
            className="w-[128.86px] h-[42.05px] object-contain mr-5 cursor-pointer"
          />
          <img
            src="/assets/google.svg"
            alt="google_play"
            className="w-[144.17px] h-[43.08px] object-contain cursor-pointer"
          />
        </div>
      </div>
    </section>
  </MaxWidthWrapper>
);

export default RightSection;
