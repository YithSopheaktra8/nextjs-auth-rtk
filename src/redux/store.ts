import { configureStore } from "@reduxjs/toolkit"
import accesstokenReducer from "./features/tokenSlice"
import { NextJsApi } from "./api"


export const makeStore = () => {
    return configureStore({
        reducer: {
            accessToken : accesstokenReducer,
            [NextJsApi.reducerPath]: NextJsApi.reducer,
        },
        middleware : (getDefaultMiddleware) => 
            getDefaultMiddleware().concat(NextJsApi.middleware),
    })
}


export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>;