import Link from "next/link";

export default function Nothing() {
    return (
        <div className="p-10">
            <Link href='/city/first'>건설하기</Link> {/* 어느 위치를 찍었는지에 따라 도시 화면쪽에서 뭔가(first,second 등)를 받아와야할듯 */}
        </div>
    );
}