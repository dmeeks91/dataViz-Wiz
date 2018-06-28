import Dexie from 'dexie';

const db = new Dexie('dataVizDB');
db.version(1).stores({ 
    userProfile: '++id'
});

export default db;