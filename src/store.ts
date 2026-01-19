import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/slices/cartSlice';
import authReducer from '@/slices/authSlice';
import questionsReducer from '@/slices/questionsSlice';
import productsReducer from '@/slices/productsSlice';
import mainConcernsReducer from "./slices/mainConcernsSlice";
import newPipelinesReducer from "@/slices/newPipelinesSlice";
import servicesReducer from '@/slices/servicesSlice';
import profileReducer from '@/slices/profileSlice';
import ordersReducer from '@/slices/ordersSlice';
import answersReducer from '@/slices/answersSlice';
import cartPhotosRequirementReducer from "./slices/cartPhotosRequirementSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    questions: questionsReducer,
    answers: answersReducer,
    products: productsReducer,
    mainConcerns: mainConcernsReducer,
    newPipelines: newPipelinesReducer,
    services: servicesReducer,
    profile: profileReducer,
    orders: ordersReducer,
    cartPhotosRequirement: cartPhotosRequirementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;