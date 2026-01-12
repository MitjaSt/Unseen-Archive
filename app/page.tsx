'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to list page
    router.push('/list');
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Loading...</p>
      <p>If you are not redirected, <a href="/list">click here</a></p>
    </div>
  );
}
