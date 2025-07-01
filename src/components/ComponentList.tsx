import React from 'react';

export interface ComponentItem {
  id: string;
  name: string;
  description?: string;
}

interface ComponentListProps {
  /** Data to display */
  components: ComponentItem[];
  /** Search query text */
  search?: string;
  /** Called when a component is clicked */
  onSelect?: (component: ComponentItem) => void;
}

const ComponentList: React.FC<ComponentListProps> = ({
  components,
  search = '',
  onSelect,
}) => {
  const lower = search.trim().toLowerCase();
  const filtered = lower
    ? components.filter((c) => c.name.toLowerCase().includes(lower))
    : components;

  if (!filtered.length) {
    return <p className="p-4 text-sm text-gray-500">No components match.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 overflow-y-auto">
      {filtered.map((c) => (
        <li
          key={c.id}
          className="cursor-pointer px-4 py-2 hover:bg-gray-50"
          onClick={() => onSelect?.(c)}
        >
          <p className="font-medium">{c.name}</p>
          {c.description && (
            <p className="text-xs text-gray-500">{c.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ComponentList;