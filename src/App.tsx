import React from 'react';
import Sidebar from './components/Sidebar';
import Board from './components/Board';

// App renders the sidebar on the left and the board on the right
function App() {
  return (
    <div className='flex flex-col h-screen bg-gray-100 game-container'>
      <header className='h-48 bg-white border-b border-gray-200 flex items-center justify-between px-4 app-header'>
        <div className='font-bold text-5xl text-blue-600 app-name'>Sidebar</div>
        <div className='flex items-center space-x-4 user-controls'>
          <button className='text-gray-600 hover:text-gray-800'>
            <span className='text-sm'>Settings</span>
          </button>
        </div>
      </header>

      <div className='flex flex-1 overflow-hidden main-content'>
        <div className='w-1/4 bg-white border-r border-gray-200 overflow-hidden sidebar-border'>
          <Sidebar />
        </div>
        <div className='w-3/4 board-border'>
          <Board />
        </div>
      </div>
    </div>
  );
}
export default App;
