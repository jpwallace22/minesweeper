import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const Svg5 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 76 76"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <use href="#-5_svg__blank" />
    <path
      fill="#840000"
      d="M60.78 32.065c1.765.757 3.006 1.726 3.869 2.922 1.324 1.837 1.736 4.211 1.736 7.139v10.689c0 6.291-2.494 12.48-11.401 13.182H9.497V54.953h39.074a2.852 2.852 0 0 0 2.851-2.85v-6.412a2.853 2.853 0 0 0-2.851-2.852l-39.074.013V9.001h57.006v11.396H26.031v11.668"
    />
  </svg>
);
const ForwardRef = forwardRef(Svg5);
export default ForwardRef;
