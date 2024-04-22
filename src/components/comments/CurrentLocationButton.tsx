import { mapState } from "@/atom";
import { useState } from "react";
import { MdOutlineMyLocation } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import FullPageLoader from "../FullpageLoader";

export default function CurrentLocationButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const map = useRecoilValue(mapState);
  const handleCurrentPosition = () => {
    setLoading(true);

    //geolocation 으로 현재 위치 가져오기
    
    const options = {
      // ture로 하면 정확한 값을 가져오지만 너무 느려짐
      enableHighAccuracy: false,
      timeout: 5000,
      // 값을 Infinity 주면 항상 캐시가 되서 굉장히 빠르게 작동을 하고
      // 그게 아닌 경우에는 항상 누를 때 마다 캐시되지 않은 위치를 가져오는 거 같음
      maximumAge: Infinity,
    };
    if(navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        // 성공케이스
        (position) => {
          const currentPosition = new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          // console.log(getCurrentPosition)
          if(currentPosition) {
            setLoading(false)
            map.panTo(currentPosition);
            toast.success("현재 위치로 이동되었습니다.")
          }
          return currentPosition;
        },
        // 에러가 났을 경우에
        () => {
          toast.error("현재 위치를 가져올 수 없습니다.")
          setLoading(false);
        },
        options
      )
    }
  };

  return (
    <>
    {loading && <FullPageLoader />}
     <button 
    type="button" 
    onClick={handleCurrentPosition}
    className="fixed z-10 p-2 shadow right-10 bottom-20 bg-white rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-200"
  > 
    <MdOutlineMyLocation className="w-5 h-5"/>
  </button>
    </>
  )
 
}