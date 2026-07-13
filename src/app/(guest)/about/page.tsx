import AboutFaqSection from "@/features/guest/components/about/AboutFaqSection";
import AboutHero from "@/features/guest/components/about/AboutHero";
import AboutTabs from "@/features/guest/components/about/AboutTabs";
import { AboutTab } from "@/features/guest/about/type";

interface AboutPageProps {
    searchParams: Promise<{
        tab?: string;
    }>;
}

const isAboutTab = (value?: string): value is AboutTab =>
    value === "student" || value === "teacher" || value === "all";

export default async function About({ searchParams }: AboutPageProps) {
    const { tab } = await searchParams;
    const currentTab: AboutTab = isAboutTab(tab) ? tab : "all";

    return (
        <>
            <AboutHero />
            <AboutTabs currentTab={currentTab} />
            <AboutFaqSection tab={currentTab} />
        </>
    );
}