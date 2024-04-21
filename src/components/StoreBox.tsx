import { Dispatch, SetStateAction } from "react";
import Image from 'next/image';
import { AiOutlineClose, AiOutlineInfoCircle, AiOutlineCheck, AiOutlinePhone } from "react-icons/ai";
import { HiOutlineMapPin } from "react-icons/hi2";
import { StoreType } from "../interface";
import { useRouter } from "next/router";

// 스토어 박스는 스토어랑 셋스토어값을 받고있기 때문에 useRecoilState 사용해서 값과 세터 두개를 모두 전역으로 바꿔주기
import { useRecoilState } from "recoil" 
import { currentStoreState } from "../atom"

// interface StoreBoxProps {
//   store: StoreType | null;
// }
// export default function StoreBox({ store, setstore }: StoreBoxProps) {
  export default function StoreBox() {
  const router = useRouter();
  // 따라서 Store 박스 같은 경우에는 상태를 가져오거나 props로 받을 필요가 전혀 없어지게 되었다.
  const [ store, setStore ] = useRecoilState(currentStoreState)
  return (
  <div 
  className="fixed transition ease-in-out delay-150 inset-x-0 mx-auto bottom-20 rounded-lg shadow-lg max-w-sm md:max-w-xl z-10 bg-white">
    {store && (
      <>
     <div className="p-8">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <Image src={
              store?.category
              ? `/images/markers/${store?.category}.png`
              : "/images/markers/default.png"
            }
              width={40}
              height={40}  alt="아이콘이미지"
            />
            <div>
              <div className="font-semibold">{store?.name}</div>
              <div className="text-sm">{store?.storeType}</div>
            </div>
          </div>
          <button type="button" onClick={() => setStore(null)}>
            <AiOutlineClose />
          </button>
        </div>
        <div className="mt-2 flex gap-2 items-center">
            <HiOutlineMapPin />
            {store?.address}
        </div>
        <div className="mt-2 flex gap-2 items-center">
            <AiOutlinePhone />
            {store?.phone}
        </div>
        <div className="mt-2 flex gap-2 items-center">
            <AiOutlineInfoCircle />
            {store?.storeType}
        </div>
        <div className="mt-4 flex gap-2 items-center">
            <AiOutlineCheck />
            {store?.category}
        </div>
     </div>
     <button type="button" onClick={() => router.push(`/stores/${store.id}`)} className="w-full bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 py-3 text-white font-semibold rounded-b-lg">
            상세보기
     </button>
     </>
    )}
  </div>
  )
}