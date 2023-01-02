import React from "react";

export const CodeIcon: React.FC<{
  className?: string;
  width: number;
  height: number;
}> = ({ className, width, height }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.35"
        d="M33.1431 40.0752H6.85674C3.22704 40.0752 0.285156 37.1334 0.285156 33.5037V9.40784H39.7147V33.5037C39.7147 37.1334 36.7728 40.0752 33.1431 40.0752Z"
        fill="white"
      />
      <path
        d="M39.7147 9.40784H0.285156V7.21731C0.285156 3.5876 3.22704 0.645721 6.85674 0.645721H33.1431C36.7728 0.645721 39.7147 3.5876 39.7147 7.21731V9.40784Z"
        fill="white"
      />
      <path
        d="M17.8116 35.6942C17.6342 35.6942 17.4567 35.6745 17.2771 35.6285C16.103 35.3349 15.3911 34.1455 15.6824 32.9713L20.0635 15.4471C20.357 14.273 21.5508 13.5633 22.7206 13.8524C23.8947 14.1459 24.6066 15.3354 24.3153 16.5095L19.9342 34.0338C19.6845 35.0304 18.793 35.6942 17.8116 35.6942Z"
        fill="white"
      />
      <path
        d="M28.7624 31.3131C28.2016 31.3131 27.6408 31.0984 27.2137 30.6713C26.3572 29.8148 26.3572 28.4304 27.2137 27.5739L30.046 24.7415L27.2137 21.9092C26.3572 21.0527 26.3572 19.6682 27.2137 18.8117C28.0702 17.9552 29.4546 17.9552 30.3111 18.8117L34.6921 23.1928C35.5486 24.0493 35.5486 25.4337 34.6921 26.2902L30.3111 30.6713C29.8839 31.0984 29.3231 31.3131 28.7624 31.3131Z"
        fill="white"
      />
      <path
        d="M11.2377 31.3131C10.6769 31.3131 10.1161 31.0984 9.68896 30.6713L5.3079 26.2902C4.4514 25.4337 4.4514 24.0493 5.3079 23.1928L9.68896 18.8117C10.5455 17.9552 11.9299 17.9552 12.7864 18.8117C13.6429 19.6682 13.6429 21.0527 12.7864 21.9092L9.95401 24.7415L12.7864 27.5739C13.6429 28.4304 13.6429 29.8148 12.7864 30.6713C12.3592 31.0984 11.7984 31.3131 11.2377 31.3131Z"
        fill="white"
      />
    </svg>
  );
};
