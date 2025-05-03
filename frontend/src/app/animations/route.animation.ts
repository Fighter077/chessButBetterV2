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
          width: '100%',
          opacity: 0,
        })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease', style({ opacity: 1 }))
        ], { optional: true }),
      ])
    ])
  ]);
  