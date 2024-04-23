import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prisma from "../../db";
import { CommentInterface, CommentApiResponse } from "@/interface";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ResponseType {
  id?: string;
  page?: string;
  limit?: string;
  storeId?: string;
  user?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentInterface | CommentApiResponse>
) {
  // 세션 정해주기 why? 
  // 서버사이드에서 현재 로그인 사용자의 아이디를 가져와야 하기때문에 서버사이드 세션을 통해서 가져와주기
  const session = await getServerSession(req, res, authOptions);
  // const [ page = "1", limit = "10", storeId ] = req.query;
  const {
    id = "",
    page = "1",
    limit = "10",
    storeId = "",
    user = false,
  }: ResponseType = req.query;

  if (req.method === "POST") {
       // 댓글 생성 로직
    // 세션에 유져가 없다면.. 401 날리기
    if (!session?.user) {
      return res.status(401);
    }

    // storeId는 body이기 때문에 number로 넘겨주기
    const { storeId, body }: { storeId: number; body: string } = req.body;
    
    const comment = await prisma.comment.create({
      data: {
        storeId,
        body,
        userId: session?.user.id,
            // createAt은 자동 생성이기 때문에 넣어주지 않아도 된다.
      },
    });
   return res.status(200).json(comment);

  } else if (req.method === "DELETE") {
    // 댓글 삭제 로직
    if (!session?.user || !id) {
      return res.status(401);
    }

    const result = await prisma.comment.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json(result);
  } else {
    // 댓글 가져오기
    const skipPage = parseInt(page) - 1;
    const count = await prisma.comment.count({
      where: {
        storeId: storeId ? parseInt(storeId) : {},
        // 만약에 유저가 있는 경우에 세션의 유저의 아이디를 
        // 그게 아니라면 모든 유저들의 댓글을 가져올 수 있도록 해주기
        userId: user ? session?.user.id : {},
      },
    });
    // 댓글
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        storeId: storeId ? parseInt(storeId) : {},
        // 만약에 유저가 있는 경우에 세션의 유저의 아이디를 
        // 그게 아니라면모든 유저들의 댓글을 가져올 수 있도록 해주기
        userId: user ? session?.user.id : {},
      },
      skip: skipPage * parseInt(limit),
      take: parseInt(limit),
      include: {
        user: true,
        store: true,
      },
    });

    return res.status(200).json({
      data: comments,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit)),
    });
  }
}