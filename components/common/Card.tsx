
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Add style prop to allow inline styles.
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 md:p-8 ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;