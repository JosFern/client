import { createSlice } from '@reduxjs/toolkit';
// import { useSelector } from "react-redux";

// const user = useSelector(state => state.log)

export const hotelStore = createSlice({
    name: 'hotel',
    initialState: {
        rooms: []
    },
    reducers: {
        loadRooms: (state, action) => {
            state.rooms = [...action.payload];
        },

        // getUserRoom: (state, action) => {
        //     for (let i = 0; i < state.rooms.length; i++){
        //         if(state.rooms[i].person?.email === action.payload) 
        //     }
        // }
    }
})

export const { loadRooms } = hotelStore.actions

export default hotelStore.reducer