export default function Footer() {
    return (
        <footer className="shrink-0 bg-white">
            <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-center gap-60 px-8 py-5  border-t border-slate-200">

                <div className="flex flex-col items-center gap-2">
                    <nav className="flex items-center gap-4 text-xs text-slate-500">
                        <a href="#" className="hover:text-slate-900">
                            이용약관
                        </a>
                        <a href="#" className="hover:text-slate-900">
                            개인정보처리방침
                        </a>
                        <a href="#" className="hover:text-slate-900">
                            고객센터
                        </a>
                        <a href="#" className="hover:text-slate-900">
                            공지사항
                        </a>
                    </nav>

                    <p className="text-xs text-slate-400">
                        yourmomocity@gmail.com · © 2026 MoMoCITY
                    </p>
                </div>
            </div>
        </footer>
    );
}