import React, { useState } from 'react';
import ComponentSearchBar from './ComponentSearchBar';
import ComponentList, { ComponentItem } from './ComponentList';

// Temporary mock data – replace with real fetch/data later
const MOCK_COMPONENTS: ComponentItem[] = [
  { id: 'button', name: 'Button', description: 'Clickable UI button' },
  { id: 'input', name: 'Input', description: 'Text input field' },
  { id: 'card', name: 'Card', description: 'Container with shadow' },
  { id: 'modal', name: 'Modal', description: 'Dialog overlay' },
  { id: 'table', name: 'Table', description: 'Tabular display' },
];

interface SidebarProps {
  onSelectComponent?: (c: ComponentItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectComponent }) => {
  const [query, setQuery] = useState('');

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="p-3">
        <ComponentSearchBar value={query} onChange={setQuery} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ComponentList
          components={MOCK_COMPONENTS}
          search={query}
          onSelect={onSelectComponent}
        />
      </div>
    </aside>
  );
};

export default Sidebar;