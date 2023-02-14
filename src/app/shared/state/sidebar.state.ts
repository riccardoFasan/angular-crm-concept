import { TemplateRef } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';

export interface SidebarState {
  opened: boolean;
  position: 'start' | 'end';
  mode: MatDrawerMode;
  template?: TemplateRef<any>;
}

export const INITIAL_SIDEBAR_STATE: SidebarState = {
  opened: false,
  position: 'start',
  mode: 'over',
};
