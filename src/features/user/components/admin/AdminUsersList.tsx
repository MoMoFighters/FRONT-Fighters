import UpdateUserStatusBtn from "../buttons/UpdateUserStatusBtn";
import DownloadProofDocBtn from "../buttons/DownloadProofDocBtn";
import { SearchX } from "lucide-react";
import { UserResponse } from "../../type";

interface AdminUsersListProps {
    users: UserResponse[];
    status?: string;
}

export default function AdminUsersList({ users, status }: AdminUsersListProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {status === "deleted" ? (
                <div className="bg-slate-500 grid grid-cols-6 px-12 py-3 text-slate-50 font-semibold">
                    <div>이름</div>
                    <div>사용자 유형</div>
                    <div className="col-span-2">이메일</div>
                    <div className="text-center">탈퇴일</div>
                    <div className="text-center">비고</div>
                </div>
            ) : (
                <div className="bg-slate-500 grid grid-cols-7 px-12 py-3 text-slate-50 font-semibold">
                    <div>이름</div>
                    <div>사용자 유형</div>
                    <div className="col-span-2">이메일</div>
                    <div className="text-center">가입일</div>
                    <div className="text-center">상태</div>
                    <div className="text-start">비고</div>
                </div>
            )}

            <div className="divide-y divide-slate-100 text-sm">
                {users.length === 0 && (
                    <div className="flex-1 h-60 flex flex-col gap-5 justify-center items-center text-2xl text-slate-300 font-bold">
                        <SearchX className="w-12 h-12 text-slate-300" />
                        찾고있는 회원이 존재하지 않습니다.
                    </div>
                )}

                {status === "deleted" ? (
                    users.map((user) => {
                        return (
                            <div
                                key={user.id}
                                className="grid grid-cols-6 px-12 py-4 hover:bg-slate-50 transition-colors items-center"
                            >
                                <div className="text-slate-900 font-medium">{user.name}</div>

                                <div className="text-slate-900">{user.role === "teacher" ? "강사" : "수강생"}</div>

                                <div
                                    className="col-span-2 text-slate-900 hover:text-slate-700 transition-colors"
                                >
                                    {user.email ? user.email : "-"}
                                </div>

                                <div className="text-slate-900 text-center">{user.deletedAt?.split('T')[0]}</div>

                                <div className="text-slate-600 text-center">탈퇴</div>
                            </div>
                        );
                    })
                ) : (
                    users.map((user) => {
                        return (
                            <div
                                key={user.id}
                                className="grid grid-cols-7 px-12 py-4 hover:bg-slate-50 transition-colors items-center"
                            >
                                <div className="text-slate-900 font-medium">{user.name}</div>

                                <div className="text-slate-900">{user.role === "TEACHER" ? "강사" : "수강생"}</div>

                                <div
                                    className='col-span-2 text-slate-900 hover:text-slate-700 transition-colors'
                                >
                                    {user.email ? user.email : "카카오 로그인 유저"}
                                </div>

                                <div className="text-slate-900 text-center">{user.createdAt?.split('T')[0]}</div>

                                <UpdateUserStatusBtn user={user} />

                                <div className="flex justify-start gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-600">신고:</span>
                                        <span
                                            className={'text-xs font-semibold text-slate-600'}
                                        >
                                            0/3
                                        </span>
                                    </div>
                                    {user.role === 'TEACHER' && <DownloadProofDocBtn user={user} />}
                                </div>

                            </div>

                        );

                    })
                )}


            </div>
        </div>
    );
}