import noReady from '@/app/assets/img/no-ready.png'
import Image from 'next/image';

export default function AdminSalesPage() {
    return (
        <div>
            {/* <div className="flex items-center gap-3 mb-10">
                <div className="w-2 h-7 bg-slate-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-900">매출 관리</h2>
            </div> */}
            <Image src={noReady} alt='noReady' className='h-[calc(100vh-144px)]' />
        </div>
    );
}