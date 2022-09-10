// import { useSelector } from "react-redux";
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { setLogged } from '../store/log'


export default function RequireAuth(props) {

    // const user = useSelector(state => state.log);
    const dispatch = useDispatch()

    const userInfo = JSON.parse(localStorage.getItem("logged_in"))

    useEffect(() => {

        if (userInfo !== null) {
           dispatch(setLogged({id: userInfo.id, name: userInfo.name, email: userInfo.email, role: userInfo.role, }))
       } 
    }, [dispatch,userInfo])
    
    if (userInfo === null) return <Navigate to='/login' />
    
    if (props.role.includes(userInfo.role)) return props.children

    if (userInfo.role === 'user') return <Navigate to='/' />
    
    return <Navigate to='/admin'/>

    // if (user.loggedIn.email === '') return <Navigate to='/login' />
    
    // if (props.role.includes(user.loggedIn.role)) return props.children
    
    // if (user.loggedIn.role === 'user') return <Navigate to='/'/>
    
    // return <Navigate to='/admin'/>
    
}