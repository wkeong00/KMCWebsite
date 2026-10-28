import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Button({
  to,
  href,
  children,
  variant = 'primary',
  arrow = true,
  className = '',
  ...props
}) {
  const content = <>
  {children}
  {arrow && <ArrowRight size={16} aria-hidden="true" />}
  </>;
  const classes = `button button--${variant} ${className}`;
  if (to) return <Link className={classes} to={to} {...props}>
  {content}
  </Link>;
  if (href) return <a className={classes} href={href} {...props}>
  {content}
  </a>;
  return <button type="button" className={classes} {...props}>
  {content}
  </button>;
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}) {
  return <div className="section-heading">
  <div>
    <p className="eyebrow">
      {eyebrow}
    </p>
    <h2>
      {title}
    </h2>
    {description && <p className="lead">
      {description}
    </p>}
  </div>
  {action}
  </div>;
}
export function TextLink({
  to,
  children,
  ...props
}) {
  return <Link className="text-link" to={to} {...props}>
  {children}
  <ArrowRight size={16} aria-hidden="true" />
  </Link>;
}
