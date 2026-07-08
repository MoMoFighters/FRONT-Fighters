import GuestGrowthStepsSection from "@/features/guest/components/GuestGrowthStepsSection";
import GuestHeroSection from "@/features/guest/components/GuestHeroSection";
import GuestNoticeCommunitySection from "@/features/guest/components/GuestNoticeCommunitySection";

export default async function Home() {
  return (
    <>
      <GuestHeroSection />
      <GuestGrowthStepsSection />
      <GuestNoticeCommunitySection />
    </>
  );
}
