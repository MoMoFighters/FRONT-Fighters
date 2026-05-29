'use client'

import { Button } from "@/components/ui/button";

export default function AuthRefreshArea() {
    return (
        <div>
            <span className="text-slate-500 text-xs mr-4">자동 로그아웃 시간 :</span>
            <span className="text-slate-500 text-xs mr-4">59:59</span>
            <Button variant="outline" className="rounded-none text-slate-500 text-xs h-6 mr-4">연장</Button>
        </div>
    );
}