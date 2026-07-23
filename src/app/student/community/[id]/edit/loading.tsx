import CommunityFormSkeleton from "@/components/phone/community/skeletons/CommunityFormSkeleton";

export default function Loading() {
    return (
        <div className="flex min-h-[calc(100vh-137px)] flex-col bg-white">
            <div className="mx-auto flex w-full max-w-360 flex-col px-4 py-8 md:px-12 md:py-12">
                <CommunityFormSkeleton />
            </div>
        </div>
    );
}
