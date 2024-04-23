'use client'

import Loading from "@/components/Loading";
import { LikeApiResponse, LikeInterface, StoreType } from "@/interface";
import axios from "axios";
import { useQuery } from "react-query";

import React from "react";
import StoreList from "@/components/StoreList";
import Pagenation from "@/components/Pagination";

export default function LikesPage({ searchParams }: { searchParams: { page: string} }) {
  const page = searchParams?.page || "1";

  //비동기 함수 하나 만들어주기
  const fetchLikes = async () => {
    // 기존에 했던 것 처럼 에이피아잉 요청해주기
    // 페이지 쿼리 값을 가져오게 수정해주기 !
    // const { data } = await axios("/api/likes");
    const { data } = await axios(`/api/likes?limit=10&page=${page}`);
    return data as LikeApiResponse;
  };
  
  const { 
    data: likes, 
    isLoading, 
    isError,
    isSuccess 
  } = useQuery(`likes-${page}`, fetchLikes);

  if(isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold"> 다시 시도해주세요.</div>
    )
  }
  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <h3 className="text-lg font-semibold">찜한 맛집</h3>
      <div className="mt-1 text-gray-500 text-sm">찜한 가게 리스트 입니다.</div>
      <ul role="list" className="divide-y divide-gray-100 mt-10">
          {isLoading ? (
            <Loading />
          ): (
            likes?.data.map((like: LikeInterface, index) => (
              <StoreList i={index} store={like.store} key={index} />
            ))
          )}
          {/* !! : boolean이 ture 값인지 확인을 하고 
          !!! : 없는지 확인을 하는 연산자 
          한마디로 다 가져왔지만 likes에 데이터가 없는 경우에
          */}
          {isSuccess && !!!likes.data.length && (
            <div className="p-4 border border-gray-200 rounded-md text-sm text-gray-400">
              찜한 가게가 없습니다.
            </div>
          )}

      </ul>
      {/* likes의 토탈 페이지가 있는 경우와 likes의 토탈 페이지가 0보다 큰 경우에
      페이지 네이션을 보여줄 수 있도록 */}
      {/* {likes?.totalPage && likes?.totalPage > 0 && ( */}
        <Pagenation total={likes?.totalPage} page={page}  pathname="/users/likes" />
      {/* )} */}
   </div>
  )
}