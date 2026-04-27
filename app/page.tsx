// app/page.tsx
import { PrismaClient } from '@prisma/client';
import ClientTable from './ClientTable';

const prisma = new PrismaClient();

export default async function Home() {
  const cams = await prisma.cam.findMany({
    include: { manufacturer: true },
    orderBy: { name: 'asc' },
  });

  // Close Prisma connection after fetch
  await prisma.$disconnect();

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">LSCamHub</h1>
        <p className="text-zinc-400 mb-8">LS Camshaft Aggregator • Filter by specs or application</p>
        
        <ClientTable initialCams={cams as any} />
      </div>
    </div>
  );
}