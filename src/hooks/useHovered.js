import create from 'zustand'

const useHovered = create((set) => ({
  hovered: null,
  hover: ({ mesh, token }) => set({ hovered: { mesh, token } }),
  unHover: ({ mesh, token }) => set(({hovered}) => ({ hovered: hovered === mesh ? null : hovered })),
}))

export default useHovered