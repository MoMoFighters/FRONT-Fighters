'use client'

import { User } from "@/app/admin/users/page";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UpdateUserStatusBtn({
    user,
}: {
    user: User;
}) {

    return (
        <div className="flex justify-center">

            {user.role === "teacher" ? (

                <Button
                    className={`
                        px-3
                        py-1.5
                        font-semibold
                        transition-colors
                        text-[14px]
                        cursor-pointer

                        ${user.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }
                    `}
                >
                    {user.status === 'active'
                        ? "승인"
                        : "미승인"}
                </Button>) : user.status === "black" ?
                (<Button
                    className={`
                        px-3
                        py-1.5
                        font-semibold
                        transition-colors
                        text-[14px]
                        cursor-pointer
                        bg-red-100 text-red-700 hover:bg-red-200
                    `}
                >
                    영구정지
                </Button>
                )
                : (

                    <DropdownMenu>

                        <DropdownMenuTrigger asChild>

                            <Button
                                className={`
                                px-3
                                py-1.5
                                font-semibold
                                transition-colors
                                text-[14px]
                                cursor-pointer

                                ${user.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                    }
                            `}
                            >
                                {user.status === 'active'
                                    ? "활동중"
                                    : "일시정지"}
                            </Button>

                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="center"
                        >

                            {user.status === "active" && (
                                <>
                                    <DropdownMenuItem
                                        className="
                                    justify-center
                                        text-amber-700
                                        focus:text-amber-700
                                        focus:bg-amber-50
                                    "
                                    >
                                        일시정지
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="
                                    justify-center
                                        text-red-700
                                        focus:text-red-700
                                        focus:bg-red-50
                                    "
                                    >
                                        영구정지
                                    </DropdownMenuItem>
                                </>
                            )}

                            {user.status === "banned" && (
                                <>
                                    <DropdownMenuItem
                                        className="
                                    justify-center
                                        text-emerald-700
                                        focus:text-emerald-700
                                        focus:bg-emerald-50
                                    "
                                    >
                                        정지해제
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="
                                    justify-center
                                        text-red-700
                                        focus:text-red-700
                                        focus:bg-red-50
                                    "
                                    >
                                        영구정지
                                    </DropdownMenuItem>
                                </>
                            )}

                        </DropdownMenuContent>

                    </DropdownMenu>
                )}
        </div>
    );
}