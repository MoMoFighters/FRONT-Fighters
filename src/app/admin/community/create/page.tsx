import CommunitySideBar from "@/components/phone/community/CommunitySideBar";
import CommunityPostForm from "@/features/community/CommunityPostForm";

export default function CommunityPostCreatePage() {
    return (
        <div className="flex min-h-full flex-col bg-white/80 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <div className="shrink-0 px-3 pt-3">
                <CommunitySideBar role="ADMIN" />
            </div>

            <section className="min-w-0 flex-1 px-3 py-2">
                <CommunityPostForm mode="CREATE" role="ADMIN" />
            </section>
        </div>
    );
}
