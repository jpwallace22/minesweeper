import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const Svg4 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 76 76"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <use href="#-4_svg__blank" />
    <path
      fill="#000084"
      d="M25.8 9 6.922 42.765h40.662V66l15.975-.363V42.765h5.519V31.873h-5.519V9H47.584v23.236H29.192L41.774 9z"
    />
  </svg>
);
const ForwardRef = forwardRef(Svg4);
export default ForwardRef;
