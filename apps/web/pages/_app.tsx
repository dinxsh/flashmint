import React from 'react';
import type { AppProps } from 'next/app';
import { MiniKitProvider } from '@minikit/core/react';
import { useEffect } from 'react';
import { initPostHog } from '../lib/posthog';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <MiniKitProvider>
      <Component {...pageProps} />
    </MiniKitProvider>
  );
} 