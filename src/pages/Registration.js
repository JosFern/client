import FormInput from "../components/FormInput";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogged } from "../store/log";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Registration() {
    const [query, setQuery] = useSearchParams();
    const [validate, setValidate] = useState()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [role, setRole] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (query.get('role') !== 'admin') {
            setQuery({ role: 'user' })
            setRole(query.get('role'))
        } else {
            setRole(query.get('role'))
        }

        const userInfo = JSON.parse(localStorage.getItem("logged_in"))
        
        if (userInfo !== null) {
            dispatch(setLogged({ id: userInfo.id, name: userInfo.name, email: userInfo.email, role: userInfo.role }))

            navigate('/')
        }

        
    }, [query, setQuery, dispatch, navigate])
    

    //validate user password
    const validation = () => {
        if (password.length < 8) return setValidate('Password must be 8 characters or longer!');
        
        if (password !== confirmPass) return setValidate('Passwords must be matched!');

        return 'ok'
    }


// handles submit upon registering
    const handleSubmit = (e) => {
        e.preventDefault()

        setValidate('')

        const valid = validation();

        if (valid === 'ok') {
            const register = {name:name, email: email, password: password, role: role}
            axios.post('http://localhost:8080/registrations', JSON.stringify(register)).then(res => {

                if (res.status === 200) {
                    setName('')
                    setEmail('')
                    setPassword('')
                    setConfirmPass('')

                    navigate('/login')
                }
            }).catch(err => {
                if (err.response.data === -1) setValidate('Email already exist!')
            })
        }

        
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-[#f0f2f5]" >
            <div className="bg-white min-w-[400px] flex flex-col items-center rounded-md drop-shadow-2xl px-4 py-2" >
                <form className="w-full" onSubmit={handleSubmit}>
                    <FormInput label="Name" type="text" value={name} setData={setName} />
                    <FormInput label="Email" type="text" value={email} setData={setEmail} />
                    <FormInput label="Password" type="password" value={password} setData={setPassword} />
                    <FormInput label="Confirm Password" type="password" value={confirmPass} setData={setConfirmPass} />
                    <p className="font-semibold text-center text-[#c23616]">{validate}</p>
                    <button className="mt-6 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full">Register</button>
                </form>
            </div>
        </div>
  );
}
