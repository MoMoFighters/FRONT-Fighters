import { BatteryFull, Wifi } from "lucide-react";

export default function PhoneTopBar() {
    return (
        <div className="w-full h-7 px-3 bg-white flex items-center justify-between border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-800">
                09:41
            </p>

            <div className="flex items-center gap-1 text-slate-700">
                <Wifi size={13} strokeWidth={2.2} />
                <BatteryFull size={15} strokeWidth={2.2} />
            </div>
        </div>
    );
}