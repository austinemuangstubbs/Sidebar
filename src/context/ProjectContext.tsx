import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectService, type Project } from '../services/api';

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  createProject: (name: string, description?: string) => Promise<Project>;
  loadProjects: () => Promise<void>;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const projectList = await projectService.getAll();
      setProjects(projectList);
      
      // If no current project is set, use the most recent one
      if (!currentProject && projectList.length > 0) {
        setCurrentProject(projectList[0]);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (name: string, description?: string): Promise<Project> => {
    setIsLoading(true);
    try {
      const newProject = await projectService.create({
        name,
        description,
        is_public: false,
      });
      
      setProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
      
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const value: ProjectContextType = {
    currentProject,
    setCurrentProject,
    projects,
    setProjects,
    createProject,
    loadProjects,
    isLoading,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
