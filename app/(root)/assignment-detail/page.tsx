import { GetHelpButton } from "@/components/modal/GetHelpButton";

const page = () => {
  return (
    <main className="mx-auto max-w-7xl md:p-10 px-4">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-3xl md:text-5xl text-gray-900">
          Let's Assist you
        </h1>
        <div className="flex gap-4 px-2">
          <GetHelpButton />
        </div>
      </div>
      <div className="pt-4 leading-6 max-w-4xl mx-auto">
        <h1 className="font-bold text-lg md:text-xl text-center pb-2">
          Struggling with Your School Assignments? We're Here to Help!
        </h1>
        <p className="pb-2 ">
          Are you facing challenges completing your school assignments or
          homework? Don't worry—our team is here to provide outstanding
          solutions tailored to your needs. Whether you're tackling basic school
          subjects or diving into more advanced tertiary topics, we've got you
          covered.
        </p>
        <p className="pb-2 ">
          Our expert assistance spans a wide range of subjects and topics,
          including English proficiency for all kinds of letter writing and
          essays. We can help with typing assistance, research work, nursing
          case studies, and much more. No assignment is too challenging for our
          dedicated team.
        </p>
        <h1 className='font-bold text-center'>Our Services Include:</h1>
        <div className="py-3">
          <ul className='list-disc ml-5'>
            <li className='pb-3'>
              <span className="font-bold ">English Writing:</span> Expert help with letters, essays, and more.
            </li>
            <li className='pb-3'><span className="font-bold ">Typing Support:</span> Ensure polished and professional work.</li>
            <li className='pb-3'>
              <span className="font-bold ">Research Work Assistance:</span> Comprehensive support for research
              assignments.
            </li>
            <li className='pb-3'>
              <span className="font-bold ">Nursing Care Study:</span> Specialized help for nursing students.
            </li>
            <li className='pb-3'>
              <span className="font-bold ">Mathematics Solutions:</span> Clear explanations and step-by-step
              guidance.
            </li>
            <li className='pb-3'>
              <span className="font-bold ">Online Exam Assistance:</span> Confidence-boosting support for select
              exams.
            </li>
            <li className='pb-3'>
              <span className="font-bold ">Science & Technology Aid:</span> Solutions for complex science and tech
              assignments.
            </li>
            <li className='pb-3'>
              <span className="font-bold ">Language Learning Support:</span> Assistance with foreign language
              assignments.
            </li>
            <li className='pb-3'>
              <span className="font-bold ">History & Social Studies Help:</span> In-depth support for historical and
              social studies projects.
            </li>
            <li className='pb-3'>
              <span className="font-bold ">Creative Arts Assistance:</span> Guidance for creative writing, arts, and
              design projects.
            </li>
            <li className='pb-3'><span className="font-bold ">etc.</span></li>
          </ul>
        </div>
        <h1 className="font-bold text-center pb-2">Need Help with Online Exams? We Can Assist!</h1>
        <p className="pb-2 ">
          In certain cases, we can also provide support for online exams,
          ensuring that you are well-prepared and confident.
        </p>
        <p className="pb-2 ">
          Don't let assignments stress you out—reach out to us for personalized
          support and guidance. Your academic success is our priority, and we
          are committed to helping you achieve your best.
        </p>
        <p className="pb-2 ">
          Contact us now, and let's work together to overcome any academic
          challenges you may be facing!. Just click the button at the top
          indicating <span className="font-bold text-blue-500 underline">Get help now</span> to submit your type of assignment
          work for assistance
        </p>
      </div>
    </main>
  );
};

export default page;
