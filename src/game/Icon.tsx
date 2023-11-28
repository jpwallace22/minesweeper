import * as icons from './icons';
import React, { SVGProps } from 'react';

export type IconId = keyof typeof icons;
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  icon: IconId;
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function render({ icon, ...props }, ref) {
  const Component = icons[icon as IconId];

  return <Component ref={ref} {...props} />;
});
