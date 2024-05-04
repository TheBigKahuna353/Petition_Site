import {create} from 'zustand';

interface PetitionState {
    Petitons: Array<Petition>;
    setPetitions: (petitions: Array<Petition>) => void;
    Categories: Array<Catergory>;
    setCategories: (categories: Array<Catergory>) => void;
}

interface TokenState {
    token: string;
    setToken: (token: string) => void;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    login: (token: string) => void;
    logout: () => void;
}


const getLocalStoragePet = (key: string): Array<Petition> => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStoragePet = (key: string, value:Array<Petition>) => window.localStorage.setItem(key, JSON.stringify(value));

const getLocalStorageCat = (key: string): Array<Catergory> => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorageCat = (key: string, value:Array<Catergory>) => window.localStorage.setItem(key, JSON.stringify(value));

const usePetitionStore = create<PetitionState>((set) => ({

    Petitons: getLocalStoragePet('petitions') || [],

    setPetitions: (petitions: any) => {
        setLocalStoragePet('petitions', petitions);
    },

    Categories: getLocalStorageCat('categories') || [],

    setCategories: (categories: Array<Catergory>) => {
        setLocalStorageCat('categories', categories.sort());
    }

}));

const useTokenStore = create<TokenState>((set) => ({
    token: '',
    setToken: (token: string) => set({token}),
    loggedIn: false,
    setLoggedIn: (loggedIn: boolean) => set({loggedIn}),

    login: (token: string) => {
        set({token, loggedIn: true});
    },

    logout: () => set({token: '', loggedIn: false})
}));



export {usePetitionStore, useTokenStore};