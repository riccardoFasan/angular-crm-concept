import { Priority, Status } from '../enums';
import { Task } from '../models';

export const FAKE_TASKS: Task[] = [
  {
    id: '1',
    description: 'delectus aut autem',
    status: Status.Completed,
    priority: Priority.Top,
    deadline: new Date(),
  },
  {
    id: '2',
    description: 'quis ut nam facilis et officia qui',
    status: Status.NotStarted,
    priority: Priority.Medium,
    deadline: new Date(),
  },
  {
    id: '3',
    description: 'fugiat veniam minus',
    status: Status.InProgress,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '4',
    description: 'et porro tempora',
    status: Status.NotStarted,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '5',
    description:
      'laboriosam mollitia et enim quasi adipisci quia provident illum',
    status: Status.Completed,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '6',
    description: 'qui ullam ratione quibusdam voluptatem quia omnis',
    status: Status.InProgress,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '7',
    description: 'illo expedita consequatur quia in',
    status: Status.NotStarted,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '8',
    description: 'quo adipisci enim quam ut ab',
    status: Status.Completed,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '9',
    description: 'molestiae perspiciatis ipsa',
    status: Status.NotStarted,
    priority: Priority.Low,
    deadline: new Date(),
  },
  {
    id: '10',
    description: 'illo est ratione doloremque quia maiores aut',
    status: Status.Completed,
    priority: Priority.Low,
    deadline: new Date(),
  },
];
