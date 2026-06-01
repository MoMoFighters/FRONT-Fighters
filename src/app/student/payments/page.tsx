import noReady from '@/app/assets/img/no-ready.png'
import Image from 'next/image';

export default function PaymentsPage() {
    return (
        <div>
            <Image src={noReady} alt='noReady' className='h-[calc(100vh-144px)]' />
        </div>
    );
}