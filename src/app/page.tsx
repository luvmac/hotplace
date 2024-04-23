import Map from "../components/Map";
import Markers from "../components/Markers";

import StoreBox from "../components/StoreBox"
import { StoreType } from "../interface";
import CurrentLocationButton from "@/components/comments/CurrentLocationButton";

export default async function Home() {
  const stores: StoreType[] = await getData();
  // const [map, setMap] = useState(null);
  // const [currentStore, setCurrentStore] = useState(null);


  return (
    <>
    <Map />
      <Markers
        stores={stores}
      />
      <StoreBox />
      <CurrentLocationButton />
      {/* <StoreBox store={currentStore} setStore={setCurrentStore} /> */}
  </>
  );
 

}

// 맛집 등록하면 1시간동안 업뎃이 안되는? 그런 오류
// 사용자 경험이 너무 안좋게 때무네 getServerSideProps로 바꿔주기
// export async function getStaticProps() {
//   const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`)
 
//   return {
//     props: { stores: stores.data },
//     revalidate: 60 * 60,
//   }
// }

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
      cache: "no-store"
    });
    if(!res.ok) {
      throw new Error("Failed to fetch data")
    }
    return res.json();
  } catch(e) {
    console.log(e);
  }

}