import {
  trigger,
  transition,
  style,
  query,
  group,
  animate
} from '@angular/animations';
import { RouterOutlet } from '@angular/router';

const duration = 300;
const translateX = 30;
const translateY = 30;

/* ---------- small helpers ---------- */

function major(state: string | undefined) {      //  "1-2"  -> 1
  return state ? +state.split('-')[0] : 0;
}
function minor(state: string | undefined) {      //  "1-2"  -> 2
  return state ? +state.split('-')[1] : 0;
}

/* ---------- reusable slide builders ---------- */

function hSlide(ltr: boolean): any {
  const enterFrom = ltr ? `${translateX}%` : `-${translateX}%`;
  const leaveTo   = ltr ? `-${translateX}%` : `${translateX}%`;

  return shared(enterFrom, leaveTo);
}

function vSlide(upward: boolean): any {
  const enterFrom = upward ? `${translateY}%`  : `-${translateY}%`;
  const leaveTo   = upward ? `-${translateY}%` : `${translateY}%`;

  return shared(enterFrom, leaveTo, 'translateY');
}

function shared(
  enterFrom: string,
  leaveTo: string,
  axis: 'translateX' | 'translateY' = 'translateX'
): any {

  return [
    query(':enter, :leave', [
      style({ position: 'absolute', inset: 0 })
    ], { optional: true }),

    group([
      query(':leave', [
        style({ transform: `${axis}(0)`, opacity: 1 }),
        animate(`${duration}ms ease`, style({ transform: `${axis}(${leaveTo})`,
                                      opacity: 0 }))
      ], { optional: true }),

      query(':enter', [
        style({ transform: `${axis}(${enterFrom})`, opacity: 0 }),
        animate(`${duration}ms ease`, style({ transform: `${axis}(0)`, opacity: 1 }))
      ], { optional: true })
    ])
  ];
}

/* ---------- the trigger ---------- */

export const settingsAnim = trigger('routeAnimations', [

  /* 1) horizontal slide – major depth increases (0->1 etc.) */
  transition(
    (from, to) => major(to) > major(from),
    hSlide(true)                                   // slide left
  ),

  /* 2) horizontal slide – major depth decreases (1->0 etc.) */
  transition(
    (from, to) => major(to) < major(from),
    hSlide(false)                                  // slide right
  ),

  /* 3) vertical slide – same major, minor increases (1-0 -> 1-1) */
  transition(
    (from, to) => major(to) === major(from) && minor(to) > minor(from),
    vSlide(true)                                   // slide up
  ),

  /* 4) vertical slide – same major, minor decreases (1-2 -> 1-1) */
  transition(
    (from, to) => major(to) === major(from) && minor(to) < minor(from),
    vSlide(false)                                  // slide down
  )
]);

const fade: any = [
  query(':enter, :leave', [
    style({ position: 'absolute', inset: 0 })
  ], { optional: true }),

  group([
    query(':leave', [
      style({ opacity: 1 }),
      animate(`${duration}ms ease`, style({ opacity: 0 }))
    ], { optional: true }),

    query(':enter', [
      style({ opacity: 0 }),
      animate(`${duration}ms ease`, style({ opacity: 1 }))
    ], { optional: true })
  ])
];

export const fadeRouteAnimation = trigger('routeAnimations', [
  transition('* <=> *', fade)
]);

function slide(ltr: boolean): any[] {
  // ltr = true  → slide left (new comes from right)
  // ltr = false → slide right (new comes from left)
  const enterFrom = ltr ? `${translateX}%` : `-${translateX}%`;
  const leaveTo = ltr ? `-${translateX}%` : `${translateX}%`;

  return [
    query(':enter, :leave', [
      style({ position: 'absolute', inset: 0 })
    ], { optional: true }),

    group([
      query(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate(`${duration}ms ease`, style({
          transform: `translateX(${leaveTo})`,
          opacity: 0
        }))
      ], { optional: true }),

      query(':enter', [
        style({ transform: `translateX(${enterFrom})`, opacity: 0 }),
        animate(`${duration}ms ease`, style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true })
    ])
  ];
}

export const slideRouteAnimation = trigger('routeAnimations', [
  transition(':increment', slide(true)),
  transition(':decrement', slide(false)),
]);

export const getRouteAnimationData = (outlet: RouterOutlet) => {
  return outlet?.isActivated
    ? outlet.activatedRouteData['animation']
    : 0;
}