import { User } from "@/app/admin/users/page";
import UpdateUserStatusBtn from "./buttons/UpdateUserStatusBtn";
import DownloadProofDocBtn from "./buttons/DownloadProofDocBtn";

interface AdminUsersListProps {
    users: User[];
    status?: string;
}

export default function AdminUsersList({ users, status }: AdminUsersListProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            {status === "delete" ? (
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
                    <div className="text-center">비고</div>
                </div>
            )}

            {/* Table Body */}
            <div className="divide-y divide-slate-100 text-sm">
                {status === "delete" ? (
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
                                    {user.email}
                                </div>

                                <div className="text-slate-900 text-center">{user.deletedAt}</div>

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

                                <div className="text-slate-900">{user.role === "teacher" ? "강사" : "수강생"}</div>

                                <div
                                    className="col-span-2 text-slate-900 hover:text-slate-700 transition-colors"
                                >
                                    {user.email}
                                </div>

                                <div className="text-slate-900 text-center">{user.createdAt}</div>

                                <UpdateUserStatusBtn user={user} />

                                <div className="flex justify-center">
                                    {user.role === 'teacher' ? (
                                        <DownloadProofDocBtn user={user} />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-600">신고:</span>
                                            <span
                                                className={`text-sm font-semibold ${user.reportCount === 3
                                                    ? 'text-red-600'
                                                    : user.reportCount === 2 || user.reportCount === 1
                                                        ? 'text-amber-600'
                                                        : 'text-slate-600'
                                                    }`}
                                            >
                                                {user.reportCount}/3
                                            </span>
                                        </div>
                                    )}
                                </div>

                            </div>

                        );

                    })
                )}


            </div>
        </div>
    );
}