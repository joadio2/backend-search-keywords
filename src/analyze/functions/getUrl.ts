export const getUrl = (originalUrl: string): string => {
  try {
    const parsedUrl = new URL(originalUrl);
    if (
      parsedUrl.hostname.includes('google.com') &&
      parsedUrl.pathname === '/url'
    ) {
      const realUrl = parsedUrl.searchParams.get('url');
      if (realUrl) {
        return decodeURIComponent(realUrl);
      }
    }
  } catch (err) {
    console.warn('No se pudo parsear la URL:', originalUrl);
  }
  return originalUrl;
};
