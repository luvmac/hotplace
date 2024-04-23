import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { LikeInterface, LikeApiResponse } from "@/interface";


interface ResponseType {
  page?: string, limit?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LikeInterface | LikeApiResponse>
) {
  // getServerSession 으로 지금 로그인 중인 세션을 가져오구
  const session = await getServerSession(req, res, authOptions);
  // 세션에 유저가 없는 경우엔 스테이터스 401 날리기
  if(!session?.user) {
    return res.status(401);
  }

  // req메서드 요청이 포스트인 경우에민 찜하기 로직 설정
  if(req.method === 'POST') {
    // 찜하기 로직 처리
    const { storeId } : { storeId: number } = req.body;
    
    // Like 데이터가 있는지 확인
    // findFirst : 가장 첫번째 데이터를 가져올 수 있도록
    // 왜냐면 라이크 데이터는 항상 하나만 있기 때문에
    let like = await prisma.like.findFirst({
      where: {
        storeId,
        userId: session?.user?.id
      },
    });
    // 추가/삭제하는 부분
    // 만약 이미 찜을 했따면, 해당 라이크 데이터 삭제 아니라면 데이터 생성
    if(like) {
      // 이미 찜을 한 상황
      like = await prisma.like.delete({
        where: {
          id: like.id
        },
      });
      // 성공적으로 삭제했다는 뜻의 204 날리기  제이슨으로 생성한 like데이터 넘겨주기
      return res.status(204).json(like);

      // 그게 아닌 경우 : 찜을 하지 않은 상황 !
    } else {
     like = await prisma.like.create({
      data: {
        storeId,
        userId: session?.user?.id
      },
     });
     // 성공적으로 생성했다는 뜻의 201 날려주고 제이슨으로 생성한 like데이터 넘겨주기
     return res.status(201).json(like)
    }
  } else {
    // GET 요청에서도 원하는 데이터를 보낼 수 있도록 추가해주기
    // GET 요청 처리 
    // 찜이 너무 많아질시 곤란하기 때문에 페이지 네이션 구현해주기
    // 리퀘스트 쿼리로 페이지 값을 가져올 수 있기 때문에
    const count = await prisma.like.count({
      where: {
        userId: session.user.id
      }
    });
    const { page="1", limit = "10" }: ResponseType = req.query;
    const skipPage = parseInt(page) -1
    const likes = await prisma.like.findMany({
      orderBy: { 
        // 최신순대로 정렬을 해서 보낼 수 있도록 desc 추가
        createAt: "desc", 
      },
      // 모든 라이크 데이터를 보내쥬는게 아니라 유저가 찜한 라이크 데이터만 보내줘야 하기 때문에
      // userId로 작업!
      where: {
       userId: session.user.id
      },
      include: {
        store: true,
      },
      skip: skipPage * parseInt(limit),
      take:  parseInt(limit)
    });
    // 제이슨 형식으로 데이터 보내쥬기
    return res.status(200).json({
      data: likes,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit))

    })
  }
}