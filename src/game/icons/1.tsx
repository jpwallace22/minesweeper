import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const Svg1 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 76 76"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <use href="#-1_svg__blank" />
    <path
      fill="#00F"
      d="M40.857 8.928 18 26.071v5.714h14.286v22.859H18v11.427h40V54.644H46.571V8.928z"
    />
  </svg>
);
const ForwardRef = forwardRef(Svg1);
export default ForwardRef;
