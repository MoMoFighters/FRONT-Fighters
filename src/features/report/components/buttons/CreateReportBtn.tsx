'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

export default function CreateReportBtn() {
    return (
        <>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className='absolute w-15 bottom-5 right-5'>신고</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-slate-900 text-lg font-semibold">신고</DialogTitle>
                            <DialogDescription className="text-xs whitespace-pre-line text-slate-400 leading-3">
                                {`1. 해당 페이지에서 접수할 신고 사유를 작성해주세요.\n
                                2. 악성 유저가 있다면 해당 유저의 닉네임도 적어주세요.\n
                                3. 악성 게시글이 있다면 해당 게시글의 작성자 닉네임도 적어주세요.`}
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="relative text-slate-400 hover:text-slate-500 cursor-pointer">
                                            신고 사유를 선택해주세요.
                                            <ChevronDown className="absolute right-2 top-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>신고 사유</DropdownMenuLabel>
                                            <DropdownMenuItem>홍보성 컨텐츠</DropdownMenuItem>
                                            <DropdownMenuItem>도배성 컨텐츠</DropdownMenuItem>
                                            <DropdownMenuItem>부적절한 언어</DropdownMenuItem>
                                            <DropdownMenuItem>기타</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Field>
                            <Field>
                                <Label htmlFor="reason-detail">신고 사유</Label>
                                <Input
                                    id="reason-detail"
                                    name="reason-detail"
                                    placeholder="기타 사유 또는 닉네임을 작성해주세요."
                                    className="text-xs!"
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    );
}