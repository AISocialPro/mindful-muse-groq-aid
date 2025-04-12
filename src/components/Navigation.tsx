
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { 
  LayoutDashboard, 
  MessageSquare, 
  ImageIcon, 
  MicIcon, 
  HeartPulse, 
  Info,
  CalendarClock
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="w-full px-4 sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        <Link to="/" className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-mind-pink" fill="#F8C8DC" />
          <span className="text-xl font-bold bg-gradient-calm text-transparent bg-clip-text">Mindful Muse</span>
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + (isActive('/') ? ' bg-accent' : '')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + (isActive('/dashboard') ? ' bg-accent' : '')}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Info className="h-4 w-4 mr-2" />
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[300px] p-4 grid gap-3">
                  <Link to="/image-analysis" className="p-2 hover:bg-accent rounded-md transition-colors">
                    <h3 className="font-medium mb-1 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2 text-mind-purple" />
                      Image Analysis
                    </h3>
                    <p className="text-sm text-slate-500">Upload doodles or images for emotional insights</p>
                  </Link>
                  <Link to="/voice-interaction" className="p-2 hover:bg-accent rounded-md transition-colors">
                    <h3 className="font-medium mb-1 flex items-center">
                      <MicIcon className="h-4 w-4 mr-2 text-mind-green" />
                      Voice Interaction
                    </h3>
                    <p className="text-sm text-slate-500">Speak directly to Mindful Muse</p>
                  </Link>
                  <Link to="/schedule-checkin" className="p-2 hover:bg-accent rounded-md transition-colors">
                    <h3 className="font-medium mb-1 flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2 text-mind-blue" />
                      Schedule Check-in
                    </h3>
                    <p className="text-sm text-slate-500">Set up regular wellness sessions</p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navigation;
