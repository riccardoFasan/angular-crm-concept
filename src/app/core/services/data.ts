import { AssignmentRole, EmployeeRole, Priority, TaskStatus } from '../enums';
import { Assignment, Employee, Task } from '../models';

const FAKE_TASK_1: Task = {
  id: '1',
  description: 'delectus aut autem',
  status: TaskStatus.Completed,
  priority: Priority.Top,
  deadline: new Date(),
};

const FAKE_TASK_2: Task = {
  id: '2',
  description: 'quis ut nam facilis et officia qui',
  status: TaskStatus.NotStarted,
  priority: Priority.Medium,
  deadline: new Date(),
};

const FAKE_TASK_3: Task = {
  id: '3',
  description: 'fugiat veniam minus',
  status: TaskStatus.InProgress,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_TASK_4: Task = {
  id: '4',
  description: 'et porro tempora',
  status: TaskStatus.NotStarted,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_TASK_5: Task = {
  id: '5',
  description:
    'laboriosam mollitia et enim quasi adipisci quia provident illum',
  status: TaskStatus.InProgress,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_TASK_6: Task = {
  id: '6',
  description: 'qui ullam ratione quibusdam voluptatem quia omnis',
  status: TaskStatus.InProgress,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_TASK_7: Task = {
  id: '7',
  description: 'illo expedita consequatur quia in',
  status: TaskStatus.NotStarted,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_TASK_8: Task = {
  id: '8',
  description: 'quo adipisci enim quam ut ab',
  status: TaskStatus.Completed,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_TASK_9: Task = {
  id: '9',
  description: 'molestiae perspiciatis ipsa',
  status: TaskStatus.NotStarted,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_TASK_10: Task = {
  id: '10',
  description: 'illo est ratione doloremque quia maiores aut',
  status: TaskStatus.Completed,
  priority: Priority.Low,
  deadline: new Date(),
};

const FAKE_ASSIGNMENT_1: Assignment = {
  task: FAKE_TASK_1,
  role: AssignmentRole.Worker,
  assignedAt: new Date('2023-04-07'),
  fromDate: new Date('2023-04-11'),
  dueDate: new Date('2023-04-18'),
};

const FAKE_ASSIGNMENT_2: Assignment = {
  task: FAKE_TASK_1,
  role: AssignmentRole.Worker,
  assignedAt: new Date('2023-04-11'),
  fromDate: new Date('2023-04-12'),
  dueDate: new Date('2023-04-18'),
};

const FAKE_ASSIGNMENT_3: Assignment = {
  task: FAKE_TASK_1,
  role: AssignmentRole.Reviewer,
  assignedAt: new Date('2023-04-07'),
  fromDate: new Date('2023-04-11'),
  dueDate: new Date('2023-04-18'),
};

const FAKE_ASSIGNMENT_4: Assignment = {
  task: FAKE_TASK_2,
  role: AssignmentRole.Worker,
  assignedAt: new Date('2023-04-15'),
  fromDate: new Date('2023-04-15'),
  dueDate: new Date('2023-04-20'),
};

const FAKE_ASSIGNMENT_5: Assignment = {
  task: FAKE_TASK_2,
  role: AssignmentRole.Reviewer,
  assignedAt: new Date('2023-04-15'),
  fromDate: new Date('2023-04-15'),
  dueDate: new Date('2023-04-20'),
};

const FAKE_ASSIGNMENT_6: Assignment = {
  task: FAKE_TASK_3,
  role: AssignmentRole.Worker,
  assignedAt: new Date('2023-04-16'),
  fromDate: new Date('2023-04-16'),
  dueDate: new Date('2023-04-17'),
};

const FAKE_ASSIGNMENT_7: Assignment = {
  task: FAKE_TASK_4,
  role: AssignmentRole.Worker,
  assignedAt: new Date('2023-04-15'),
  fromDate: new Date('2023-04-15'),
  dueDate: new Date('2023-04-17'),
};

const FAKE_ASSIGNMENT_8: Assignment = {
  task: FAKE_TASK_5,
  role: AssignmentRole.Worker,
  assignedAt: new Date('2023-04-18'),
  fromDate: new Date('2023-04-18'),
  dueDate: new Date('2023-04-20'),
};

const FAKE_ASSIGNMENT_9: Assignment = {
  task: FAKE_TASK_6,
  role: AssignmentRole.Worker,
  assignedAt: new Date('2023-04-19'),
  fromDate: new Date('2023-04-21'),
  dueDate: new Date('2023-04-25'),
};

const FAKE_ASSIGNMENT_10: Assignment = {
  task: FAKE_TASK_6,
  role: AssignmentRole.Reviewer,
  assignedAt: new Date('2023-04-19'),
  fromDate: new Date('2023-04-21'),
  dueDate: new Date('2023-04-25'),
};

const FAKE_EMPLOYEE_1: Employee = {
  id: '1',
  firstName: 'James',
  lastName: 'Sawyer',
  email: 'james.sawyer@company.com',
  roles: [EmployeeRole.ProjectManager, EmployeeRole.Developer],
  pictureUrl:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  assignments: [FAKE_ASSIGNMENT_1, FAKE_ASSIGNMENT_5],
};

const FAKE_EMPLOYEE_2: Employee = {
  id: '2',
  firstName: 'Jack',
  lastName: 'Shepard',
  email: 'jack.shepard@company.com',
  roles: [EmployeeRole.Tester, undefined],
  pictureUrl:
    'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  assignments: [FAKE_ASSIGNMENT_2, FAKE_ASSIGNMENT_4],
};

const FAKE_EMPLOYEE_3: Employee = {
  id: '3',
  firstName: 'Kate',
  lastName: 'Austen',
  email: 'kate.auster@company.com',
  roles: [EmployeeRole.ProjectManager, EmployeeRole.Designer],
  pictureUrl:
    'https://images.unsplash.com/photo-1560439450-57df7ac6dbef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  assignments: [
    FAKE_ASSIGNMENT_10,
    FAKE_ASSIGNMENT_3,
    FAKE_ASSIGNMENT_6,
    FAKE_ASSIGNMENT_7,
  ],
};

const FAKE_EMPLOYEE_4: Employee = {
  id: '4',
  firstName: 'Juliet',
  lastName: 'Burke',
  email: 'juliet.burke@company.com',
  roles: [EmployeeRole.Designer, EmployeeRole.Developer],
  pictureUrl:
    'https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  assignments: [],
};

const FAKE_EMPLOYEE_5: Employee = {
  id: '5',
  firstName: 'Claire',
  lastName: 'Littleton',
  email: 'claire.littleton@company.com',
  roles: [EmployeeRole.Tester, undefined],
  pictureUrl:
    'https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  assignments: [FAKE_ASSIGNMENT_8, FAKE_ASSIGNMENT_9],
};

export const FAKE_TASKS: Task[] = [
  FAKE_TASK_1,
  FAKE_TASK_2,
  FAKE_TASK_3,
  FAKE_TASK_4,
  FAKE_TASK_5,
  FAKE_TASK_6,
  FAKE_TASK_7,
  FAKE_TASK_8,
  FAKE_TASK_9,
  FAKE_TASK_10,
];

export const FAKE_ASSIGNMENTS: Assignment[] = [
  FAKE_ASSIGNMENT_1,
  FAKE_ASSIGNMENT_2,
  FAKE_ASSIGNMENT_3,
  FAKE_ASSIGNMENT_4,
  FAKE_ASSIGNMENT_5,
  FAKE_ASSIGNMENT_6,
  FAKE_ASSIGNMENT_7,
  FAKE_ASSIGNMENT_8,
  FAKE_ASSIGNMENT_9,
  FAKE_ASSIGNMENT_10,
];

export const FAKE_EMPLOYEES: Employee[] = [
  FAKE_EMPLOYEE_1,
  FAKE_EMPLOYEE_2,
  FAKE_EMPLOYEE_3,
  FAKE_EMPLOYEE_4,
  FAKE_EMPLOYEE_5,
];
