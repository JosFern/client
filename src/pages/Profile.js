import Modal from "../components/Modal"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaUserCog, FaUser } from 'react-icons/fa'


export default function Profile() {

    
    const [modalAccount, setModalAccount] = useState(false)
    const [modalPassword, setModalPassword] = useState(false)
    const user = useSelector(state => state.log);

    
    const [validate, setValidate] = useState('')
    
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('logged_in')
        navigate('/login')
    }

    const handleSubmitAccount = (e) => {
        e.preventDefault();

        setValidate('')

        const userUpdate = {changeType: 'profile', id: user.loggedIn.id, name: name, email: email }

        axios.put('http://localhost:8080/account', JSON.stringify(userUpdate)).then(res => {
            if (res.status === 200) {
                localStorage.setItem("logged_in", JSON.stringify({ id: user.loggedIn.id, name: name, email: email, role: user.loggedIn.role }))
                setModalAccount(false);
                navigate('/')
            }
        }).catch(err => {
            if (err.response.data === -1) setValidate('Email already exist!')
        })
        
        
    }

    const editUserAccount = () => {
        setName(user.loggedIn.name)
        setEmail(user.loggedIn.email)
        setValidate('')
        setModalAccount(true)
    }

    const editUserPassword = () => {
        setValidate('')
        setModalPassword(true)
    }

    const handleSubmitPass = (e) => {
        e.preventDefault();

        setValidate('')

        const valid = validation();

        if (valid === 'ok') {
            
            const userUpdate = {changeType: 'password', id:user.loggedIn.id, oldPass: oldPass, newPass:
                newPass
            }
            axios.put('http://localhost:8080/account', JSON.stringify(userUpdate)).then(res => {
                if (res.status === 200) {
                    setModalPassword(false);
                    navigate('/')
                }
            }).catch(err => {
                if (err.response.data === -1) setValidate('Incorrect Password!')
            })
        }

        
        
    }

    const validation = () => {
        if (newPass.length < 8) return setValidate('Password must be 8 characters or longer!');
        
        if (newPass !== confirmPass) return setValidate('Passwords must be matched!');

        return 'ok'
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-[#fff] bg-gradient-to-r from-[#f6d365] to-[#fda085]">

            <div className="bg-white min-w-[300px] flex flex-col items-center p-3 drop-shadow-2xl rounded-xl">
                <div className="rounded-full bg-[#fbc531] w-[60px] h-[60px] relative">{user.loggedIn.role==='admin'?<FaUserCog className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%]" size="30px" color="#fff" />: <FaUser className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%]" size="30px" color="#fff" />}</div>

                <h1 className="font-bold mt-8 text-2xl tracking-normal text-gray-800">{user.loggedIn.name}</h1>
                <h1 className="font-semibold text-gray-500 mt-2">{user.loggedIn.email}</h1>
                <h1 className="font-semibold text-gray-500 mt-2">Role: {user.loggedIn.role}</h1>

                <button className=" mt-6 bg-[#192a56] text-white w-full py-2 rounded-md font-semibold tracking-wide hover:bg-[#273c75] hover:drop-shadow-xl" onClick={editUserAccount}>Update Account</button>

                <button className=" mt-6 bg-[#192a56] text-white w-full py-2 rounded-md font-semibold tracking-wide hover:bg-[#273c75] hover:drop-shadow-xl" onClick={editUserPassword}>Change Password</button>

                <button className=" mt-6 bg-[#c23616] text-white w-full py-2 rounded-md font-semibold tracking-wide hover:bg-[#e84118] hover:drop-shadow-xl" onClick={handleLogout}>Logout</button>
            </div>

            {modalAccount && <Modal toggle={setModalAccount}>
                <form onSubmit={handleSubmitAccount}>
                    <h1 className="font-bold tracking-normal text-gray-800 mb-1">Name:</h1>
                    <input className="outline-none p-2 rounded-md ring-2 ring-[#dcdde1] ring-offset-[-1px] w-full" required type="text" value={name} onChange={(e)=> setName(e.target.value) } />
                    
                    <h1 className="font-bold tracking-normal text-gray-800 mt-4 mb-1">Email:</h1>
                    <input className="outline-none p-2 rounded-md ring-2 ring-[#dcdde1] ring-offset-[-1px] w-full" required type="text" value={email} onChange={(e)=> setEmail(e.target.value) } />

                    <p className="font-semibold text-center text-[#c23616]">{validate}</p>

                    <button className="mt-6 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full">Update Account</button>

                </form>
            </Modal>}

            {modalPassword && <Modal toggle={setModalPassword}>
                <form onSubmit={handleSubmitPass}>
                    <h1 className="font-bold tracking-normal text-gray-800 mt-4 mb-1">Current password:</h1>
                    <input className="outline-none p-2 rounded-md ring-2 ring-[#dcdde1] ring-offset-[-1px] w-full" required type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />

                    <h1 className="font-bold tracking-normal text-gray-800 mt-4 mb-1">New password:</h1>
                    <input className="outline-none p-2 rounded-md ring-2 ring-[#dcdde1] ring-offset-[-1px] w-full" required type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />

                    <h1 className="font-bold tracking-normal text-gray-800 mt-4 mb-1">Confirm password:</h1>
                    <input className="outline-none p-2 rounded-md ring-2 ring-[#dcdde1] ring-offset-[-1px] w-full" required type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />

                    <p className="font-semibold text-center text-[#c23616]">{validate}</p>

                    <button className="mt-6 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full">Update password</button>

                </form>
            </Modal>}
        </div>
    )
}