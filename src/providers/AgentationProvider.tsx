'use client';

import { Agentation } from 'agentation';

export const AgentationProvider = () => {
  if (process.env.NODE_ENV !== 'development') return null;
  return <Agentation />;
};
