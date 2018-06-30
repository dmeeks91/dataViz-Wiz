import Dexie from 'dexie';

export const db = new Dexie('dataVizDB');

db.version(1).stores({userProfile: 'id'});

db.version(2).stores({
    userProfile: 'id',
    game: 'id'});