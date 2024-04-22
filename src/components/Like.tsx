import { StoreType } from "@/interface";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useQuery } from "react-query";

//togglelike 위한 유즈 세션 (로그인 된 사용자만 할 수 있게)
import { useSession } from "next-auth/react"
import { toast } from "react-toastify";

interface LikeProps {
  storeId: number;
}
export default function Like({ storeId }: LikeProps) {
  
  //togglelike 위한 유즈 세션 (로그인 된 사용자만 할 수 있게)
  const { data: session, status } = useSession();
  const fetchStore = async () => {
    const { data } = await axios(`/api/stores?id=${storeId}`)
    return data as StoreType;
  }
  //useQuery 사용하는 부분
  const {
    data: store,
    // 스토어를 업데이트 시켜주기 위해(강제로)
    refetch

    //like store 로 쿼리 바꿔주기! 겹치면 무한루프 돌수도  방지위함
  } = useQuery(`like-store-${storeId}`, fetchStore, {
    enabled: !!storeId,
    refetchOnWindowFocus: false,
  });
  // 위방법으로 storeId를 가져와도 되고 위 방식으로 가져와도 된다.
  // const config = {
  //   url: `/api/stores?id=${storeId}`
  // }
  const  toggleLike = async() => {
    // 찜하기/찜취소 로직
    if(session?.user && store) {
      try {
        const like = await axios.post("/api/likes", {
          // 바디에 스토어 아이디 값 같이 보내주기
          //현재 내가 누루고 있는 가게가 몇번째 아이디의 가게인지 백엔드에서 인식 알 수 있음
          storeId: store.id
        });
        console.log(like)
        if(like.status === 201) {
          toast.success("가게를 찜했습니다.")
        } else {
          toast.warn("찜을 취소했습니다.")
        }
        // 찜하기 눌렀을 때 리페치 시켜주기 !! 그럼 찜 하트 색깔이 성공적으로 변함 ㅎㅎ
        refetch();
        } catch(e) {
        console.log(e);
      }
    } else if(status === 'unauthenticated') {
      toast.warn('로그인 후 이용해주세요')
    }

  };
  return (
    <button type="button" onClick={toggleLike}>
      {/* 로그인된 사용자가 좋아요를 눌렀다면? */}
      {/* 라이크 데이터가 성공적으로 넘어온 것을 확인했음에도 불구하구
      원래 유즈쿼리에 담겨있떤 스토어 데이터가 업데이트 되지 않아서 하트의 색깔이 변하지 않는 상황 */}
    {status ==='authenticated' && store?.likes?.length ? (
      <AiFillHeart className="hover:text-red-600 focus:text-red-600 text-red-500"/>
      ): (
      <AiOutlineHeart className="hover:text-red-600 focus:text-red-600"/>
    )}
   </button>
  )

}