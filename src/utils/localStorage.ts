import { Visitor } from '../types/visitor';

const STORAGE_KEY = 'visitor_records';

export const saveVisitor = (visitor: Visitor): void => {
  const existingVisitors = getVisitors();
  const updatedVisitors = [...existingVisitors, visitor];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVisitors));
};

export const getVisitors = (): Visitor[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const updateVisitor = (updatedVisitor: Visitor): void => {
  const visitors = getVisitors();
  const updatedVisitors = visitors.map(visitor => 
    visitor.id === updatedVisitor.id ? updatedVisitor : visitor
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVisitors));
};

export const getTodaysVisitors = (): Visitor[] => {
  const visitors = getVisitors();
  const today = new Date().toDateString();
  
  return visitors.filter(visitor => {
    const checkInDate = new Date(visitor.checkInTime).toDateString();
    return checkInDate === today;
  });
};