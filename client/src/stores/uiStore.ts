import { create } from 'zustand';
type UiState = { isSearchOpen:boolean; setSearchOpen:(open:boolean)=>void };
export const useUiStore=create<UiState>((set)=>({isSearchOpen:false,setSearchOpen:(isSearchOpen)=>set({isSearchOpen})}));
