import create from 'zustand'

const useFiles = create((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
}))

export default useFiles