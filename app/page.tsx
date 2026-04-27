// app/page.tsx
import { PrismaClient } from '@prisma/client';
import ClientTable from './ClientTable';
import RecommendationBox from './RecommendationBox';

const prisma = new PrismaClient();

export default async function Home() {
  const cams = await prisma.cam.findMany({
    include: { manufacturer: true },
    orderBy: { name: 'asc' },
  });

  await prisma.$disconnect();

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">LSCamHub</h1>
        <p className="text-zinc-400 mb-8 text-lg">LS Camshaft Aggregator • Filter by specs or describe your build</p>
        
        {/* AI Recommendation Box */}
        <RecommendationBox initialCams={cams as any} />
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">All Cams • Live Database</h2>
          <ClientTable initialCams={cams as any} />
        </div>
      </div>
    </div>
  );
}