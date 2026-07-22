import GuestGrowthStepsSection from "@/features/guest/components/GuestGrowthStepsSection";
import GuestHeroSection from "@/features/guest/components/GuestHeroSection";
import GuestNoticeCommunitySection from "@/features/guest/components/GuestNoticeCommunitySection";
import { getOnboardingLectures, getOnboardingUsers } from "../services/guest/service";

export default async function Home() {

  const [userData, lectureData] = await Promise.all([
    getOnboardingUsers(),
    getOnboardingLectures()
  ])
  const users = userData.data || 0;
  const { lectureCount, averageRating }
    = lectureData.data || {
      lectureCount: 0, averageRating: 0
    }

  return (
    <>
      <GuestHeroSection
        users={users}
        lectureCount={lectureCount}
        averageRating={averageRating}
      />
      <GuestGrowthStepsSection />
      <GuestNoticeCommunitySection />
    </>
  );
}