import { cn } from '@/lib/cn';

/**
 * The Meeting BaaS mark, animated.
 *
 * Same idea as the landing site's mark — the fish is four vertical slices that
 * undulate on staggered phases so it reads as *swimming* — but implemented in
 * pure CSS so the docs app needs no animation runtime and the mark can render
 * from a server component.
 */

const SLICES = [
  {
    // Tail
    d: 'M8.90332 29.3686V18.6348C10.8143 18.6348 15.085 21.0376 15.085 23.999C15.085 26.9604 10.8143 29.3633 8.90332 29.3633V29.3686Z',
    fill: 'fill-fd-primary',
    animation: 'var(--animate-swim-1)',
  },
  {
    // Rear body
    d: 'M20.2399 33.4182H15.7158V14.5801H20.2399C21.6886 14.5801 22.8619 16.2294 22.8619 18.2634V29.7402C22.8619 31.7742 21.6886 33.4235 20.2399 33.4235V33.4182Z',
    fill: 'fill-baas-neutral-50',
    animation: 'var(--animate-swim-2)',
  },
  {
    // Fore body
    d: 'M23.8086 13.0098H27.8749C29.577 13.0098 30.9546 14.6486 30.9546 16.6615V31.3368C30.9546 33.355 29.5725 34.9885 27.8749 34.9885H23.8086V13.0098Z',
    fill: 'fill-baas-neutral-50',
    animation: 'var(--animate-swim-3)',
  },
  {
    // Head + eye
    d: 'M37.4431 18.4711C35.5455 17.0642 33.2924 16.1895 31.9014 16.1895V31.808C33.2924 31.808 35.5455 30.9333 37.4431 29.5158C39.3407 28.1089 40.9006 26.1539 40.9006 23.9987C40.9006 21.8435 39.3451 19.8886 37.4431 18.4711ZM35.7366 22.6129C35.19 22.6129 34.75 21.9911 34.75 21.227C34.75 20.463 35.19 19.8412 35.7366 19.8412C36.2832 19.8412 36.7143 20.463 36.7143 21.227C36.7143 21.9911 36.2743 22.6129 35.7366 22.6129Z',
    fill: 'fill-fd-primary',
    animation: 'var(--animate-swim-4)',
  },
] as const;

const BUBBLES = [
  { cx: 45.04, cy: 12.98, r: 2.33, delay: '0s' },
  { cx: 43.5, cy: 23.6, r: 1.6, delay: '0.9s' },
  { cx: 46.8, cy: 19.2, r: 0.9, delay: '1.7s' },
] as const;

export function LogoMark({
  className,
  still = false,
  ...props
}: React.ComponentProps<'svg'> & { still?: boolean }) {
  return (
    <svg
      role="img"
      viewBox="0 0 49 48"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('fill-none', className)}
      {...props}
    >
      <title>Meeting BaaS</title>

      <circle
        cx="24.9017"
        cy="23.9979"
        r="23.9"
        className="fill-baas-black dark:fill-transparent"
      />

      {SLICES.map((slice) => (
        <path
          key={slice.d.slice(0, 12)}
          d={slice.d}
          className={slice.fill}
          style={still ? undefined : { animation: slice.animation }}
        />
      ))}

      {!still &&
        BUBBLES.map((b) => (
          <circle
            key={`${b.cx}-${b.cy}`}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            className="fill-fd-primary dark:fill-baas-neutral-50"
            style={{
              transformOrigin: `${b.cx}px ${b.cy}px`,
              animation: `blow 3s ${b.delay} ease-in-out infinite`,
            }}
          />
        ))}
    </svg>
  );
}
