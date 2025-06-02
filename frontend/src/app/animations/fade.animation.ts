import { trigger, transition, style, animate, AnimationTriggerMetadata, query } from '@angular/animations';

export function fadeInOut(
    duration: number = 200,
    targetOpacity: number = 1,
    absoluteIn: boolean = false,
    absoluteOut: boolean = false,
    triggerName: string = 'fadeInOut'
): AnimationTriggerMetadata {
    return trigger(triggerName, [
        transition(':enter', [
            ...(absoluteIn ? [
                query(':enter', [
                    style({ position: 'absolute', inset: 0, opacity: 0 })
                ], { optional: true })
            ] : []),
            style({ opacity: 0 }),
            animate(`${duration}ms ease-in`, style({ opacity: targetOpacity }))
        ]),
        transition(':leave', [
            ...(absoluteOut ? [
                query(':leave', [
                    style({ position: 'absolute', inset: 0, opacity: 0 })
                ], { optional: true })
            ] : []),
            animate(`${duration}ms ease-out`, style({ opacity: 0 }))
        ])
    ]);
}

export function fadeOut(duration: number = 200): AnimationTriggerMetadata {
    return trigger('fadeOut', [
        transition(':leave', [
            animate(`${duration}ms ease-out`, style({ opacity: 0 }))
        ])
    ]);
}

const duration = 300;

export function slideLeftRight(distance: number = 100, timing: 'ease-in-out' | 'both' = 'ease-in-out'): AnimationTriggerMetadata {
    const timingIn = timing === 'ease-in-out' ? 'ease-in-out' : 'ease-out';
    const timingOut = timing === 'ease-in-out' ? 'ease-in-out' : 'ease-out';
    return trigger('slideLeftRight', [
        transition(':enter', [
            style({ transform: `translateX(-${distance}%)`, opacity: 0 }),
            animate(`${duration}ms ${timingIn}`, style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
            animate(`${duration}ms ${timingOut}`, style({ transform: `translateX(-${distance}%)`, opacity: 0 }))
        ])
    ]);
}

export function slideRightLeft(distance: number = 100, timing: 'ease-in-out' | 'both' = 'ease-in-out'): AnimationTriggerMetadata {
    const timingIn = timing === 'ease-in-out' ? 'ease-in-out' : 'ease-out';
    const timingOut = timing === 'ease-in-out' ? 'ease-in-out' : 'ease-out';
    return trigger('slideRightLeft', [
        transition(':enter', [
            style({ transform: 'translateX(0%)', opacity: 0 }),
            animate(`${duration}ms ${timingIn}`, style({ transform: `translateX(-${distance}%)`, opacity: 1 }))
        ]),
        transition(':leave', [
            style({ transform: `translateX(-${distance}%)`, opacity: 0 }),
            animate(`${duration}ms ${timingOut}`, style({ transform: 'translateX(0%)', opacity: 0 }))
        ])
    ]);
}

export function expandCollapse(orientation: 'vertical' | 'horizontal' = 'horizontal', baseValue: number = 0, timing: 'ease-in-out' | 'both' = 'both'): AnimationTriggerMetadata {
    const timingIn = timing === 'ease-in-out' ? 'ease-in-out' : 'ease-out';
    const timingOut = timing === 'ease-in-out' ? 'ease-in-out' : 'ease-out';
    const toChange = orientation === 'horizontal' ? 'height' : 'width';
    return trigger('expandCollapse', [
        transition(':enter', [
            style({ [toChange]: `${baseValue}px`, opacity: 0, overflow: 'hidden' }),
            animate(`${duration}ms ${timingIn}`, style({ [toChange]: '*', opacity: 1 }))
        ]),
        transition(':leave', [
            style({ overflow: 'hidden' }),
            animate(`${duration}ms ${timingOut}`, style({ [toChange]: `${baseValue}px`, opacity: 0 }))
        ])
    ]);
}