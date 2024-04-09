export const errorCall = async (): Promise<void> =>
  new Promise((resolve, reject) => setTimeout(() => reject('hello'), 1000));

export const successfulCall = async (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 1000));
