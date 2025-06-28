// > Context for Board components and connections to pass to chat
import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { componentService, connectionService, type Component, type Connection } from '../services/api';
import { useProject } from './ProjectContext';

//  for the setter function types, react dispatch is used to update state in a functional way
type BoardContextType = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  saveBoard: () => Promise<void>;
  loadBoard: (projectId: string) => Promise<void>;
  isSaving: boolean;
};

export const BoardContext = createContext<BoardContextType | undefined>(
  undefined
);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardContext.Provider');
  }
  return context;
};

export const BoardProvider: React.FC<{ 
  children: React.ReactNode;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}> = ({ children, nodes, setNodes, edges, setEdges }) => {
  const { currentProject } = useProject();
  const [isSaving, setIsSaving] = React.useState(false);

  // Convert database components to React Flow nodes
  const convertComponentsToNodes = (components: Component[]): Node[] => {
    return components.map(comp => ({
      id: comp.id,
      type: comp.component_type,
      position: { x: comp.position_x, y: comp.position_y },
      data: { 
        label: comp.name,
        ...comp.properties 
      },
    }));
  };

  // Convert database connections to React Flow edges
  const convertConnectionsToEdges = (connections: Connection[]): Edge[] => {
    return connections.map(conn => ({
      id: conn.id,
      source: conn.source_component_id,
      target: conn.target_component_id,
      type: conn.connection_type,
      data: conn.properties,
    }));
  };

  // Convert React Flow nodes to database components
  const convertNodesToComponents = (nodes: Node[], projectId: string): Partial<Component>[] => {
    return nodes.map(node => ({
      project_id: projectId,
      component_type: node.type || 'default',
      name: (node.data?.label as string) || 'Unnamed Component',
      position_x: Math.round(node.position.x),
      position_y: Math.round(node.position.y),
      properties: node.data || {},
    }));
  };

  // Convert React Flow edges to database connections  
  const convertEdgesToConnections = (edges: Edge[], projectId: string): Partial<Connection>[] => {
    return edges.map(edge => ({
      project_id: projectId,
      source_component_id: edge.source,
      target_component_id: edge.target,
      connection_type: edge.type || 'default',
      properties: edge.data || {},
    }));
  };

  // Save current board state to database
  const saveBoard = useCallback(async () => {
    if (!currentProject) {
      console.warn('No current project to save board to');
      return;
    }

    setIsSaving(true);
    try {
      // Clear existing components and connections for this project
      // Note: This is a simple approach - in production you'd want to do differential updates
      const existingComponents = await componentService.getByProjectId(currentProject.id);
      for (const comp of existingComponents) {
        await componentService.delete(comp.id);
      }

      // Save components (nodes)
      const componentData = convertNodesToComponents(nodes, currentProject.id);
      const savedComponents = await Promise.all(
        componentData.map(comp => componentService.create(comp))
      );

      // Create a mapping from old node IDs to new component IDs
      const nodeIdToComponentId: Record<string, string> = {};
      nodes.forEach((node, index) => {
        nodeIdToComponentId[node.id] = savedComponents[index].id;
      });

      // Save connections (edges) with updated component IDs
      const connectionData = convertEdgesToConnections(edges, currentProject.id).map(conn => ({
        ...conn,
        source_component_id: nodeIdToComponentId[conn.source_component_id!] || conn.source_component_id,
        target_component_id: nodeIdToComponentId[conn.target_component_id!] || conn.target_component_id,
      }));

      await Promise.all(
        connectionData.map(conn => connectionService.create(conn))
      );

      console.log('Board saved successfully');
    } catch (error) {
      console.error('Failed to save board:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentProject, nodes, edges]);

  // Load board from database
  const loadBoard = useCallback(async (projectId: string) => {
    try {
      const [components, connections] = await Promise.all([
        componentService.getByProjectId(projectId),
        connectionService.getByProjectId(projectId)
      ]);

      const loadedNodes = convertComponentsToNodes(components);
      const loadedEdges = convertConnectionsToEdges(connections);

      setNodes(loadedNodes);
      setEdges(loadedEdges);

      console.log('Board loaded successfully');
    } catch (error) {
      console.error('Failed to load board:', error);
    }
  }, [setNodes, setEdges]);

  // Auto-load board when current project changes
  useEffect(() => {
    if (currentProject) {
      loadBoard(currentProject.id);
    }
  }, [currentProject, loadBoard]);

  // Auto-save board when nodes or edges change (debounced)
  useEffect(() => {
    if (!currentProject || nodes.length === 0) return;

    const timeoutId = setTimeout(() => {
      saveBoard();
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, currentProject, saveBoard]);

  const value: BoardContextType = {
    nodes,
    setNodes,
    edges,
    setEdges,
    saveBoard,
    loadBoard,
    isSaving,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};
