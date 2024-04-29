import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/utils/React-query";
import Sidebars from "./_components/Sidebars";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const clientId:string = process.env.GOOGLE_CLIENT_ID!

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={clientId} >
        <ReactQueryProvider>
          <Sidebars>
          {children}
         </Sidebars>
         </ReactQueryProvider>
        </GoogleOAuthProvider>
        <Toaster/>
        </body>
    </html>
  );
}
