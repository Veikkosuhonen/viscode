import create from 'zustand'

const useFiles = create((set) => ({
  files: null,
  setFiles: (files) => set({ files }),
}))

export default useFiles