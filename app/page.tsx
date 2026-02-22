"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

export default function RootPage() {
  const router = useRouter();
  const storeToken = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    
    const token = storeToken || Cookies.get('auth-token');

    if (!token) {
      router.push('/login');
    } else {
      router.push('/produtos');
    }
  }, [mounted, storeToken, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="text-primary animate-pulse font-bold">Iniciando aplicação...</div>
    </div>
  );
}