import MemoryGame from "@/components/MemoryGame";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-[min(10vw,70px)] ">Memory Game</h1>
      <MemoryGame />
    </div>
  );
}
