"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function UserManageNav() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const searchRole = searchParams.get("role");
    const searchStatus = searchParams.get("status");

    const handleClickFilter = (filter?: string) => {

        if (!filter) {
            router.push("/admin/users");
            return;
        }

        if (filter === 'delete') {
            router.push(`/admin/users?status=${filter}`);
            return;
        }

        router.push(`/admin/users?role=${filter}`);
    };

    return (
        <div className="flex items-center gap-2 mb-4">

            <Button
                variant="ghost"
                onClick={() => handleClickFilter()}
                className={`
                    text-lg
                    font-semibold

                    ${!searchRole
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                전체
            </Button>

            <Button
                variant="ghost"
                onClick={() => handleClickFilter("teacher")}
                className={`
                    text-lg
                    font-semibold

                    ${searchRole === "teacher"
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                강사
            </Button>

            <Button
                variant="ghost"
                onClick={() => handleClickFilter("student")}
                className={`
                    text-lg
                    font-semibold

                    ${searchRole === "student"
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                수강생
            </Button>

            <Button
                variant="ghost"
                onClick={() => handleClickFilter("delete")}
                className={`
                    text-lg
                    font-semibold

                    ${searchStatus === "delete"
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                탈퇴 회원
            </Button>

        </div>
    );
}