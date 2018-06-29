import Dexie from 'dexie';

export const db = new Dexie('dataVizDB');

db.version(1).stores({ 
    userProfile: '++id'
});