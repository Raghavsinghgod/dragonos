import type { ReactNode, HTMLAttributes } from 'react';

interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  children: ReactNode;
}

export function Glass({ strong = false, className = '', children, ...rest }: GlassProps) {
  return (
    <div className={`lgglass${strong ? ' lglass-strong' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </div>
  );
}

export default Glass;
