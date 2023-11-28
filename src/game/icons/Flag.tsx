import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFlag = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="5 5 65 65"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <path d="M35.999 55.5v-39H40v39z" />
    <path fill="red" d="M40 13.875 19.375 27 40 40.125z" />
    <path d="M28.571 51.625h18.857v5.5H28.571z" />
    <path d="M20.222 56.459h35.555V63.5H20.222z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFlag);
export default ForwardRef;
