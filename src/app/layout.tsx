import type { Metadata, Viewport } from 'next';
import { Source_Code_Pro, Vazirmatn } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const fontBody = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-body',
});

const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
});

const APP_NAME = "MobinnetMaterial";
const APP_DEFAULT_TITLE = "MobinnetMaterial";
const APP_TITLE_TEMPLATE = "%s - MobinnetMaterial";
const APP_DESCRIPTION = "پلتفرم هوشمند مدیریت موجودی متریال دکل‌ها";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/favicon-32x32.png",
    apple: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/icons/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={cn('font-body antialiased', fontBody.variable, fontCode.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
