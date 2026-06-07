export const calculate = (prev: number, next: number, op: string) => {
  switch (op) {
    case '+': return prev + next;
    case '-': return prev - next;
    case '*': return prev * next;
    case '/': return prev / next;
    default: return next;
  }
};
