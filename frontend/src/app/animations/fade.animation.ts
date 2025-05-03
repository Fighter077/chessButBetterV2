import { trigger, transition, style, animate, AnimationTriggerMetadata } from '@angular/animations';

export function fadeInOut(duration: number = 200): AnimationTriggerMetadata {
    return trigger('fadeInOut', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate(`${duration}ms ease-in`, style({ opacity: 1 }))
        ]),
        transition(':leave', [
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

export const slideLeftRight = trigger('slideLeftRight', [
    transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(`${duration}ms ease-in-out`, style({ transform: 'translateX(0)', opacity: 1 }))
    ]),
    transition(':leave', [
        animate(`${duration}ms ease-in-out`, style({ transform: 'translateX(-100%)', opacity: 0 }))
    ])
]);

export const slideRightLeft = trigger('slideRightLeft', [
    transition(':enter', [
        style({ transform: 'translateX(0%)', opacity: 0 }),
        animate(`${duration}ms ease-in-out`, style({ transform: 'translateX(-100%)', opacity: 1 }))
    ]),
    transition(':leave', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(`${duration}ms ease-in-out`, style({ transform: 'translateX(0%)', opacity: 0 }))
    ])
]);

export const expandCollapse = trigger('expandCollapse', [
    transition(':enter', [
        style({ height: '150px', opacity: 0, overflow: 'hidden' }),
        animate(`${duration}ms ease-out`, style({ height: '*', opacity: 1 }))
    ]),
    transition(':leave', [
        style({ overflow: 'hidden' }),
        animate(`${duration}ms ease-in`, style({ height: '150px', opacity: 0 }))
    ])
]);