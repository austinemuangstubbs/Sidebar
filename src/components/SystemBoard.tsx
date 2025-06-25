import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';

interface SystemBoardProps {
  placedComponents: any[];
  onDeleteComponent: (uniqueId: string) => void;
}

interface PlacedDraggableComponentProps {
  component: any;
  onDelete: (uniqueId: string) => void;
}

const PlacedDraggableComponent: React.FC<PlacedDraggableComponentProps> = ({
  component,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: component.uniqueId,
      data: {
        type: 'placed-component',
        component,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(component.uniqueId);
  };
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        left: `${component.x}px`,
        top: `${component.y}px`,
      }}
      className={`
        ${component.color} 
        border border-gray-400 rounded-lg p-2 absolute
        flex items-center space-x-1 shadow-md min-w-[120px]
        hover:shadow-lg transition-shadow cursor-move
        ${isDragging ? 'opacity-50 z-50' : 'z-10'}
      `}
    >
      <button
        onClick={handleDelete}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className='
          absolute -top-2 -right-2 w-5 h-5 
          bg-red-500 hover:bg-purple-600 
          text-white text-xs rounded-full 
          flex items-center justify-center
          shadow-md hover:shadow-lg
          transition-all duration-200
           cursor-pointer z-20
        '
        title='Delete component'
      >
        ×
      </button>
      <div
        {...listeners}
        {...attributes}
        className='flex items-center space-x-1 flex-1 cursor-move'
      >
        <span className='text-sm'>{component.icon}</span>
        <span className='text-xs font-medium text-gray-700'>
          {component.name}
        </span>
      </div>
    </div>
  );
};

const SystemBoard: React.FC<SystemBoardProps> = ({
  placedComponents,
  onDeleteComponent,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'system-board',
  });
  return (
    <div
      ref={setNodeRef}
      className={`
        h-full border-2 border-dashed rounded-lg 
        flex items-center justify-center system-board-container relative
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
      `}
    >
      {placedComponents.length === 0 && (
        <p className='text-gray-500 system-board-placeholder-text'>
          {isOver
            ? 'Drop component here!'
            : 'This is the system board area where components will be placed'}
        </p>
      )}

      {/* Render placed components as draggable */}
      {placedComponents.map((component) => (
        <PlacedDraggableComponent
          key={component.uniqueId}
          component={component}
          onDelete={onDeleteComponent}
        />
      ))}
    </div>
  );
};

export default SystemBoard;
