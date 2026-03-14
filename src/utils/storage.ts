import type { AppData } from '../types';

const STORAGE_KEY = 'exam-scheduling-practice-data';

const DEFAULT_SEMESTERS = [
  { id: 'spring-2026', name: 'Spring 2026' },
  { id: 'summer-2026', name: 'Summer 2026' },
  { id: 'fall-2026', name: 'Fall 2026' },
  { id: 'winter-2027', name: 'Winter 2027' },
  { id: 'spring-2027', name: 'Spring 2027' },
  { id: 'summer-2027', name: 'Summer 2027' },
];

function createDefaultData(): AppData {
  const semesters: AppData['semesters'] = {};
  for (const sem of DEFAULT_SEMESTERS) {
    semesters[sem.id] = { id: sem.id, name: sem.name, classes: {} };
  }
  return { semesters };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AppData;
    }
  } catch {
    // corrupted data, reset
  }
  const data = createDefaultData();
  saveAppData(data);
  return data;
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
