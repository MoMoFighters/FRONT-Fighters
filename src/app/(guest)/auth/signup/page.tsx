export default function Signup() {
    return (
        <>
            <div>회원가입</div>
            <form action="">
                {/* 나중에 폼 따로 분리하기? -> 근데 fetching 하는게 없어서 걍 이 자체 페이지를 use client하면될듯 */}
                <input type="text" placeholder="이름" />
                <input type="email" placeholder="이메일" />
                <button>이메일인증</button>
                <input type="text" placeholder="인증번호" />
                <button>인증하기</button>
                <button>코드 재전송</button>
                <input type="password" placeholder="비밀번호" />
                <input type="password" placeholder="비밀번호확인" />
                <button>회원가입</button>
            </form>
        </>
    );
}