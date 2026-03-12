import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/Toast';
import SkipToContent from '@/components/ui/SkipToContent';
import './globals.css';
import './print.css';

export const metadata: Metadata = {
  title: 'Zeotap Learning Platform',
  description: 'Interactive learning platform for the entire Zeotap organization — technical and non-technical roles',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        <SkipToContent />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
