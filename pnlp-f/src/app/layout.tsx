'use client';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';
import "./globals.css";

// Load Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 10, 
        width: '100%', 
        backgroundColor: 'white', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        borderBottom: '1px solid #e0e0e0', 
        padding: '16px 32px', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>FreightHub</span>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <title>FreightHub</title>
        <meta name="description" content="FreightHub Table Demo" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BaseLayout>{children}</BaseLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
