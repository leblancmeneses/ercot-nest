import * as admin from 'firebase-admin';
import  * as ercot from './fetch';

admin.initializeApp();

export const ercotFetchData = ercot.hook;