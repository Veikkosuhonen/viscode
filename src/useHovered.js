import create from 'zustand'

const useHovered = create((set) => ({
  hovered: null,
  hover: (mesh) => set({ hovered: mesh }),
  unHover: (mesh) => set(({hovered}) => ({ hovered: hovered === mesh ? null : hovered })),
}))

export default useHovered