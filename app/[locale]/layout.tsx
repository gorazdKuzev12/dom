import { Geist, Geist_Mono } from "next/font/google";
import StyledJsxRegistry from "./registry"; // adjust path if needed
import ApolloWrapper from "@/components/ApolloWraper/page";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
import { GlobalStyle } from "@/styles/GlobalStyles/styles";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const RootLayout = async (props: {
  children:
    | string
    | number
    | bigint
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | Promise<
        | string
        | number
        | bigint
        | boolean
        | ReactPortal
        | ReactElement<unknown, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | null
        | undefined
      >
    | null
    | undefined;
}) => {
  const messages = await getMessages(); // ✅ Locale auto-detected

  return (
    <StyledJsxRegistry>
      <html>
        <body style={{ margin: 0, padding: 0 }}>
          <NextIntlClientProvider messages={messages}>
            <ApolloWrapper>{props.children}</ApolloWrapper>
          </NextIntlClientProvider>
        </body>
      </html>
    </StyledJsxRegistry>
  );
};

export default RootLayout;
