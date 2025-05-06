import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "mk", "sq"],
  defaultLocale: "mk",
  // Add this to force redirection to the default locale when no locale is specified
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
