import React, { useRef, useEffect, useCallback, useState} from "react";

import Image from "next/image";
import { StoreType } from "@/interface";

import { useInfiniteQuery } from "react-query";

import axios from "axios";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loader from "@/components/Loader";
import SearchFilter from "@/components/SearchFilter";


export default function StoreListPage() {
  // const router = useRouter();
  // const { page = "1" }: any = router.query;
  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;
  // 검색어와 지역 검색어를 위한 상태생성
  const [q, setQ]  = useState<string | null>(null);
  // 지역 상태 위한 상태 생성
  const [district, setDistrict] = useState<string | null>(null);

  //fetchstore에 함께 넘겨주기 위해 params로 감싸주기 
  const searchParams = {
    q: q,
    district: district,
  };
  // 검색할 때 검색한 값이 들어옴 선택한 구(성복구) 도 들어옴
  // console.log(searchParams)
  // 키값이랑 비동기로 에이피아이 요청을 
  // const { isLoading, isError, data: stores } = useQuery(`stores-${page}`, async() => {
  //   const { data } = await axios(`/api/stores?page=${page}`);
  //   return data as StoreApiResponse;
  // });

 
  const fetchStores = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/stores?page=" + pageParam, {
      params: {
        limit: 10,
        page: pageParam,
        ...searchParams,
      },
    });

    return data;
  };
  

  const {
    data: stores,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
    // 그냥 넘겨줄 경우에 파람스가 벼ㅑㄴ경이 될 때 마다 업데이트가 되지 않을 수 있으니 
    // store 쿼리 키 부분을 어레이 형태로 받아서 서치 파람스를 추가해서 서치 파람스가 업데이트 될 때마다 새로운 요청을 보낼 수 있또록 수정
} = useInfiniteQuery(["stores", searchParams], fetchStores, {
    getNextPageParam: (lastPage: any) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
  });


  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage();
    if (res.isError) {
      console.log(res.error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNext();
      }, 500);
    }

    return () => clearTimeout(timerId);
  }, [fetchNext, isPageEnd, hasNextPage]);

      if(isError) {
        return <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">다시 시도해주세요</div>
      }

     
      return (
        <div className="px-4 md:max-w-4xl mx-auto py-8">
          {/* search filter */}
          <SearchFilter setQ={setQ} setDistrict={setDistrict} />
          <ul role="list" className="divide-y divide-gray-100">
            {isLoading ? (
              <Loading />
            ) : (
              stores?.pages?.map((page, index) => (
                <React.Fragment key={index}>
                  {page.data.map((store: StoreType, i) => (
                     <li className="flex justify-between gap-x-6 py-5" key={i}>
                     <div className="flex gap-x-4">
                       <Image
                         src={
                           store?.category
                             ? `/images/markers/${store?.category}.png`
                             : "/images/markers/default.png"
                         }
                         width={48}
                         height={48}
                         alt="아이콘 이미지"
                       />
                       <div>
                         <div className="text-sm font-semibold leading-6 text-gray-900">
                           {store?.name}
                         </div>
                         <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                           {store?.storeType}
                         </div>
                       </div>
                     </div>
                     <div className="hidden sm:flex sm:flex-col sm:items-end">
                       <div className="text-sm font-semibold leading-6 text-gray-900">
                         {store?.address}
                       </div>
                       <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                         {store?.phone || "번호없음"} | {store?.foodCertifyName} |{" "}
                         {store?.category}
                       </div>
                     </div>
                   </li>
                  ))}
                </React.Fragment>
              ))
            )}
          </ul>
          {/* 페이지 네비게이션
          {stores?.totalPage && (
            <Pagination total={stores?.totalPage} page={page}/>
          )} */}
          {(isFetching || hasNextPage || isFetchingNextPage ) && <Loader />}
          <div className="w-full touch-none h-10 mb-10" ref={ref}></div>
        </div>      
      ); 
     }