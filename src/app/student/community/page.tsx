import Image from "next/image";
import noReady from '@/app/assets/img/no-ready.png'

export default function CommunityPage() {
    return (
        <div>
            <Image src={noReady} alt='noReady' className='h-[calc(100vh-144px)]' />
        </div>
    );
}