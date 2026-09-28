import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'AIIA Clinical Trial Management System | Ministry of Ayush',
  description: 'Enterprise Cloud CTMS and National Pharmacovigilance Coordination Centre (NPvCC) Platform for All India Institute of Ayurveda. SIH 2026 Problem Statement SIH26046.',
  keywords: [
    'AIIA',
    'Ayurveda Clinical Trials',
    'CTMS',
    'Pharmacovigilance',
    'NPvCC',
    'Ministry of Ayush',
    'CDISC',
    'FHIR',
    'GCP-ASU',
    'ALCOA+'
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-800 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
