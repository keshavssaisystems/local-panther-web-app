const subscribers = new Set();

export const subscribe = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback); // cleanup/unsubscribe
};

export const notify = (data) => {
  subscribers.forEach((callback) => callback(data));
};
