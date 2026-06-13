'use client'

import phone from '@/app/assets/img/tempPhone.png'
import phoneHead from '@/app/assets/img/tempPhoneHead.png'
import phoneHeadOn from '@/app/assets/img/tempPhoneOn.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Phone() {
    const [isOn, setIsOn] = useState(false)
    const [isRing, setIsRing] = useState(false)
    const [now, setNow] = useState(0)

    // 폰 : 메신저(친구메시지) + 캘린더 + 커뮤니티 + 돈관련
    const imgChange = [phoneHead, phoneHeadOn]

    useEffect(() => {
        if (!isRing) {
            setNow(0)
            return
        }

        const interval = setInterval(() => {
            setNow(prev => (prev + 1) % 2)
        }, 100)

        return () => clearInterval(interval)
    }, [isRing])

    return (
        <Image
            onMouseEnter={() => setIsOn(true)}
            onMouseLeave={() => setIsOn(false)}
            onClick={() => setIsRing(prev => !prev)}
            src={isRing ? imgChange[now] : (isOn ? phone : phoneHead)}
            alt="폰"
            width={150}
            className="cursor-pointer"
        />
    )
}