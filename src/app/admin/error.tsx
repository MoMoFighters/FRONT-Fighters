'use client'

import ServiceErrorPage from '@/components/common/ServiceErrorPage';

export default function Error({
    error,
    reset
}: {
    error: Error & {
        digest?: string
    };
    reset: () => void;
}) {
    return <ServiceErrorPage error={error} reset={reset} />;
}
