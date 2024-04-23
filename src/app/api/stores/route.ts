import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/db";
import axios from "axios";
import { searchState } from "@/atom";


// 이런식으로 가져왔엇던걸....
//   if (req.method === "POST") {
     // 데이터 생성을 처리한다
//     const formData = req.body;
//     const headers = {
//       Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
//     };

//     const { data } = await axios.get(
//       `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
//         formData.address
//       )}`,
//       { headers }
//     );
// next js 에서는 이렇게 가져올 수 있다 
  export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") as string;
  const limit = searchParams.get("limit") as string;
  const q = searchParams.get("q") as string;
  const district = searchParams.get("district") as string;
  const id = searchParams.get("id") as string;

  //next js 에선 authoptions만
  const session = await getServerSession(authOptions);
  
    // GET 요청 처리
    // 페이지 값이 있는 경우에
    if (page) {
      const count = await prisma.store.count();
      // skippage를 따로 생성해서 
      const skipPage = parseInt(page) - 1;
      const stores = await prisma.store.findMany({
        orderBy: { id: "asc" },
        where: {
          name: q ? { contains: q } : {},
          address: district ? { contains: district } : {},
        },
        take: parseInt(limit),
        // 요 스킵 페이지 값의 10이라는 리밋 값을 곱했음
        skip: skipPage * 10,
      });


    //  res.status(200).json({
    //     page: parseInt(page),
    //     data: stores,
    //     totalCount: count,
    //     totalPage: Math.ceil(count / 10),
    //   });

    // 넥스트에선 이런식으로 요청을 보낼 수 있따.
      return NextResponse.json({
        page: parseInt(page),
        data: stores,
        totalCount: count,
        totalPage: Math.ceil(count/10),
      },{
        status: 200
      })

    } else {
      // 아이디 값으로 가져 오는 가게 상세 페이지 데이터에서  현재 로그인된 사용자가 있으면
      // 로그인 된 사용자의 유저 아이디와 매칭이 되는 찜 데이터를 가져와야함
      // 아이디는 상단에 정의를 했으니 지워줘도 된다.
      // const { id }: { id?: string } = req.query;

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


      // return res.status(200).json(id ? stores[0] : stores);
      return NextResponse.json(
        id? stores[0] : stores, {
          status: 200
        });
    }
}

export async function POST(req: Request) {
    // 데이터 생성을 처리한다
    const formData = await req.json();
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

    return NextResponse.json(result, {status:200});
  }

export async function PUT(req: Request) {
  // 데이터 수정을 처리한다
  const formData = await req.json();
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
  return NextResponse.json(result, {
    status: 200
  })
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")
    // 데이터 삭제
    // 아이디가 있을 경우에만 삭제 할 수 있도록 조건문 걸어주기 !
    if (id) {
      const result = await prisma.store.delete({
        where: {
          id: parseInt(id),
        },
      });
      return NextResponse.json(result, {
        status: 200
      });
    }
  return NextResponse.json(null, {
    status: 500
  });
}