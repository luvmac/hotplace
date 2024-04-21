import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "../../interface";
import prisma from "../../db";
import axios from "axios";

interface Responsetype {
  page?: string;
  limit?: string;
  q?: string;
  district?: string;
  id?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType | null>
) {
  // 딜리트 메소드 요청으 ㄹ위한 id 값 쿼리로 받기 위해서 id 추가 
  const { page = "", limit = "", q, district, id }: Responsetype = req.query;
  //세션생성
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    // 데이터 생성을 처리한다
    const formData = req.body;
    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
    };

    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        formData.address
      )}`,
      { headers }
    );

    const result = await prisma.store.create({
      data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
    });

    return res.status(200).json(result);


  } else if (req.method === "PUT") {
    // 데이터 수정을 처리한다
    const formData = req.body;
    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
    };

    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        formData.address
      )}`,
      { headers }
    );

    const result = await prisma.store.update({
      where: { id: formData.id },
      data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
    });

    return res.status(200).json(result);
  } else if (req.method === "DELETE") {
    // 데이터 삭제
    // 아이디가 있을 경우에만 삭제 할 수 있도록 조건문 걸어주기 !
    if (id) {
      const result = await prisma.store.delete({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(200).json(result);
    }
    return res.status(500).json(null);
  } else {
    // GET 요청 처리
    if (page) {
      const count = await prisma.store.count();
      const skipPage = parseInt(page) - 1;
      const stores = await prisma.store.findMany({
        orderBy: { id: "asc" },
        where: {
          name: q ? { contains: q } : {},
          address: district ? { contains: district } : {},
        },
        take: parseInt(limit),
        skip: skipPage * 10,
      });

      res.status(200).json({
        page: parseInt(page),
        data: stores,
        totalCount: count,
        totalPage: Math.ceil(count / 10),
      });
    } else {
      // 아이디 값으로 가져 오는 가게 상세 페이지 데이터에서  현재 로그인된 사용자가 있으면
      // 로그인 된 사용자의 유저 아이디와 매칭이 되는 찜 데이터를 가져와야함
      const { id }: { id?: string } = req.query;

      const stores = await prisma.store.findMany({
        orderBy: { id: "asc" },
        where: {
          id: id ? parseInt(id) : {},
        },
        // 포함햐고싶은 데이터인
        include: {
          //어떤 라이크를 가져오느냐? where을 통해서
          likes: {
            // 세션아 로그인이 된 경우에는 ? userId: session.user.id
            where: session ? {
              userId: session.user.id
              // 그게 아닌 경우에는?
            }: {
              // 빈 쿼리 날리기 
            }
          }
        }
      });


      return res.status(200).json(id ? stores[0] : stores);
    }
  }
}