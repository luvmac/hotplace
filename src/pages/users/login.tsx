// 로그인 페이지 들어왔을 때 사용자가 로그인이 되어있으면 메임페이지로 가게 할 수 있도록 유즈이펙터 사용
import { useEffect } from 'react'
import {AiOutlineGoogle} from 'react-icons/ai'
import { SiNaver } from 'react-icons/si'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { signIn, useSession } from "next-auth/react"
//라우터  
import { useRouter } from "next/router"

export default function LoginPage() {
  const { status, data:session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if(status === 'authenticated') {
      router.replace("/");
    }
  },[router, status]);
  return (
    <div className="flex flex-col justify-center px-6 lg:px-8 h-[60vh]">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-blue-800 text-center text-2xl font-semibold italic">Nextmap</h1>
      </div>
        <div className="text-center mt-6 text-2xl font-bold text-gray-600">SNS계정으로 로그인 해주세요
        <p className="mt-2 text-center text-sm text-gray-600">계정이 없다면 자동으로 회원가입이 진행됩니다.</p>
      </div>
      <div className="mt-10 mx-auto w-full max-w-sm">
        <div className="flex flex-col gap-3">
          <button type="button"
          onClick={() => signIn("gogole", { callbackUrl: "/" })}
            className="text-white flex gap-2 bg-[#4285F4] hover:bg-[#4285F4]/90 font-medium rounded-lg w-full px-5 py-4 text-center items-center justify-center">
              <AiOutlineGoogle className="w-6 h-6"/>
              Sign in with Google
           </button>
           <button type="button"
             onClick={() => signIn("naver", { callbackUrl: "/" })}
            className="text-white flex gap-3 bg-[#2db400] hover:bg-[#2db400]/90 font-medium rounded-lg w-full px-5 py-4 text-center items-center justify-center">
              <SiNaver className="w-4 h-4"/>
              Sign in with Naver
           </button>
           <button type="button"
            className="text-black flex gap-2 bg-[#fef01b] hover:bg-[#fef01b]/90 font-medium rounded-lg w-full px-5 py-4 text-center items-center justify-center">
              <RiKakaoTalkFill className="w-6 h-6"/>
              Sign in with Kakao
           </button>
        </div>
      </div>
    </div>
  )
}