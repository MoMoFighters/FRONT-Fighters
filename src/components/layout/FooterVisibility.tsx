'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterVisibility() {

    const pathname = usePathname();

    const HIDE_FOOTER_PATHS = [
        '/student',
        '/student/study',
        '/student/art',
        '/student/cook',
        '/student/health',
        '/student/beauty',
    ];

    const hideFooter =
        HIDE_FOOTER_PATHS.includes(pathname);

    if (hideFooter) {
        return null;
    }

    return <Footer />;
}