import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/auth/authApi';
import { userApi } from '../services/user/userApi';
import appSlice from './slices/appSlice';
import articleSlice from './slices/articleSlice';
import authSlice from './slices/authSlice';
import babyBadgesCollectionSlice from './slices/babyBadgesCollectionSlice';
import babySlice from './slices/babySlice';
import badgeReducer from './slices/badgeSlice';
import categorySlice from './slices/categorySlice';
import familyMemberSlice from './slices/familyMemberSlice';
import languageSlice from './slices/languageSlice';
import notificationReducer from './slices/notificationSlice';
import pregnancyCareReducer from './slices/pregnancyCareSlice';
import pregnancyJournalReducer from './slices/pregnancyJournalSlice';
import tagReducer from './slices/tagSlice';
import themeReducer from './slices/themeSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme', 'language'], // Only persist these slices
};

const rootReducer = combineReducers({
  auth: authSlice,
  app: appSlice,
  theme: themeReducer,
  language: languageSlice,
  articles: articleSlice,
  category: categorySlice,
  tag: tagReducer,
  baby: babySlice,
  familyMember: familyMemberSlice,
  pregnancyJournals: pregnancyJournalReducer,
  pregnancyCares: pregnancyCareReducer,
  badges: badgeReducer,
  babyBadges: babyBadgesCollectionSlice,
  notifications: notificationReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
      },
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
