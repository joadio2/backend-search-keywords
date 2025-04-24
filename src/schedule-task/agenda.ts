import { Agenda } from 'agenda';

export const agenda = new Agenda({
  db: {
    address: 'mongodb://localhost:27017/test',
    collection: 'agendaJobs',
  },
});
