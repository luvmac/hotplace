import React from 'react'
import Link from "next/link"

export default function Home() {
  return (
   <>
         <h1>Map index page</h1>
      <ul>
        <li>
          <Link href="/stores">맛집 목록</Link>
        </li>
        <li>
          <Link href="/stores">맛집 생성</Link>
        </li>
        <li>
          <Link href="/stores">맛집 상세 페이지</Link>
        </li>
        <li>
          <Link href="/stores">맛집 수정 페이지 </Link>
        </li>
        <li>
          <Link href="/stores"> 로그인 페이지 </Link>
        </li>
        <li>
          <Link href="/stores">마이 페이지</Link>
        </li>
        <li>
          <Link href="/stores">찜한 맛집</Link>
        </li>
      </ul>
   </>
   
    
    )
  }
