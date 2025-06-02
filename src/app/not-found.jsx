'use client';

import { Ghost } from 'lucide-react';
import { Button } from "@/components/ui/button"; // nếu bạn xài shadcn/ui hoặc custom button riêng
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <Ghost className="w-20 h-20 mb-6 text-blue-500"/>
      <h1 className="text-3xl font-bold mb-2 text-blue-500">Page Not Found</h1>
      <p className="text-black mb-6">
        Sorry, the page you're looking for does not exist.
      </p>
      <Link href="/">
        <Button className="bg-blue-500 hover:bg-blue-600">Go back home</Button>
      </Link>
    </div>
  );
}