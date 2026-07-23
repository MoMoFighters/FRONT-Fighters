import CommunityPageHeader from "@/components/phone/community/CommunityPageHeader";
import CommunitySideBar from "@/components/phone/community/CommunitySideBar";
import CommunityPostForm from "@/features/community/CommunityPostForm";

export default function CommunityPostCreatePage() {
    return (
        <div className="flex min-h-[calc(100vh-137px)] flex-col bg-white">
            <div className="mx-auto flex w-full max-w-360 flex-col px-4 py-8 md:px-12 md:py-12">
                <CommunityPageHeader role="TEACHER" />

                <div className="shrink-0">
                    <CommunitySideBar role="TEACHER" />
                </div>

                <section className="min-w-0">
                    <CommunityPostForm mode="CREATE" role="TEACHER" />
                </section>
            </div>
        </div>
    );
}
