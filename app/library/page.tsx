import BackgroundSection from '@/components/sections/BackgroundSection'

const page = () => {
  return (
    <div className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">

        <BackgroundSection 
        imageUrl="/assets/tertiary.png" 
        description="For Tertiary Candidate"
        buttonText="Open Library" 
        link={`/library/tertiary`}
      />
        <BackgroundSection 
        imageUrl="/assets/senior.png" 
        description="For Senior High Candidate"
        buttonText="Open Library"
        link={`/library/senior`} 
      />
        <BackgroundSection 
        imageUrl="/assets/junior.png" 
        description="For Junior High Candidate"
        buttonText="Open Library" 
        link={`/library/junior`}
      />
        <BackgroundSection 
        imageUrl="/assets/basic.png" 
        description="For Basic Students"
        buttonText="Open Library" 
        link={`/library/basic`}
      />
        </div>
      </div>
  )
}

export default page
