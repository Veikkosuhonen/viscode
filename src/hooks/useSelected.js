import create from 'zustand'

const useSelected = create((set) => ({
  selected: null,
  select: (token) => set({ selected: token }),
  deselect: (token) => set(({selected}) => ({ selected: selected === token ? null : selected })),
}))

export default useSelected