import CommunityPostForm from "@/features/community/CommunityPostForm";

interface CommunityPostEditPageProps {
    params: Promise<{
        id: string;
    }>;
}


// const COMMUNITY_POST: CommunityPostDetail = {
//     postId: 1,
//     title: "모강사 코딩 강의 리뷰",
//     category: "STUDY",
//     viewCount: 11,
//     likeCount: 5,
//     commentCount: 5,
//     isMine: false,
//     authorName: "김태완",
//     authorProfileImageUrl: "https://placehold.co/80x80/e0e7ff/4f46e5?text=M",
//     authorRole: "STUDENT",
//     authorId: 3,
//     contents: [
//         {
//             type: "TEXT",
//             content:
//                 "공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,",
//         },
//         {
//             type: "IMAGE",
//             content: "https://placehold.co/900x560/e0e7ff/4f46e5?text=Community+Image",
//         },
//         {
//             type: "TEXT",
//             content:
//                 "저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. ",
//         },
//     ],
//     createdAt: "2026-06-18T13:00:00.000000Z",
// };

export default async function CommunityPostEditPage({
    params,
}: CommunityPostEditPageProps) {
    const { id } = await params;

    return (
        <div>
            <CommunityPostForm
                mode="EDIT"
                data={{ postId: id }}
                role="ADMIN"
            />
        </div>
    );
}
