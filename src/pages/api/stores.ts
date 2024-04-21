import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
// import { PrismaClient } from "@prisma/client";
import prisma from "@/db";
import axios from "axios";


interface Responsetype {
  page?: string;
  limit?: string;
  q? : string;
  district?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType | null>
) {
  const { page = "", limit = "", q, district}: Responsetype = req.query;
  // const prisma = new PrismaClient();
  // post 요청 같은 경우에는 request를 받는데  여기서 리퀘스트의 메소드가 포스트인 경우에는 ...
  if(req.method == "POST") {
    // 데이터 생성을 처리한다. 
    const formData = req.body;
    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`
    };
    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        formData.address
        )}`,
        { headers }
    );
    // console.log('@@@@@@@',data, data.documents[0].y, data.documents[0].x);

    const result = await prisma.store.create({
      data: {...formData, lat: data.documents[0].y, lng: data.documents[0].x },
    });
    return res.status(200).json(result);


  } else {
    // 그게 아니라 GET 요청이면 
    if (page) {
      const count = await prisma.store.count();
      const skipPage = parseInt(page) - 1;
      const stores = await prisma.store.findMany({
        orderBy: { id: "asc" },
        where: {
          name: q ? { contains: q } : {},
          address: district ? { contains: district } : {}
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
      const { id }: { id?: string} = req.query;
  
      const stores = await prisma.store.findMany({
        orderBy: { id: "asc" },
        // 만약에 아이디가 있으면 아이디가 같은 데이터를 가져오고
        // 그게 아니면 웨얼문을 무시할 수 있도록 빈 옵션을 넣어주는 쿼리 날리기
        where: {
          id: id ? parseInt(id) : {}
        }
      });
      //만약에 아이디 값이 있는 상세페이지에서 요청이 왔따면
      // 데이터를 하나만 보내주고 그게 아니라면  배열 대이터를 보내줘라
      return res.status(200).json(id ? stores[0] : stores);
    }
  }
  }
  