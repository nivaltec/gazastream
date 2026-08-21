import { NavigationItem } from "../models/navigation-item";

  export const sideBarMenu: NavigationItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/',
      exact: true,
    },

    {
      label: 'Playlists',
      icon: 'fa-solid fa-music',
      route: '/playlist',
    },

    {
      label: 'Favourites',
      icon: 'fa-solid fa-heart',
      route: '/favourites',
    },

    {
      label: 'Podcasts',
      icon: 'fa-solid fa-microphone',
      route: '/podcast',
    },

    {
      label: 'Radio',
      icon: 'fa-solid fa-radio',
      route: '/radio',
    },
  ];
