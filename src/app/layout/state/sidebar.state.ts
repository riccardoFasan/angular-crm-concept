import { TemplateRef } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';

export interface SidebarState {
  title: string;
  opened: boolean;
  position: 'start' | 'end';
  mode: MatDrawerMode;
  template?: TemplateRef<any>;
}

export const INITIAL_SIDEBAR_STATE: SidebarState = {
  title: '',
  opened: false,
  position: 'start',
  mode: 'over',
};
