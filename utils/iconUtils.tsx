import React from 'react';
import { Heart, DollarSign, BookOpen, Stethoscope, Users, Home } from 'lucide-react';

export const getIcon = (iconName: string, className: string = "w-6 h-6") => {
  const iconMap: Record<string, React.ReactElement> = {
    'heart': <Heart className={className} />,
    'dollar-sign': <DollarSign className={className} />,
    'book-open': <BookOpen className={className} />,
    'stethoscope': <Stethoscope className={className} />,
    'users': <Users className={className} />,
    'home': <Home className={className} />,
  };

  return iconMap[iconName] || <Heart className={className} />;
};