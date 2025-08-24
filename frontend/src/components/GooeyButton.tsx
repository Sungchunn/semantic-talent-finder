import React from 'react';
import './GooeyButton.css';

interface GooeyButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'dashboard';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  wide?: boolean;
  iconOnly?: boolean;
  active?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  title?: string;
}

export const GooeyButton: React.FC<GooeyButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  wide = false,
  iconOnly = false,
  active = false,
  href,
  target,
  rel,
  title
}) => {
  const baseClasses = [
    'gooey-button',
    variant,
    size !== 'medium' && size,
    wide && 'wide',
    iconOnly && 'icon-only',
    disabled && 'disabled',
    active && 'active',
    className
  ].filter(Boolean).join(' ');

  const commonProps = {
    className: baseClasses,
    disabled,
    'aria-disabled': disabled,
    title,
  };

  if (href && !disabled) {
    return (
      <a
        {...commonProps}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as any}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...commonProps}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface GooeyButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  connected?: boolean;
  stack?: boolean;
}

export const GooeyButtonGroup: React.FC<GooeyButtonGroupProps> = ({
  children,
  className = '',
  connected = false,
  stack = false
}) => {
  const classes = [
    'gooey-button-group',
    connected && 'connected',
    stack && 'stack',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// Pre-configured button variants for common use cases
export const ExcelActionButton: React.FC<Omit<GooeyButtonProps, 'variant'>> = (props) => (
  <GooeyButton {...props} variant="primary" className={`excel-action-button ${props.className || ''}`} />
);

export const ExcelExportButton: React.FC<Omit<GooeyButtonProps, 'variant'>> = (props) => (
  <GooeyButton {...props} variant="primary" className={`excel-export-button ${props.className || ''}`} />
);

export const ExcelFilterButton: React.FC<Omit<GooeyButtonProps, 'variant'>> = (props) => (
  <GooeyButton {...props} variant="primary" className={`excel-filter-button ${props.className || ''}`} />
);

export const DashboardButton: React.FC<GooeyButtonProps> = (props) => (
  <GooeyButton {...props} variant={props.variant || "dashboard"} className={`dashboard-button ${props.className || ''}`} />
);