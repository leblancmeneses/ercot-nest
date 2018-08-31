import * as admin from 'firebase-admin';
import * as ercot from './fetch';
import * as nest_get from './nest_get';

admin.initializeApp();

export const ercotFetchData = ercot.hook;
export const nestGet = nest_get.hook;