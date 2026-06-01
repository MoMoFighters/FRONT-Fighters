'use client'
import error from '@/app/assets/img/error.png'

import Image from "next/image";

export default function Error() {
    return (
        <div>
            <Image src={error} alt='error' />
        </div>
    );
}