import React from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen } from 'lucide-react';
import { allTutorials } from '@/data/tutorials';

interface TutorialMenuProps {
  trigger?: React.ReactNode;
}

const TutorialMenu: React.FC<TutorialMenuProps> = ({ trigger }) => {
  const { startTutorial } = useTutorial();

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-full px-4 py-2 transition-smooth"
    >
      <BookOpen className="w-4 h-4 mr-2" />
      Tutorials
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
        {allTutorials.map((tutorial) => (
          <DropdownMenuItem
            key={tutorial.id}
            onClick={() => startTutorial(tutorial)}
            className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {tutorial.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TutorialMenu;