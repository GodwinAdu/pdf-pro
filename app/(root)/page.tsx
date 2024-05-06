import Business from "@/components/business/Business";
import CTA from "@/components/common/CTA";
import Stats from "@/components/common/Stats";
import Hero from "@/components/hero/Hero";
import LeftSection from "@/components/sections/LeftSection";
import RightSection from "@/components/sections/RightSection";
import ChatSection from "@/components/sidebar/ChatSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <ChatSection />
      <RightSection />
      <LeftSection />
      <Business />
      <CTA />
    </>
  );
}
