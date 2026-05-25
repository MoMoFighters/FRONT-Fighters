import AdminUsersList from "@/features/user/admin/AdminUsersList";
import UserManageNav from "@/features/user/admin/UserManageNav";
import UserManageSearchbar from "@/features/user/admin/UserManageSearchbar";

// 나중에 타입 정의를 쭉 할 때 erd 에서 enum 타입인건 우리도 enum 타입으로 정의 해주기
export interface User {
    id: number;
    name: string;
    role: string;
    email?: string;
    status: string;
    proof?: boolean;
    reportCount?: number;
    createdAt: string;
    deletedAt?: string;
}

export default async function UserManagePage({ searchParams }: {
    searchParams: Promise<{
        role?: string;
        status?: string;
        keyword?: string;
    }>
}) {

    const { role, status, keyword } = await searchParams;
    // const users = await getUsers({ role, status, keyword }); (후에 데이터 페칭하는 방식, getUsers 에서는 role 이 있다면 role에 따른 유저 전체 조회, 없으면 전체 조회)

    const dummyUsers: User[] = [
        { id: 1, name: '홍길동', role: 'student', email: 'hong@test.com', createdAt: '2026-05-19', status: 'active', reportCount: 0 },
        { id: 2, name: '김철수', role: 'teacher', email: 'kim@test.com', createdAt: '2026-05-18', status: 'active', proof: true },
        { id: 3, name: '이영희', role: 'student', email: 'lee@test.com', createdAt: '2026-05-17', status: 'banned', reportCount: 1 },
        { id: 4, name: '박민수', role: 'teacher', email: 'park@test.com', createdAt: '2026-05-16', status: 'pending', proof: true },
        { id: 5, name: '최수진', role: 'student', email: 'choi@test.com', createdAt: '2026-05-15', status: 'active', reportCount: 2 },
        { id: 6, name: '정대호', role: 'teacher', email: 'jung@test.com', createdAt: '2026-05-14', status: 'active', proof: true },
        { id: 7, name: '강미래', role: 'student', email: 'kang@test.com', createdAt: '2026-05-13', status: 'black', reportCount: 3 },
        { id: 8, name: '윤서연', role: 'student', email: 'yoon@test.com', createdAt: '2026-05-12', status: 'active', reportCount: 0 },
        { id: 9, name: '백예철', role: 'student', email: 'back@test.com', createdAt: '2026-05-15', status: 'delete', reportCount: 0, deletedAt: '2026-05-20' },
        { id: 10, name: '조민형', role: 'student', email: 'jmh@test.com', createdAt: '2026-05-11', status: 'delete', reportCount: 0, deletedAt: '2026-05-20' },
        { id: 11, name: '한민호', role: 'student', email: 'hans@test.com', createdAt: '2026-05-16', status: 'delete', reportCount: 0, deletedAt: '2026-05-20' },
    ];

    const filterUsers: User[] = dummyUsers.filter((user) => {

        if (!status && user.status === "delete") {
            return false;
        }

        if (role && user.role !== role) {
            return false;
        }

        if (status && user.status !== status) {
            return false;
        }

        if (
            keyword &&
            !user.name.includes(keyword) &&
            !user.email?.includes(keyword)
        ) {
            return false;
        }

        return true;
    });

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-7 bg-slate-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-900">회원 관리</h2>
            </div>

            <UserManageNav />

            <UserManageSearchbar role={role} status={status} keyword={keyword} />

            <AdminUsersList users={filterUsers} status={status} />
        </div>
    );
}