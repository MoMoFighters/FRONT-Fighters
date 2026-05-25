import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UpdateLectureStatusBtn({ status }: { status: string }) {
    return (
        <div>
            {status === "active" ? (

                <span
                    className="
                                    px-3
                                    py-1.5
                                    rounded-lg
                                    font-semibold
                                    text-   
                                    bg-emerald-100
                                    text-emerald-700
                                "
                > 진행중 </span>

            ) : (

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="
                                            px-3
                                            py-1.5
                                            rounded-lg
                                            font-semibold
                                            text-s
                                            bg-amber-100
                                            text-amber-700
                                            hover:bg-amber-20
                                            transition-all
                                        "
                        > 승인 대기 </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="center"
                    >
                        <DropdownMenuItem
                            className="
                                            justify-cente
                                            text-emerald-700
                                            focus:text-emerald-700
                                            focus:bg-emerald-50
                                            mb-1
                                        "
                        > 강의 승인 </DropdownMenuItem>
                        <DropdownMenuItem
                            className="
                                            justify-center

                                            text-red-700
                                            focus:text-red-700
                                            focus:bg-red-50
                                        "
                        > 승인 거절 </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}