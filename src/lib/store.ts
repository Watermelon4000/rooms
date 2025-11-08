"use client"

import { create } from "zustand";

type EditorState = {
  selectedItemId: string | null;
  inspectorTile: { x: number; y: number } | null;
  setSelectedItemId: (id: string | null) => void;
  setInspectorTile: (tile: { x: number; y: number } | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  selectedItemId: null,
  inspectorTile: null,
  setSelectedItemId: (selectedItemId) => set({ selectedItemId }),
  setInspectorTile: (inspectorTile) => set({ inspectorTile }),
}));
