import Link from "next/link";

export default function Login() {
    return (
        <div className="p-4 flex mx-auto flex-col text-center">
            <h1 className="text-2xl">로그인</h1>
            <form
                action=""
                className="grid grid-cols-2 mt-6 gap-9"
            >
                <p className="ml-auto">이메일</p>
                <input
                    type="text"
                    placeholder="이메일을 입력해주세요."
                    className="border border-black"
                />
                <p className="ml-auto">비밀번호</p>
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    className="border border-black"
                />
                <br />
            </form>
            <button
                type='submit'
            >{/* 나중에 폼으로 집어넣고, Login APi 연동  */}
                <Link href='/city'>로그인</Link>
            </button>
            <div className="flex flex-col gap-3 mt-10">
                <button className="px-6 py-2 border border-black bg-yellow-400 text-white cursor-pointer">카카오 API</button>
                <button className="px-6 py-2 border border-black bg-gray-400 text-white cursor-pointer">구글 API</button>
                <hr className="mt-4 mb-4" />
                <button className="px-6 py-2 border border-black bg-pink-300 text-black cursor-pointer">자체 회원가입</button>
                <button className="px-6 py-2 border border-black bg-pink-400 text-white cursor-pointer">강사로 회원가입하기</button>
            </div>
        </div>
    );
}