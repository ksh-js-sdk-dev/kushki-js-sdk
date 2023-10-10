/* istanbul ignore file */
export const clipboard = async (text: string): Promise<void> => {
  await window.navigator.clipboard.writeText(text);
};
