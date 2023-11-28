import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const Svg3 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 76 76"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <use href="#-3_svg__blank" />
    <path
      fill="red"
      d="M66.322 20.4c0-6.295-5.104-11.4-11.4-11.4H9.678v10.688H48.51a2.849 2.849 0 0 1 2.85 2.85v6.413a2.852 2.852 0 0 1-2.85 2.85H26.778v12.825H48.51a2.848 2.848 0 0 1 2.85 2.85v6.413a2.852 2.852 0 0 1-2.85 2.85H9.678V66h45.244c6.296 0 11.4-5.11 11.4-11.4V43.912a11.33 11.33 0 0 0-1.977-6.412 11.352 11.352 0 0 0 1.977-6.413z"
    />
  </svg>
);
const ForwardRef = forwardRef(Svg3);
export default ForwardRef;
