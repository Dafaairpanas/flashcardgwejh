import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Setup
      selectedChapters: [],
      selectedGrades: [1, 2], // 1=Wajib, 2=Extra, 3=Trash
      jlptFilter: 'all',    // 'all' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1'
      studyMode: 1,         // 1-4
      soundEnabled: false,
      showChapterBadge: true, // Show/hide chapter badge on flashcards
      hideMastered: false, // Don't show mastered cards
      jpFont: typeof window !== 'undefined' ? (localStorage.getItem('gw_jp_font') || '"UDDigiKyokasho", sans-serif') : '"UDDigiKyokasho", sans-serif',
      
      // Data
      allCards: [],
      chapters: [],
      customCards: [],
      customFsrs: false,
      practiceDifficultIds: [], // card IDs from difficult list practice
      sessionResult: null, // { reviewed: 0, duration: 0, accuracy: 0, weakCards: [] }
      
      // Actions
      setCustomFsrs: (val) => set({ customFsrs: val }),
      setPracticeDifficultIds: (ids) => set({ practiceDifficultIds: ids }),
      setSessionResult: (result) => set({ sessionResult: result }),
      setCustomCards: (cards) => set({ customCards: cards }),
      setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
      setAllCards: (cards) => set({ allCards: cards }),
      setChapters: (chapters) => set({ chapters }),
      setSelectedChapters: (chapters) => set({ selectedChapters: chapters }),
      toggleGrade: (grade) => set((state) => {
        const grades = [...state.selectedGrades];
        const idx = grades.indexOf(grade);
        if (idx > -1) grades.splice(idx, 1);
        else grades.push(grade);
        return { selectedGrades: grades };
      }),
      setJlptFilter: (filter) => set({ jlptFilter: filter }),
      setStudyMode: (mode) => set({ studyMode: mode }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleChapterBadge: () => set((state) => ({ showChapterBadge: !state.showChapterBadge })),
      toggleHideMastered: () => set((state) => ({ hideMastered: !state.hideMastered })),
      setJpFont: (font) => {
        if (typeof window !== 'undefined') localStorage.setItem('gw_jp_font', font);
        set({ jpFont: font });
      }
    }),
    {
      name: 'gw_store_prefs', // name of item in storage
      partialize: (state) => ({
        selectedChapters: state.selectedChapters,
        selectedGrades: state.selectedGrades,
        jlptFilter: state.jlptFilter,
        studyMode: state.studyMode,
        soundEnabled: state.soundEnabled,
        showChapterBadge: state.showChapterBadge,
        hideMastered: state.hideMastered,
      }),
    }
  )
);
