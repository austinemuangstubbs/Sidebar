import React from 'react';

interface ComponentSearchBarProps {
  /** Current text in the search input */
  value: string;
  /** Called whenever the input changes */
  onChange: (value: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional additional className string(s) */
  className?: string;
}

/**
 * A tiny controlled `<input>` wrapper for searching components by name.
 * It purposely stays absolutely dumb – state is lifted to whatever parent owns it.
 */
const ComponentSearchBar: React.FC<ComponentSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search components…',
  className = '',
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300 ${className}`}
    />
  );
};

export default ComponentSearchBar;