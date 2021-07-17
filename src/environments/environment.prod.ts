import { LogLevel } from "src/app/enum/log-level.enum";

export const environment = {
  production: true,
  logLevel: LogLevel.ERROR,
  dbPrefix: 'prod',
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
