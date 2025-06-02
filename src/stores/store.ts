// src/stores/store.ts
import { createSignal } from 'solid-js';

const [currentMenu, setCurrentMenu] = createSignal('Home');

export function useMenuStore<T>(selector: (state: { currentMenu: string; setCurrentMenu: (menu: string) => void }) => T): T {
  const state = {
    currentMenu: currentMenu(),
    setCurrentMenu
  };
  return selector(state);
}
