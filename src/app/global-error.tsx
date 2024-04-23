"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
      <div className="w-full h-screen mx-auto pt-[10%] text-black text-center font-semibold">
        다시 시도해주세요
      </div>
        <h2>error handleling</h2>
        <button 
        onClick={() => reset()}
        className="mt-4 mx-auto bg-red-600 text-white px-4 py-2.5 rounded-md horver:bg-red-500">try again</button>
      </body>
    </html>
  )
}