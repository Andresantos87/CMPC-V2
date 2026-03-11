import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Digital PTW Logo</title>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function CMPCLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <title>CMPC Logo</title>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="30"
        fontWeight="bold"
        fill="#005EB8"
      >
        CMPC
      </text>
    </svg>
  );
}

export function EldoradoLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <title>Eldorado Logo</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 0C22.38 0 0 22.38 0 50s22.38 50 50 50c2.75 0 5.42-.22 8.01-.64C41.1 94.94 25 74.45 25 50c0-18.14 9.46-33.86 23.2-42.54A49.88 49.88 0 0 0 50 0zm42.94 58.01C97.5 45.41 91.56 34.19 83.3 25.93c-4.83 8.4-11.83 15.4-20.23 20.23 8.4 4.83 15.4 11.83 20.23 20.23 2.92-3.47 5.25-7.44 6.64-11.82zM56.4 51.8c-4.8-8.4-4.8-18.42 0-26.82C64.8 33.38 71.8 40.38 76.63 48.78c-4.83-8.4-11.83-15.4-20.23-20.23z"
        style={{ color: '#82C341' }}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M58.01 92.94c-8.4 4.83-18.42 4.83-26.82 0C39.6 84.54 46.6 77.54 51.43 69.14c-4.83 8.4-4.83 18.42 0 26.82 2.22-1.27 4.3-2.76 6.22-4.46-1.92 1.7-3.99 3.19-6.21 4.44z"
        style={{ color: '#00A651' }}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M99.36 41.99C94.94 25.08 79.92 10.06 63.01 5.64c3.47 2.92 7.44 5.25 11.82 6.64-15.65 4.86-26.87 16.08-31.73 31.73-4.86 15.65-16.08 26.87-31.73 31.73C16.23 80.6 19.34 84.9 23.4 88.2c15.65-4.86 26.87-16.08 31.73-31.73 4.86-15.65 16.08-26.87 31.73-31.73 4.06 3.29 7.17 7.6 8.5 12.44a50.08 50.08 0 0 0-8.5-12.45c.01 0 .01 0 .01-.01z"
        style={{ color: '#005EB8' }}
      ></path>
    </svg>
  );
}
