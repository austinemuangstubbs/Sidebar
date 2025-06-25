import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import Board from './components/Board';

// App will render the sidebar on the left and the board on the right (probably 3/4 of the entire app)
function App() {
  // create a useState to keep track of placed components on board
  const [placedComponents, setPlacedComponents] = useState<any[]>([]);

  //handler to delete componnet
  const onDeleteComponent = (uniqueId: string) => {
    setPlacedComponents((prev) =>
      prev.filter((component) => component.uniqueId !== uniqueId)
    );
  };

  // create a handler function to track component being dragged
  const handleDragEnd = (event: any) => {
    //the active tracks what we're dragging, and over tracks where we dropped it
    const { active, over } = event;

    //check to make sure we're in a valid dropzone
    if (over && over.id === 'system-board') {
      const component = active.data.current?.component;
      const componentType = active.data.current?.type;

      // checlk to see if we're dragging a new component from list ('component')
      if (componentType === 'component') {
        // Get the SystemBoard element to calculate relative position
        const systemBoardElement = document.querySelector(
          '.system-board-container'
        );
        if (systemBoardElement) {
          const rect = systemBoardElement.getBoundingClientRect();

          // Get mouse position and calculate final drop position
          const mouseX = event.activatorEvent?.clientX || 0;
          const mouseY = event.activatorEvent?.clientY || 0;
          const finalX = mouseX + (event.delta?.x || 0);
          const finalY = mouseY + (event.delta?.y || 0);

          // Calculate position relative to SystemBoard
          const relativeX = finalX - rect.left;
          const relativeY = finalY - rect.top;
          const dropX = Math.max(10, relativeX - 60);
          const dropY = Math.max(10, relativeY - 20);

          const newComponent = {
            ...component,
            uniqueId: `${component.id}-${Date.now()}`,
            x: dropX,
            y: dropY,
          };
          setPlacedComponents((prev) => [...prev, newComponent]);
        }
      } // check if we're draggin an existing placed component ('placed-component')
      else if (componentType === 'placed-component') {
        // Handle repositioning of EXISTING placed components
        if (event.delta) {
          setPlacedComponents((prev) =>
            prev.map((comp) =>
              comp.uniqueId === component.uniqueId
                ? {
                    ...comp,
                    x: Math.max(10, comp.x + event.delta.x),
                    y: Math.max(10, comp.y + event.delta.y),
                  }
                : comp
            )
          );
        }
      }
    }
  };
  //ensure that component is dropped on a valid dropzone
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='flex flex-col h-screen bg-gray-100 game-container'>
        <header className='h-48 bg-white border-b border-gray-200 flex items-center justify-between px-4 app-header'>
          <div className='font-bold text-5xl text-blue-600 app-name'>
            Sidebar
          </div>
          <div className='flex items-center space-x-4 user-controls'>
            <button className='text-gray-600 hover:text-gray-800'>
              <span className='text-sm'>Settings</span>
            </button>
          </div>
        </header>

        <div className='flex flex-1 main-content'>
          <div className='w-1/4 bg-white border-r border-gray-200 sidebar-border'>
            <Sidebar />
          </div>
          <div className='w-3/4 board-border'>
            <Board
              placedComponents={placedComponents}
              onDeleteComponent={onDeleteComponent}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
export default App;
