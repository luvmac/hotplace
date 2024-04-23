/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";
import { useQuery } from "react-query";
import axios from "axios";
import { CommentApiResponse } from "@/interface";
import CommentList from "./CommentList";
import Pagination from "../Pagination";

interface CommentProps {
  storeId: number;
  page: string;
}

export default function Comments({ storeId, page }: CommentProps) {
  const { status } = useSession();

// fetchCommnet 함수 비동기로 하나 만들어주기
  const fetchComments = async () => {
    const { data } = await axios(
      `/api/comment?storeId=${storeId}&limit=5&page=${page}`
    );
    return data as CommentApiResponse;
  };
// useQuery 사용해서 페칭 ㅠ 댓글작업 힘드라..

// storeId에 따라 쿼리 키가 다르게 들어가야 하기 때문에 이런식으로 적어주기
  const { data: comments, refetch } = useQuery(
    `comment-${storeId}-${page}`,
    fetchComments
  );

  // 코멘트 컴포넌트 따로 만듦 ! ! 이 부분 comment 컴포넌트로

// const {

//    register,

//    handleSubmit,

//    resetField,

//    formState: { errors },

//    } = useForm();

return (
  <div className="md:max-w-2xl py-8 px-2 mb-20 mx-auto">
    {/* comment form */}
    {status === "authenticated" && (
    <CommentForm storeId={storeId} refetch={refetch} />
    )}
    {/* comment list */}
    <CommentList comments={comments} />

    {/* pagination */}
 
        <Pagination
          total={comments?.totalPage}
          page={page}
          pathname={`/stores/${storeId}`}
        />
  
  </div>
);
}