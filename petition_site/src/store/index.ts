import {create} from 'zustand';

const useCredStore = create((set) => ({
    Token: "",
    loggedin: false,
    setLoggedIn: (loggedIn: boolean) => set({loggedIn}),
    setAuthToken: (authToken: string) => set({ authToken }),
}));

export {useCredStore};