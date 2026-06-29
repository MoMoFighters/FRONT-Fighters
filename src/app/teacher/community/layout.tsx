export default function TeacherLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-[calc(100vh-145px)] m-4 w-full">
            {children}
        </div>
    )
}