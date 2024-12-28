
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import "./styles/profilepage.css"
import { SessionProvider } from "next-auth/react"
import { ClerkProvider } from "@clerk/nextjs";
import {ToastContainer} from 'react-toastify'
import Header from "@/components/header/header";
import SubHeader from "@/components/SubHeader/SubHeader";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >


        <SessionProvider>
        <ToastContainer/>
        <Header />
         <SubHeader/>      
        {children}
        <ToastContainer/>
        </SessionProvider>
       
      </body>
    </html>
    </ClerkProvider>
  );
}
