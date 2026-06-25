import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    // Initial state of the leaving and entering elements
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0
      })
    ], { optional: true }),
    
    // Group animations to run them in parallel
    group([
      // Leaving element
      query(':leave', [
        animate('0.6s cubic-bezier(0.25, 1, 0.5, 1)', style({
          opacity: 0,
          transform: 'scale(0.95) translateZ(-50px)',
          filter: 'blur(5px)'
        }))
      ], { optional: true }),
      
      // Entering element
      query(':enter', [
        style({ transform: 'scale(1.05) translateZ(50px)', filter: 'blur(5px)', opacity: 0 }),
        animate('0.6s cubic-bezier(0.25, 1, 0.5, 1)', style({
          opacity: 1,
          transform: 'scale(1) translateZ(0)',
          filter: 'blur(0px)'
        }))
      ], { optional: true })
    ])
  ])
]);
