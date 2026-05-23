// import city from "@/assets/city.png";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-4 gap-1 flex flex-col">
      <h1 className="text-2xl text-center">우리 MOMOCITY는요..</h1>
      <div className="grid grid-cols-3 gap-3"> {/* about 박스 3개 */}
        <div className="flex flex-col gap-1 border-black border p-1">
          <h3 className="ml-3 text-xl">도시 성장형 학습 플랫폼</h3>
          <p className="text-center">학습을 통해 도시를 성장시켜, 성장의 계기를 제공합니다.</p>
        </div>
        <div className="flex flex-col gap-1 border-black border p-1">
          <h3 className="ml-3 text-xl">학습 분야</h3>
          <p className="text-center">학문부터 자격증, 라이프스타일까지 다양한 수강이 가능합니다.</p>
        </div>
        <div className="flex flex-col gap-1 border-black border p-1">
          <h3 className="ml-3 text-xl">성장하고 공유하자</h3>
          <p className="text-center">내 도시를 키우고, 친구의 도시에 놀러가자</p>
        </div>
      </div>
      <div>
        <Image
          src=""
          alt="도시 이미지"
        />
      </div>
      <button className="ml-auto">
        <Link href="/login">도시 키우러 가기</Link>
      </button>
    </div>
  );
}
