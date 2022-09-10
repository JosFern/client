import { createSlice } from '@reduxjs/toolkit';
// import { useEffect } from 'react';

export const logStore = createSlice({
    name: 'log',
    initialState: {
        registered: [],
        loggedIn: {
            id: '',
            name: '',
            email: '',
            role: ''
        }
    },
    reducers: {
        setLogged: (state, action) => {
            state.loggedIn = action.payload
        },
        addRegister: (state, action) => {
            const users = [...action.payload]
            
            state.registered = users
        },


        updateUser: (state, action) => {

            for (let i = 0; i < state.registered.length; i++){
                if (state.registered[i].email === state.loggedIn.email) {
                    state.registered[i] = action.payload
                    break;
                }
            }

        },
        editUser: (state, action) => {
            for (let i = 0; i < state.registered.length; i++){
                if (state.registered[i].email === action.payload.old) {
                    state.registered[i] = action.payload.new
                    break;
                }
            }
        }
    }
})

export const { setLogged, addRegister, updateUser, editUser } = logStore.actions

export default logStore.reducer