export default function PhoneTopBar() {
    return (
        <div className="w-full h-7 bg-slate-200 text-center grid grid-cols-3 items-center">
            <div className="text-left pl-3 font-semibold text-sm">MOMO Telecom</div>
            <div className="flex-1 text-center">
                {/* <p className="ml-2 font-semibold text-sm">04:44</p> */}
            </div>
            <div className="text-right pr-3 font-semibold text-sm">100%</div>
        </div>
    );
}