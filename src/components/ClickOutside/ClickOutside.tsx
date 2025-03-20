import { useEffect, useRef } from 'react';

interface ClickOutsideProps {
  onClick: () => void;
  children: React.ReactNode;
}

const ClickOutside: React.FC<ClickOutsideProps> = ({ children, onClick }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClick]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default ClickOutside; 