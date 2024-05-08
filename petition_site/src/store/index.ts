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
    userId: number;
    setUserId: (userId: number) => void;
    setLoggedIn: (loggedIn: boolean) => void;
    login: (token: string, userId: number) => void;
    logout: () => void;
}

interface PrevPageState {
    prevPage: string;
    setPrevPage: (prevPage: string) => void;
}


const getLocalStoragePet = (key: string): Array<Petition> => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStoragePet = (key: string, value:Array<Petition>) => window.localStorage.setItem(key, JSON.stringify(value));

const getLocalStorageCat = (key: string): Array<Catergory> => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorageCat = (key: string, value:Array<Catergory>) => window.localStorage.setItem(key, JSON.stringify(value));

const getLocalStoragePage = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStoragePage = (key: string, value:string) => window.localStorage.setItem(key, JSON.stringify(value));

const getTokenS = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setTokenS = (key: string, value:string) => window.localStorage.setItem(key, JSON.stringify(value));
const getUserIdS = (key: string): number => JSON.parse(window.localStorage.getItem(key) as string);
const setUserIdS = (key: string, value:number) => window.localStorage.setItem(key, JSON.stringify(value));
const getLoggedInS = (key: string): boolean => JSON.parse(window.localStorage.getItem(key) as string);
const setLoggedInS = (key: string, value:boolean) => window.localStorage.setItem(key, JSON.stringify(value));


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
    token: getTokenS('token') || '',
    userId: getUserIdS('userId') || 0,
    setToken: (token: string) => set(() => {
        setTokenS('token', token)
        return {token}
    }),

    setUserId: (userId: number) => set(() => {
        setUserIdS('userId', userId)
        return {userId}
    }),

    loggedIn: getLoggedInS('loggedIn') || false,

    setLoggedIn: (loggedIn: boolean) => set(() => {
        setLoggedInS('loggedIn', loggedIn)
        return {loggedIn}
    }),

    login: (token: string, userId: number) => set(() => {
        setTokenS('token', token);
        setUserIdS('userId', userId);
        setLoggedInS('loggedIn', true);
        return {token, userId, loggedIn: true}
    }),

    logout: () => set(() => {
        setTokenS('token', '');
        setUserIdS('userId', 0);
        setLoggedInS('loggedIn', false);
        return {token: '', userId: 0, loggedIn: false}
    }),
}));

const usePageStore = create<PrevPageState>((set) => ({
    prevPage: getLocalStoragePage('prevPage') || '',
    setPrevPage: (prevPage: string) => setLocalStoragePage('prevPage', prevPage)
}));


export {usePetitionStore, useTokenStore, usePageStore};