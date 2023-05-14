import { InjectionToken } from '@angular/core';
import { ItemAdapter } from '../interfaces';

export const ITEM_ADAPTER: InjectionToken<ItemAdapter<any>> =
  new InjectionToken<ItemAdapter<any>>('ItemAdapter');
