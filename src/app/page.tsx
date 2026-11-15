import { homeFaqs } from "@/content/faqs";
import { sixtySecondFootnote } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { Facts } from "@/components/home/Facts";
import { Testimonials } from "@/components/home/Testimonials";
import { CallDemo } from "@/components/home/CallDemo";
import { Flow } from "@/components/home/Flow";
import { OneTeam } from "@/components/home/OneTeam";
import { LiveDemo } from "@/components/home/LiveDemo";
import { PlansTeaser } from "@/components/home/PlansTeaser";
import { FaqSection } from "@/components/FaqList";
import { CtaBand } from "@/components/CtaBand";

/** Home page. Reorder or remove sections by moving these lines. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Facts />
      <Testimonials />
      <CallDemo />
      <Flow />
      <OneTeam />
      <LiveDemo />
      <PlansTeaser />
      <FaqSection
        items={homeFaqs}
        title={
          <>
            Your questions, <em className="accent">answered.</em>
          </>
        }
      />
      <CtaBand />
      <p className="px-4 pb-8 text-center text-[12px] text-muted">{sixtySecondFootnote}</p>
    </>
  );
}
