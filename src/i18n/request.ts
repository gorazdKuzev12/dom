import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing'; // Assuming routing is correctly imported

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for the promise to resolve and get the locale

  const locale = await requestLocale;
  // Validate and set a fallback locale
  const finalLocale =
    locale && routing.locales.includes(locale)
      ? locale
      : routing.defaultLocale;

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
    // Other config options
  };
});


// messages: (await import(`../messages/${locale}.json`)).default