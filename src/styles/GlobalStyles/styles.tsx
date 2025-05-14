// styles/GlobalStyle.ts
"use client";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* Reset & base layout */

  html, body {
    margin: 0;
    padding: 0 !important; /* ✅ force it */
    overflow-x: hidden; /* ✅ prevents white line */
  }

  /* etc: your color resets, scrollbars, etc */
`;
