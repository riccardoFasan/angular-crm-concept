# Build CRMs in Angular using [@ngrx/component-store](https://ngrx.io/guide/component-store) - a concept

## The idea

It is an example on how to use [smart and dumb component](https://medium.com/@mrahmedkhan019/smart-dumb-components-in-angular-e1d6dbd6edff) architecture to build CRMs in Angular that are flexible, easy to maintain, and have simple but robust and flexible state management.

Basically, the application revolves around task and employee entities and has the basic use cases of a CRM, such as displaying paged lists, editing data in forms, and performing CRUD operations via APIs.

## Notes

I made full use of the framework's modern techniques, such as the use of standalone components, the use of ChangeDetection.OnPush to improve performance.

There are also examples on how to use those features that are often forgotten by developers
- custom strategies for dynamic and centralized management of page titles
- canDeactivate guards to get consent from the user before exiting a form without saving
- custom validators to separate form validation logic from domain logic and more (for both single inputs and entire form groups)
- use of ng-template and ng-content to create extendible and reusable components
- use of injection tokens to develop extendible and reusable services

## Ideas for the future
- Do a refactoring to replace observables as much as possible with Angular's newest signals
- Add an example on how and use async validators

## Dependencies
- [Angular](https://angular.io/) 
- [Angular Material](https://material.angular.io/)
- [@ngrx/component-store](https://ngrx.io/guide/component-store)
