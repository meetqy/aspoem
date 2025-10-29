import type { SVGProps } from 'react'

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      {/* Icon from IconPark TwoTone by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE */}
      <defs>
        <mask id="SVGxpa09duy">
          <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="4">
            <path strokeLinejoin="round" d="M22 14s-2.7 5.293-4 12s-1 16-1 16" />
            <path fill="#555" strokeLinejoin="round" d="M33.953 23.272c.346.23.893.391 1.428.503c.932.194 1.792-.446 1.768-1.397c-.045-1.774-.737-4.675-4.258-7.014c-3.325-2.207-6.626-2.238-8.708-1.92c-1.187.18-1.66 1.478-.978 2.467c.608.883 1.316 1.774 1.795 1.945c1 .355 2.203-.582 3.08 0c.876.581.615 1.925 1.492 2.507c.876.582 2.013-.18 2.89.402c.875.582.615 1.925 1.491 2.507M20 17c.858-.286 1.389-1.226 1.686-1.979c.246-.622.026-1.308-.55-1.648c-1.295-.766-4.06-1.814-8.374-.561c-4.265 1.238-5.39 4.056-5.677 5.715a1.33 1.33 0 0 0 1.178 1.565c.56.063 1.176.035 1.544-.277c.807-.685 1.025-1.582 1.927-1.824c.901-.241 1.679.858 2.58.616c.902-.241 1.026-1.582 1.927-1.824c.902-.241 2.26.717 3.76.217M27 6c-2.5 1-5 6-5 8l13-6c-1.38-2.391-5.5-3-8-2" />
            <path fill="#555" strokeLinejoin="round" d="M20 5c4 1.422 3.38 6.609 2 9L10 5.922C11 4 16 3.579 20 5" />
            <path d="M26 35c8.284 0 13 1.79 13 4s-6.716 4-15 4s-15-1.79-15-4c0-.54.4-1.053 1.125-1.523" />
          </g>
        </mask>
      </defs>
      <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGxpa09duy)" />
    </svg>
  )
}
