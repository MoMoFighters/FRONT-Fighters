import GuestLayoutShell from "@/components/layout/GuestLayoutShell";

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <GuestLayoutShell>
            {children}
        </GuestLayoutShell>
    );
}
