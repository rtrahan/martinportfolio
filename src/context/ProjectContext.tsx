'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectContextType {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ProjectContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjectDrawer = () => useContext(ProjectContext);
