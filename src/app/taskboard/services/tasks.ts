import { Priority, Status } from '../enums';
import { Task } from '../models';

export const FAKE_TASKS: Task[] = [
  {
    id: '1',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.Completed,
    priority: Priority.Top,
    deadline: new Date(),
  },
  {
    id: '2',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.NotStarted,
    priority: Priority.Medium,
    deadline: new Date(),
  },
  {
    id: '3',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.InProgress,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '4',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.NotStarted,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '5',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.Completed,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '6',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.InProgress,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '7',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.NotStarted,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '8',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.Completed,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '9',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.NotStarted,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '10',
    description:
      'My firsy rendered task with component-store and anguar material',
    status: Status.Completed,
    priority: Priority.Low,
    deadline: new Date(),
  },
];
