import { configureStore } from '@reduxjs/toolkit';
import logReducer from './log';
import hotelReducer from './hotel';

export default configureStore({
    reducer: {
        log: logReducer,
        hotel: hotelReducer
    }
})