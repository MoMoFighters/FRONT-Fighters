import Link from "next/link";

interface MobileTextItemProps {
    title: string;
    description: string;
    href?: string;
}

export default function MobileTextItem({
    title,
    description,
    href,
}: MobileTextItemProps) {
    const content = (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-black text-slate-900">
                {title}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
                {description}
            </p>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block transition active:scale-[0.98]">
                {content}
            </Link>
        );
    }

    return content;
}
