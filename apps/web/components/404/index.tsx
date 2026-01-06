export default function NotFound() {
   return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white ">
         <div className="text-center">
            <h1 className="text-6xl font-bold text-black mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-black mb-2">페이지를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
         </div>
      </main>
   );
}
