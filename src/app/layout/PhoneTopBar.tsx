export default function PhoneTopBar() {
    return (
        <div className="w-full h-7 bg-gray-300 text-center grid grid-cols-3">
            <div className="text-left pl-3">MOMO Telecom</div>
            <div className="flex-1 text-center">
                <p className="ml-2">04:44</p>
            </div>
            <div className="text-right pr-3">100%</div>
        </div>
    );
}