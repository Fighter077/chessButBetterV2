import { UrlSegment, UrlMatchResult } from '@angular/router';
import { supportedLanguages } from './constants/languages.constants';

export function langMatcher(segments: UrlSegment[]): UrlMatchResult | null {
    if (segments.length === 0) return null;

    const lang = segments[0].path;
    if (!supportedLanguages.includes(lang)) return null;

    return {
        consumed: [segments[0], ...segments.slice(1)],
        posParams: {
            lang: segments[0],
            rest: new UrlSegment(segments.slice(1).map(s => s.path).join('/'), {})
        }
    };
}