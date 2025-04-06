import { create } from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

// This is a Zustand store for managing user authentication state.
export const useUserStore = create((set) => ({

    user: null,
    loading: false,
    checkingAuth: true,

    signup: 
}));
