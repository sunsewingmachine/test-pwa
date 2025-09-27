'use client';
import { useEffect } from 'react';

export default function SwMount() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => alert('SW registered!'))
        .catch(err => alert('SW failed: ' + err));
    }
  }, []);
  return null;
}
