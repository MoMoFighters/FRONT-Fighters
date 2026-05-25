'use client'

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteLectureBtn({ mode }: { mode: string; }) {
    return (
        <div>
            {mode === 'icon' && <Button variant="ghost"
                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="강의 삭제"
            >
                <Trash2 className="w-4 h-4" />
            </Button>}
        </div>
    );
}