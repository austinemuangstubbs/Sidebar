import React from 'react';
import { SystemIcons } from '../assets';

// Dynamically generate the list of draggable components from SystemIcons
const colorPalette = [
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
  'bg-yellow-100',
  'bg-red-100',
  'bg-indigo-100',
  'bg-pink-100',
  'bg-gray-100',
];

const systemComponents = Object.keys(SystemIcons).map((id, idx) => {
  const name = id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    id,
    name,
    color: colorPalette[idx % colorPalette.length],
  };
});

interface DraggableComponentProps {
  component: (typeof systemComponents)[0];
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component }) => {
  const IconComponent = SystemIcons[component.id as keyof typeof SystemIcons] as React.FC<React.SVGProps<SVGSVGElement>>;
  const ICON_SIZE = 24; // px – keep all icons same visual footprint

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Only pass serialisable data through the drag event
    const payload = { id: component.id, name: component.name, color: component.color };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(payload));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        border border-gray-300 rounded-lg p-3 bg-white
        flex flex-col items-center justify-center space-y-1
        cursor-grab active:cursor-grabbing
        hover:shadow-md transition-shadow
        aspect-square
      `}
    >
      {/* Icon preview */}
      <IconComponent width={ICON_SIZE} height={ICON_SIZE} className='flex-shrink-0' />
      <span className='text-xs font-medium text-gray-700 text-center'>{component.name}</span>
    </div>
  );
};

const ComponentList: React.FC = () => {
  return (
    <div className='p-4 h-full flex flex-col min-h-0'>
      <h2 className='text-xl font-bold mb-4'>Components</h2>
      <p className='text-gray-600 text-sm mb-4'>
        These are system components you can use to design your architecture
      </p>

      {/*
        Make the list area take up the remaining vertical space and
        scroll independently when its content exceeds that space.
      */}
      <div className='grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-2'>
        {systemComponents.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </div>
    </div>
  );
};

export default ComponentList;
