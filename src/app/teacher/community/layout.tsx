export default function TeacherLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full min-h-0 w-full overflow-hidden p-4">
            {children}
        </div>
    )
}
