
export const initialNodes = [
  {
    id: '1',
    position: {x: 200, y: 100},
    data: {label: 'Выбран тренер 1'},
  },
  {
    id: '2',
    position: {x: 230, y: 200},
    data: {label: 'Выбран тренер 2'},
  },
  {
    id: '3',
    position: {x: 100, y: 300},
    data: {label: 'Выбран тренер 3'},
  },
  {
    id: '4',
    position: {x: 400, y: 300},
    data: {label: 'Выбран тренер 4'},
  },
  {
    id: '5',
    position: {x: 300, y: 400},
    data: {label: 'Выбран тренер 5'},
  },
  {
    id: '6',
    position: {x: 500, y: 400},
    data: {label: 'Выбран тренер 6'},
  },
  {
    id: '7',
    position: {x: 300, y: 500},
    data: {label: 'Выбран тренер 7'},
  },
  {
    id: '8',
    position: {x: 500, y: 500},
    data: {label: 'Выбран тренер 8'},
  },
];

export const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
  },
];