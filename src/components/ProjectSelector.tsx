import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const ProjectSelector: React.FC = () => {
  const { 
    currentProject, 
    setCurrentProject, 
    projects, 
    createProject, 
    isLoading 
  } = useProject();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    try {
      await createProject(newProjectName.trim(), 'New system design project');
      setNewProjectName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="relative">
      {/* Current Project Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
      >
        <span className="text-sm font-medium">
          {currentProject ? currentProject.name : 'Select Project'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50">
          <div className="p-2">
            {/* Create New Project Button */}
            <button
              onClick={() => {
                setShowCreateModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-indigo-500/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Create New Project</span>
            </button>
            
            {/* Project List */}
            <div className="border-t border-slate-200/50 mt-2 pt-2">
              {projects.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500">No projects yet</p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setCurrentProject(project);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentProject?.id === project.id
                        ? 'bg-indigo-500/30 text-indigo-800 font-medium'
                        : 'text-slate-700 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="truncate">{project.name}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Create New Project
            </h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
              <div className="flex space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProjectName('');
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
