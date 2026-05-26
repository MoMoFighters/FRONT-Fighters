'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import search from '@/app/assets/img/user-plus.svg'

export default function FriendManagement() {
    const [activeTab, setActiveTab] = useState<'chat' | 'mgmt'>('chat');
    const [selectedFriend, setSelectedFriend] = useState<string>('친구를 선택해주세요');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleWindowClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.classList.contains('more-btn')) {
                setOpenDropdownId(null);
            }
        };
        window.addEventListener('click', handleWindowClick);
        return () => window.removeEventListener('click', handleWindowClick);
    }, []);

    const handleSelectFriend = (name: string) => {
        setSelectedFriend(name);
        setActiveTab('chat');
    };

    const toggleDropdown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setOpenDropdownId(prev => (prev === id ? null : id));
    };

    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">

            {/* 상단 툴바 */}
            <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10 shrink-0">
                <div className="flex gap-5 h-full">
                    <div
                        className={`h-full flex items-center px-2 cursor-pointer font-semibold border-b-2 transition-colors ${activeTab === 'chat' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent'}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        내 친구
                    </div>
                    <div
                        className={`h-full flex items-center px-2 cursor-pointer font-semibold border-b-2 transition-colors ${activeTab === 'mgmt' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent'}`}
                        onClick={() => setActiveTab('mgmt')}
                    >
                        요청 관리
                    </div>
                </div>
                <span
                    className="text-xl cursor-pointer text-gray-700"
                    onClick={() => setIsSearchModalOpen(true)}
                >
                    <Image src={search} alt='친구찾기' className='w-5 h-5'></Image>
                </span>
            </div>

            {/* 메인 */}
            <div className="flex flex-1 overflow-hidden">

                {/* 좌측 */}
                <div className="w-72 border-r border-gray-100 flex flex-col bg-white shrink-0">
                    {/* 내 프로필 */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-mauve-500 flex items-center justify-center font-bold text-sm text-slate-50">홍</div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">홍길동 (나)</div>
                                <div className="text-xs text-gray-400">오늘도 화이팅!</div>
                            </div>
                        </div>
                        <div className="relative">
                            <span
                                className="more-btn text-gray-300 cursor-pointer px-1 hover:text-gray-600"
                                onClick={(e) => toggleDropdown(e, 'my-more')}
                            >•••</span>
                            {openDropdownId === 'my-more' && (
                                <div className="absolute right-0 top-6 bg-white shadow-lg rounded-lg border border-gray-100 min-w-24 z-50 overflow-hidden">
                                    <div
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => { setIsBlockModalOpen(true); setOpenDropdownId(null); }}
                                    >차단 관리</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 친구 목록 */}
                    <div className="flex-1 overflow-y-auto">
                        {/* 친구 1 */}
                        <div
                            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleSelectFriend('김친구')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">김</div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">김친구</div>
                                    <div className="text-xs text-gray-400">온라인</div>
                                </div>
                            </div>
                            <div className="relative">
                                <span
                                    className="more-btn text-gray-300 cursor-pointer px-1 hover:text-gray-600"
                                    onClick={(e) => toggleDropdown(e, 'friend1-more')}
                                >•••</span>
                                {openDropdownId === 'friend1-more' && (
                                    <div className="absolute right-0 top-6 bg-white shadow-lg rounded-lg border border-gray-100 min-w-24 z-50 overflow-hidden">
                                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => alert('삭제되었습니다.')}>친구 삭제</div>
                                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => alert('차단되었습니다.')}>친구 차단</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 친구 2 */}
                        <div
                            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleSelectFriend('이요청')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">이</div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">이요청</div>
                                    <div className="text-xs text-gray-400">오프라인</div>
                                </div>
                            </div>
                            <span className="more-btn text-gray-300 cursor-pointer px-1 hover:text-gray-600">•••</span>
                        </div>
                    </div>
                </div>

                {/* 우측 */}
                <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">

                    {/* 채팅 뷰 */}
                    {activeTab === 'chat' && (
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="px-6 py-3 border-b border-gray-100 bg-white font-semibold text-sm shrink-0">
                                {selectedFriend}
                            </div>
                            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2">
                                <div className="max-w-[70%] self-start bg-white border border-gray-100 rounded-2xl px-4 py-2 text-sm">안녕하세요! 오늘 날씨가 좋네요.</div>
                                <div className="max-w-[70%] self-end bg-blue-500 text-white rounded-2xl px-4 py-2 text-sm">네, 정말 그러네요!</div>
                            </div>
                            <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                                <input
                                    type="text"
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
                                />
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">전송</button>
                            </div>
                        </div>
                    )}

                    {/* 요청 관리 뷰 */}
                    {activeTab === 'mgmt' && (
                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            <div className="mb-8">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">받은 친구 요청</h3>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">박</div>
                                        <div>
                                            <div className="text-sm font-semibold">박보냄</div>
                                            <div className="text-xs text-gray-400">@park_send · 방금 전</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-semibold">수락</button>
                                        <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-semibold">거절</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-4">보낸 친구 요청</h3>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">최</div>
                                        <div>
                                            <div className="text-sm font-semibold">최검색</div>
                                            <div className="text-xs text-gray-400">@search_choi · 어제</div>
                                        </div>
                                    </div>
                                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-semibold">취소</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 차단 관리 모달 */}
            {isBlockModalOpen && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 rounded-[30px]">
                    <div className="bg-white w-96 rounded-2xl p-6 shadow-2xl">
                        <h3 className="font-bold text-base mb-5">차단 유저 관리</h3>
                        <div className="max-h-48 overflow-y-auto mb-5 border-t border-gray-100">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-sm">정차단 (@block_jung)</span>
                                <button className="border border-red-400 text-red-400 px-3 py-1 rounded-md text-xs font-semibold">해제</button>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-sm">스팸봇 (@bot_123)</span>
                                <button className="border border-red-400 text-red-400 px-3 py-1 rounded-md text-xs font-semibold">해제</button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm font-semibold"
                                onClick={() => setIsBlockModalOpen(false)}
                            >닫기</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 검색 모달 */}
            {isSearchModalOpen && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 rounded-[30px]">
                    <div className="bg-white w-96 rounded-2xl p-6 shadow-2xl">
                        <h3 className="font-bold text-base mb-5">친구 검색</h3>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none mb-4"
                            placeholder="아이디 또는 이름 검색"
                        />
                        <div className="flex justify-end gap-2">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold">검색</button>
                            <button
                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm font-semibold"
                                onClick={() => setIsSearchModalOpen(false)}
                            >닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}