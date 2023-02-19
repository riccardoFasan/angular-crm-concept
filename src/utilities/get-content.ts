export function getContent(): HTMLElement {
  //  https://stackoverflow.com//questions/53188426/angular-7-scroll-event-does-not-fire#answer-53277795
  return document.querySelector('mat-sidenav-content')!;
}
