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