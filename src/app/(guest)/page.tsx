import { BookOpen, ChefHat, ChevronRight, Dumbbell, Palette, Sparkles, TrendingUp, Users } from "lucide-react";
import cityImage from '@/app/assets/img/cityImg.png'
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  const categories = [
    { id: 1, name: '학습', icon: BookOpen, count: 156 },
    { id: 2, name: '뷰티', icon: Sparkles, count: 89 },
    { id: 3, name: '운동', icon: Dumbbell, count: 124 },
    { id: 4, name: '예술', icon: Palette, count: 203 },
    { id: 5, name: '요리', icon: ChefHat, count: 167 },
  ];

  return (
    <>
      <section className="relative bg-linear-to-br from-slate-50 via-slate-100/50 to-slate-100 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
                당신의 성장이
                <br />
                <span className="text-transparent bg-clip-text bg-indigo-500 from-indigo-600 to-indigo-700">
                  도시가 됩니다
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                학습할 때마다 성장하는 나만의 도시를 만들어보세요.
                <br />
                모모시티에서 꿈을 현실로 만드는 특별한 경험을 시작하세요.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/auth/login">
                  <button className="cursor-pointer px-8 py-4 bg-indigo-400 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    시작하기
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-slate-900">12,000+</div>
                  <div className="text-sm text-slate-600 mt-1">수강생</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">739+</div>
                  <div className="text-sm text-slate-600 mt-1">강의</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">4.8★</div>
                  <div className="text-sm text-slate-600 mt-1">평균 평점</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-10 transform rotate-2 hover:rotate-0 transition-transform">
                <div
                  className="w-full h-80 rounded-2xl relative"
                >
                  <Image
                    src={cityImage}
                    alt="이미지"
                    fill
                    sizes="100vw"
                    className="w-full h-auto rounded-2xl brightness-90"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">다양한 카테고리를 탐색하세요</h2>
            <p className="text-lg text-slate-600">관심 있는 분야의 강의를 찾아보세요</p>
          </div>

          <Link href="/auth/login">
            <button className=" absolute right-8 top-0 px-6 py-3 cursor-pointer bg-indigo-400 text-white rounded-xl font-semibold hover:bg-indigo-500 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-101">
              전체 보기
              <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
          <div className="grid grid-cols-5 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className="group bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-slate-900" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-500">{category.count}개 강의</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">왜 모모시티인가요?</h2>
            <p className="text-lg text-slate-600">다른 학습 플랫폼과 차별화된 특별한 경험</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">성장이 보입니다</h3>
              <p className="text-slate-600 leading-relaxed">
                학습할 때마다 성장하는 나만의 도시를 통해 학습 성취를 시각적으로 확인하세요.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">무제한 학습</h3>
              <p className="text-slate-600 leading-relaxed">
                다양한 분야의 수백 개 강의를 자유롭게 수강하며 원하는 만큼 배우세요.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">함께 성장</h3>
              <p className="text-slate-600 leading-relaxed">
                친구들과 도시를 공유하고 서로의 성장을 응원하며 동기부여를 받으세요.
              </p>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
