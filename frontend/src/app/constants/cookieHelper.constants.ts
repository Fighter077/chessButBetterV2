export function getCookie(cookieHeader:string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...v] = c.trim().split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );

  return cookies[name];
}