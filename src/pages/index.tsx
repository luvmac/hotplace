import { useState } from "react";

import Map from "../components/Map";
import Markers from "../components/Markers";

import StoreBox from "../components/StoreBox"
import { StoreType } from "../interface";
import axios from "axios";

export default function Home({ stores }: { stores: StoreType[]}) {
  // const [map, setMap] = useState(null);
  // const [currentStore, setCurrentStore] = useState(null);

  return (
    <>
    <Map />
      <Markers
        stores={stores}
      />
      <StoreBox />
      {/* <StoreBox store={currentStore} setStore={setCurrentStore} /> */}
  </>
  );
 

}

// 맛집 등록하면 1시간동안 업뎃이 안되는? 그런 오류
// 사용자 경험이 너무 안좋게 때무네 데이터 패칭 방법을  getServerSideProps로 바꿔주기
// export async function getStaticProps() {
//   const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`)
 
//   return {
//     props: { stores: stores.data },
//     revalidate: 60 * 60,
//   }
// }

export async function getServerSideProps() {
  const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
  return {
    props: { stores: stores.data }
  }
}