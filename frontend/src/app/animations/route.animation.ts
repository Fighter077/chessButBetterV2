import {
    trigger,
    transition,
    style,
    query,
    group,
    animate,
  } from '@angular/animations';
  
  export const fadeRouteAnimation = trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          inset: 0,
        })
      ], { optional: true }),
      group([
        query(':leave', [
          style({ opacity: 1 }),
          animate('300ms ease', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          animate('300ms ease', style({ opacity: 1 }))
        ], { optional: true }),
      ])
    ])
  ]);
  