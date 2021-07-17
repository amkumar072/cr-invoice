import { LoadingOptions } from '@ionic/core/dist/types/components/loading/loading-interface';

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}

export interface HttpRequestOptions {
  excludeAuthHeader?: boolean;
  hideSpinner?: boolean;
  spinnerMessage?: string;
  spinnerOptions?: LoadingOptions;
}
