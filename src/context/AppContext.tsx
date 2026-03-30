import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppData, ClassData, Exam, PracticeSet } from '../types';
import { loadAppData, saveAppData } from '../utils/storage';
import { generateId } from '../utils/helpers';

type Action =
  | { type: 'ADD_CLASS'; semesterId: string; name: string; instructor?: string }
  | { type: 'EDIT_CLASS'; semesterId: string; classId: string; name: string; instructor?: string }
  | { type: 'DELETE_CLASS'; semesterId: string; classId: string }
  | { type: 'ADD_EXAM'; semesterId: string; classId: string; exam: Omit<Exam, 'id'> }
  | { type: 'EDIT_EXAM'; semesterId: string; classId: string; examId: string; exam: Omit<Exam, 'id'> }
  | { type: 'DELETE_EXAM'; semesterId: string; classId: string; examId: string }
  | { type: 'ADD_PRACTICE_SET'; semesterId: string; classId: string; set: Omit<PracticeSet, 'id' | 'createdAt'> }
  | { type: 'UPDATE_PRACTICE_SET'; semesterId: string; classId: string; setId: string; set: Omit<PracticeSet, 'id' | 'createdAt'> }
  | { type: 'TOGGLE_STAR_PROBLEM'; semesterId: string; classId: string; setId: string; problemId: string }
  | { type: 'DELETE_PRACTICE_SET'; semesterId: string; classId: string; setId: string };

function reducer(state: AppData, action: Action): AppData {
  const newState = JSON.parse(JSON.stringify(state)) as AppData;

  switch (action.type) {
    case 'ADD_CLASS': {
      const sem = newState.semesters[action.semesterId];
      if (!sem) return state;
      const id = generateId();
      sem.classes[id] = {
        id,
        name: action.name,
        instructor: action.instructor,
        exams: {},
        practiceSets: {},
      };
      return newState;
    }
    case 'EDIT_CLASS': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls) return state;
      cls.name = action.name;
      cls.instructor = action.instructor;
      return newState;
    }
    case 'DELETE_CLASS': {
      const sem = newState.semesters[action.semesterId];
      if (!sem) return state;
      delete sem.classes[action.classId];
      return newState;
    }
    case 'ADD_EXAM': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls) return state;
      const id = generateId();
      cls.exams[id] = { id, ...action.exam };
      return newState;
    }
    case 'EDIT_EXAM': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls || !cls.exams[action.examId]) return state;
      cls.exams[action.examId] = { id: action.examId, ...action.exam };
      return newState;
    }
    case 'DELETE_EXAM': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls) return state;
      delete cls.exams[action.examId];
      return newState;
    }
    case 'ADD_PRACTICE_SET': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls) return state;
      const id = generateId();
      cls.practiceSets[id] = {
        id,
        createdAt: new Date().toISOString(),
        ...action.set,
      };
      return newState;
    }
    case 'UPDATE_PRACTICE_SET': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls || !cls.practiceSets[action.setId]) return state;
      cls.practiceSets[action.setId] = {
        ...cls.practiceSets[action.setId],
        ...action.set,
      };
      return newState;
    }
    case 'TOGGLE_STAR_PROBLEM': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls) return state;
      const set = cls.practiceSets[action.setId];
      if (!set) return state;
      const problem = set.problems.find((p) => p.id === action.problemId);
      if (!problem) return state;
      problem.starred = !problem.starred;
      return newState;
    }
    case 'DELETE_PRACTICE_SET': {
      const cls = newState.semesters[action.semesterId]?.classes[action.classId];
      if (!cls) return state;
      delete cls.practiceSets[action.setId];
      return newState;
    }
    default:
      return state;
  }
}

interface AppContextType {
  data: AppData;
  dispatch: React.Dispatch<Action>;
  getAllClasses: () => { semesterId: string; semesterName: string; cls: ClassData }[];
  findClassLocation: (classId: string) => { semesterId: string; semesterName: string } | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, null, loadAppData);

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const getAllClasses = () => {
    const result: { semesterId: string; semesterName: string; cls: ClassData }[] = [];
    for (const sem of Object.values(data.semesters)) {
      for (const cls of Object.values(sem.classes)) {
        result.push({ semesterId: sem.id, semesterName: sem.name, cls });
      }
    }
    return result;
  };

  const findClassLocation = (classId: string) => {
    for (const sem of Object.values(data.semesters)) {
      if (sem.classes[classId]) {
        return { semesterId: sem.id, semesterName: sem.name };
      }
    }
    return null;
  };

  return (
    <AppContext.Provider value={{ data, dispatch, getAllClasses, findClassLocation }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
