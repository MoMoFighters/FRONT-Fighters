import { BatteryFull, Wifi } from "lucide-react";

export default function PhoneTopBar() {
    return (
        <header className="relative z-20 flex h-11 shrink-0 items-center justify-between border-b border-white/70 bg-white/75 px-8 backdrop-blur-md">
            <p className="text-[13px] font-bold tracking-tight text-slate-800">
                09:41
            </p>

            <div className="absolute left-1/2 top-2.5 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-950" />

            <div className="flex items-center gap-1.5 text-slate-700">
                <Wifi size={14} strokeWidth={2.3} />
                <BatteryFull size={17} strokeWidth={2.3} />
            </div>
        </header>
    );
}