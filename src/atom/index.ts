import { LocationType, SearchType, StoreType } from "@/interface";
import { atom } from "recoil"

const DEFAULT_LAT = "37.497625203";
const DEFAULT_LNG = "127.03088379";
const DEFAULT_ZOOM = 3;

//지도 스테이트 ! 
export const mapState = atom<any>({
  key: "map",
  default: null,
  dangerouslyAllowMutability: true,
})
//선택한 가게인 큐렌트 스토어 스테이트
export const currentStoreState = atom<StoreType | null>({
  key: "store",
  default: null,
})
//위도 경도 줌 값 !
export const locationState = atom<LocationType>({
  key: "location",
  default: {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    zoom: DEFAULT_ZOOM,
  },
});

//검색을 위한 아톰값!
export const searchState = atom<SearchType | null>({
  key: "search",
  default: null
})