import { NextResponse, userAgent } from 'next/server';
import { NextRequest } from 'next/server';

type IP = string | undefined;
type GeoData =
    | {
          city?: string | undefined;
          country?: string | undefined;
          region?: string | undefined;
          latitude?: string | undefined;
          longitude?: string | undefined;
      }
    | undefined;
type UA = ReturnType<typeof userAgent>;

const sendLog = (slug: string, ip: IP, geo: GeoData, ua: UA): Promise<void> => {
    const osName = ua.os.name ?? '';
    const osVersion = ua.os.version ?? '';
    const browserName = ua.browser.name ?? '';
    const browserVersion = ua.browser.version ?? '';
    const device = ua.device.type ?? '';
    const city = geo?.city ?? '';
    const country = geo?.country ?? '';
    const trace = `${slug}|${browserName}|${browserVersion}|${osName}|${osVersion}|${device}|${ip}|${city}|${country}`;
    return new Promise((resolve) => {
        console.log(`Statistics: ${trace}`);
        resolve();
    });
};

const getIPFromRequest = (request: NextRequest): IP => {
    if (request.ip) return request.ip;
    if (request.headers.has('x-forwarded-for'))
        return request.headers.get('x-forwarded-for') as string;
    if (request.headers.has('x-real-ip'))
        return request.headers.get('x-real-ip') as string;
    return undefined;
};

export const middleware = (request: NextRequest) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (!/^\/receta\//.test(pathname)) return NextResponse.next();

    const response = NextResponse.next();
    if (/^2\d\d$/.test(`${response.status}`)) {
        const ua = userAgent(request);
        if (ua.isBot) return response;
        if (/^[curl|insomnia]/.test(ua.ua)) return response;

        const ip = getIPFromRequest(request);
        const geo = request.geo;
        const slug = pathname.split('/').pop();
        if (slug === undefined) return response;

        sendLog(slug, ip, geo, ua);
    }

    return response;
};

export const config = {
    matcher: '/receta/:slug*',
};
