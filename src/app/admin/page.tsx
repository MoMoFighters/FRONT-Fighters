import Image from "next/image";
import users from '@/app/assets/img/users-manage.svg'
import graph from '@/app/assets/img/graph.svg'
import book from '@/app/assets/img/book.svg'
import money from '@/app/assets/img/money.svg'
import { AlertCircle, Bell, ChevronRight, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReports } from "../services/report/service";
import { Report } from "@/features/report/type";

export default async function AdminDashboardPage() {

    // 더미 데이터 - module 4 이후, 다만 신고 로그는 module 3에 할 수도 있음, 접근 | 에러 로그는 백엔드와 상의 필요
    const announcements = [
        { id: 1, title: '서버 점검 안내', date: '2026-05-20', time: '14:30', priority: 'high' },
        { id: 2, title: '신규 기능 업데이트', date: '2026-05-19', time: '09:15', priority: 'medium' },
        { id: 3, title: '회원 약관 개정 안내', date: '2026-05-18', time: '16:20', priority: 'medium' },
        { id: 4, title: '휴일 운영 안내', date: '2026-05-17', time: '11:00', priority: 'low' },
        { id: 5, title: '보안 업데이트 완료', date: '2026-05-16', time: '13:45', priority: 'high' },
    ];

    const reportLogs: Report[] = await getReports();

    const errorLogs = [
        { id: 1, type: 'API Error', message: 'Payment gateway timeout', level: 'critical', time: '10분 전' },
        { id: 2, type: 'Database', message: 'Connection pool exhausted', level: 'warning', time: '1시간 전' },
        { id: 3, type: 'Frontend', message: 'React component render failed', level: 'error', time: '3시간 전' },
        { id: 4, type: 'API Error', message: 'Rate limit exceeded', level: 'warning', time: '5시간 전' },
        { id: 5, type: 'Server', message: 'Memory usage at 90%', level: 'critical', time: '6시간 전' },
    ];


    return (
        <div>
            <div className="flex items-center gap-3 mb-10">
                <div className="w-2 h-7 bg-slate-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-900">대시보드</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-200 rounded-2xl p-5 border border-slate-300 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-400 rounded-2xl flex items-center justify-center shadow-md">
                            <Image
                                src={users}
                                alt="총회원 아이콘"
                                priority
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-1">총 회원 수</p>
                            <div className="flex items-end gap-3">
                                <p className="text-3xl font-bold text-slate-900">1,234</p>
                                <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-0.5 mb-1.5">
                                    <Image
                                        src={graph}
                                        alt="꺾은선 아이콘"
                                        priority
                                    />
                                    <span className="text-xs font-semibold text-green-600">+ 12%</span>
                                </div>
                                <span className="text-xs text-slate-500 mb-1.5">전월 대비</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-200 rounded-2xl p-5 border border-slate-300 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-400 rounded-2xl flex items-center justify-center shadow-md">
                            <Image
                                src={book}
                                alt="책 아이콘"
                                priority
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-1">총 강의 수</p>
                            <div className="flex items-end gap-5">
                                <p className="text-3xl font-bold text-slate-900">156</p>
                                <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-0.5 mb-1.5">
                                    <Image
                                        src={graph}
                                        alt="꺾은선 아이콘"
                                        priority
                                    />
                                    <span className="text-xs font-semibold text-green-600">+ 8개</span>
                                </div>
                                <span className="text-xs text-slate-500 mb-1.5">신규 강의</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-200 rounded-2xl p-5 border border-slate-300 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-400 rounded-2xl flex items-center justify-center shadow-md">
                            <Image
                                src={money}
                                alt="달러 아이콘"
                                priority
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-1">총 매출</p>
                            <div className="flex items-end gap-3">
                                <p className="text-2xl font-bold text-slate-900">₩45.2M</p>
                                <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-0.5 mb-1.5">
                                    <Image
                                        src={graph}
                                        alt="꺾은선 아이콘"
                                        priority
                                    />
                                    <span className="text-xs font-semibold text-green-600">+ 23%</span>
                                </div>
                                <span className="text-xs text-slate-500 mb-1.5">전월 대비</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-159 flex flex-col">
                    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-slate-900" />
                            <h3 className="text-[16px] font-bold text-slate-900">공지사항</h3>
                        </div>
                        <Button variant="link" className="text-xs text-slate-500 hover:text-slate-700">전체보기</Button>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-y-auto scrollbar-thin flex-1">
                        {announcements.map((item) => (
                            <div
                                key={item.id}
                                className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {item.priority === 'high' && (
                                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                            )}
                                            <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-slate-700">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>{item.date}</span>
                                            <span>•</span>
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 mt-0.5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-159 flex flex-col">
                    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            <h3 className="text-[16px] font-bold text-slate-900">신고 로그</h3>
                        </div>
                        <Button variant="link" className="text-xs text-slate-500 hover:text-slate-700">전체보기</Button>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-y-auto scrollbar-thin flex-1">
                        {reportLogs.map((item) => (
                            <div
                                key={item.reportId}
                                className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-slate-900 truncate mb-1">
                                            {item.targetType} / {item.reason}
                                        </h4>
                                        <p className="text-xs text-slate-500">{item.detail}</p>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${item.status === 'PENDING'
                                            ? 'bg-amber-100 text-amber-700'
                                            : item.status === 'RESOLVED'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {item.status === 'PENDING' ? '대기중' : item.status === 'RESOLVED' ? '해결' : '반려'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span>{item.reporterUserId}</span>
                                    <span>•</span>
                                    <span>{item.reportedAt.split('T')[0]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-159 flex flex-col">
                    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <h3 className="text-[16px] font-bold text-slate-900">에러? 접근? 로그</h3>
                        </div>
                        <Button variant="link" className="text-xs text-slate-500 hover:text-slate-700">전체보기</Button>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-y-auto scrollbar-thin flex-1">
                        {errorLogs.map((item) => (
                            <div
                                key={item.id}
                                className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start gap-3 mb-2">
                                    <div
                                        className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${item.level === 'critical'
                                            ? 'bg-red-500'
                                            : item.level === 'error'
                                                ? 'bg-orange-500'
                                                : 'bg-yellow-500'
                                            }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-slate-500">{item.type}</span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded font-medium ${item.level === 'critical'
                                                    ? 'bg-red-100 text-red-700'
                                                    : item.level === 'error'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {item.level.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-900 font-medium mb-1 truncate">{item.message}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </div>
    );
}