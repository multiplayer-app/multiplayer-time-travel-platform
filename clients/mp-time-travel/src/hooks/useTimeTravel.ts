import { useContext } from 'react';
import { TimeTravelContext } from '../contexts/TimeTravelContext';

export const useTimeTravel = () => {
  const context = useContext(TimeTravelContext);
  if (context === undefined) {
    throw new Error('useTimeTravel must be used within a TimeTravelProvider');
  }
  return context;
};