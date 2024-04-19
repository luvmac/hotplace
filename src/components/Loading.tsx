export default function Loading() {
  return (
    <>
    {/* tailwind loding할때 빈 박스 보여주기*/}
      <div className="w-full h-20 animate-pulse bg-gray-200 rounded-md"></div>
      {[...Array(10)].map((e, i) => (
          <div 
          className="w-full h-20 e-pulse bg-gray-200 rounded-md mt-2"
          key={i}></div>
      ))}
    </>
  ) 
}