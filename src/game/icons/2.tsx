import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const Svg2 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 76 76"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <use href="#-2_svg__blank" />
    <path
      fill="#008200"
      d="M51.256 26.134v-4.545c0-1.545-1.293-2.796-2.892-2.796H27.393c-1.593 0-2.892 1.251-2.892 2.796v4.545H8.593v-5.942C8.593 14.011 13.778 9 20.163 9h35.433c6.388 0 11.569 5.011 11.569 11.191 0 4.064 1.287 8.448-2.521 11.417-2.649 2.062-5.948 3.822-8.757 5.743-6.993 4.777-14.083 9.431-21.093 14.188-.91.621-3.707 3.276-4.87 3.276h37.602V66H8.774c0-4.529-1.605-9.863 2.609-13.253 2.949-2.372 6.773-4.315 9.932-6.502 8-5.557 16.259-10.779 24.287-16.306.586-.404 5.654-3.065 5.654-3.805"
    />
  </svg>
);
const ForwardRef = forwardRef(Svg2);
export default ForwardRef;
