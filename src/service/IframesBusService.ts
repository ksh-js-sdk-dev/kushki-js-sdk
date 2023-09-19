type FnRecipeMessage = (data: object) => void;

type Listeners = {
  event: string;
  callback: FnRecipeMessage;
};

export interface IFrameBus {
  emit: (event: string, data: object) => void;
  on: (event: string, fnRecipeMessage: FnRecipeMessage) => void;
}

export default (): IFrameBus => {
  const listeners: Listeners[] = [];

  const emit = (event: string, data: object): void => {
    if (listeners.length > 0) {
      listeners
        .filter((listener) => listener.event === event)
        .forEach((listener) => listener.callback(data));
    }
  };

  const on = (event: string, fnRecipeMessage: FnRecipeMessage): void => {
    listeners.push({ callback: fnRecipeMessage, event });
  };

  return {
    emit,
    on
  };
};
