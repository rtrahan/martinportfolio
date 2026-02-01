'use client';

import { ReactNode } from 'react';
import { ProjectInfo } from './ProjectInfo';
import { ProjectProvider, useProjectDrawer } from '@/context/ProjectContext';

function ProjectLayoutContent({ 
  children, 
  description 
}: { 
  children: ReactNode; 
  description: string;
}) {
  const { isOpen } = useProjectDrawer();

  return (
    <>
      {/* Main Content Wrapper - Shifts Left */}
      <div 
        className={`relative h-screen w-screen overflow-hidden bg-stone-900 text-stone-100 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? '-translate-x-[20vw]' : 'translate-x-0'}`}
      >
        {children}
      </div>

      {/* Project Info Drawer (Fixed) */}
      <ProjectInfo description={description} />
    </>
  );
}

export function ProjectLayout({ 
  children, 
  description,
}: { 
  children: ReactNode;
  description: string;
}) {
  return (
    <ProjectProvider>
      <ProjectLayoutContent description={description}>
        {children}
      </ProjectLayoutContent>
    </ProjectProvider>
  );
}
