import { ABOUT_FAQ_ITEMS } from "@/features/guest/about/faqData";
import { AboutTab, FaqAudience } from "@/features/guest/about/type";
import AboutFaqCard from "./AboutFaqCard";

interface AboutFaqSectionProps {
    tab: AboutTab;
}

const AUDIENCE_LABEL: Record<FaqAudience, string> = {
    COMMON: "공통",
    STUDENT: "수강생",
    TEACHER: "강사",
};

const getVisibleAudiences = (tab: AboutTab): FaqAudience[] => {
    if (tab === "student") {
        return ["STUDENT"];
    }

    if (tab === "teacher") {
        return ["TEACHER"];
    }

    return ["COMMON"];
};

export default function AboutFaqSection({ tab }: AboutFaqSectionProps) {
    const groups = getVisibleAudiences(tab)
        .map((audience) => ({
            audience,
            items: ABOUT_FAQ_ITEMS.filter((item) => item.audience === audience),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <section className="bg-white py-10 sm:py-12">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-0">
                <div className="space-y-10">
                    {groups.map((group) => (
                        <div key={group.audience}>
                            <h2 className="mb-4 text-lg font-bold text-slate-950">
                                {AUDIENCE_LABEL[group.audience]} 질문
                            </h2>

                            <div className="space-y-3">
                                {group.items.map((item) => (
                                    <AboutFaqCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
