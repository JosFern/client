import FormInput from "../components/FormInput";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogged } from "../store/log";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import lemonstack from '../assets/lemonstack.jpg'
// import wallpaper from '../assets/wallpaper.png'
import { FaLemon } from 'react-icons/fa'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validate, setValidate] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        const userInfo = JSON.parse(localStorage.getItem("logged_in"))
        
        if (userInfo !== null) {
            dispatch(setLogged({ id: userInfo.id, name: userInfo.name, email: userInfo.email, role: userInfo.role }))

            navigate('/')
        }

    }, [dispatch, navigate])
    


    //handles user login
    const handleSubmit = (e) => {
        e.preventDefault()
        setValidate('')

        const credentials = {email: email, password: password}
        axios.post('http://localhost:8080/login', JSON.stringify(credentials)).then(res => {
            
            if (res.status === 200) {
                const user = res.data[0];
                
                localStorage.setItem('logged_in', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }))
                navigate('/')
            }
        }).catch(err => {
            setValidate(err.response.data)
        })

    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-[#f0f2f5]" >
            <div className="bg-white min-w-[800px] grid grid-cols-2 gap-4 items-center rounded-md drop-shadow-2xl" >
                <div className="relative">
                    <img className="w-[100%] h-[500px] rounded-l-md" src={lemonstack} alt="lemonstack" />
                    <h1 className="absolute bottom-[20%] left-[50%] ransform -translate-x-[50%] -translate-y-[50%] text-white font-thin tracking-wide text-4xl">Lemonstack</h1>
                    <strong className="absolute bottom-[8%] left-[50%] ransform -translate-x-[50%] -translate-y-[50%] text-white font-thin w-[80%] text-center">“When life gives you lemons, you squeeze them back into life's eyes!!!”</strong>
                    <strong className="absolute bottom-[3%] left-[50%] ransform -translate-x-[50%] -translate-y-[50%] text-white font-thin w-[80%] text-center">― The Amazing World of Gumball</strong>
                </div>
                <div className="flex flex-col p-4">
                    <div className="flex justify-center items-center gap-1 mb-12">
                        <FaLemon size="20px" color="#fbc531"/>
                        <h1 className="text-2xl font-semibold text-gray-800 "><span className="text-[#fbc531]">Lemon</span>Drop</h1>
                    </div>
                    <h1 className="text-center mb-6 text-2xl font-semibold text-gray-800 ">Welcome to <span className="text-[#fbc531]">Lemon</span>Drop Hotel</h1>
                    <form className="w-full" onSubmit={handleSubmit}>
                        <FormInput label="Email" type="text" value={email} setData={setEmail} />
                        <FormInput label="Password" type="password" value={password} setData={setPassword} />
                        <p className="font-semibold text-center text-[#c23616]">{validate}</p>
                        <button className="w-full py-2 bg-[#192a56] text-white font-semibold tracking-wider rounded-md hover:bg-[#273c75]">Log In</button>
                    </form>
                    <div className="border-solid border-[1px] border-[#f0f2f5] w-full mt-4"></div>
                    <Link className="mt-6 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full" to="/register" >Register</Link>
                </div>
            </div>
        </div>
  );
}
