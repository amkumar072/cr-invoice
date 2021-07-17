import { Injectable } from '@angular/core';
import { LogLevel } from 'src/app/enum/log-level.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /**
   * The application log level. Populated from ```environment.logLevel```
   */
  level: number;

  /**
   * Initializes the log level set in ```environment.ts```
   */
  constructor() {
    this.level = environment.logLevel;
  }

  get debug() {
    // tslint:disable-next-line:no-console
    return this.log(LogLevel.DEBUG, console.debug);
  }

  get error() {
    return this.log(LogLevel.ERROR, console.error);
  }

  get warn() {
    return this.log(LogLevel.WARNING, console.warn);
  }

  get info() {
    return this.log(LogLevel.INFO, console.info);
  }

  /**
   * Generic logging method to log based on logging level.
   * @param logLevel The level of the log.
   * @param func The log level function to be used to do the action logging.
   */
  private log(logLevel: LogLevel, func: () => void) {
    if (logLevel <= this.level) {
      return func.bind(console);
    } else {
      return () => { };
    }
  }
}
