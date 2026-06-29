import CommunityPostForm from "@/features/community/CommunityPostForm";

export default function CommunityPostCreatePage() {
    return (
        <div className="flex h-full min-h-0 flex-row overflow-hidden bg-white/80 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            {/* <CommunitySideBar /> */}

            <section className="h-full min-h-0 min-w-0 flex-1 overflow-y-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <CommunityPostForm mode="CREATE" role="TEACHER" />
            </section>
        </div>
    );
}
