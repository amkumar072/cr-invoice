// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LogLevel } from "src/app/enum/log-level.enum";

export const environment = {
  production: false,
  logLevel: LogLevel.DEBUG,
  dbPrefix: 'local',
  firebase: {
    apiKey: 'AIzaSyD-GmqBwgtJ6-Np3AveDd3fNhJI_Ey2UIM',
    authDomain: 'creative-power-9f413.firebaseapp.com',
    databaseURL: 'https://creative-power-9f413-default-rtdb.firebaseio.com',
    projectId: 'creative-power-9f413',
    storageBucket: 'creative-power-9f413.appspot.com',
    messagingSenderId: '84853172752',
    appId: '1:84853172752:web:51cf58d1bc2872a731b895',
    measurementId: 'G-9LSCV2RBKF'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
