import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListUsers from "../components/ListUsers";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal"
import { Link } from "react-router-dom";
import { addRegister } from "../store/log";
import { FaUser, FaDollarSign, FaBed, FaCalendarCheck } from "react-icons/fa";
import ListCheckIn from "../components/LIstCheckIn";

export default function Admin() {

  const user = useSelector(state => state.log)
  const dispatch = useDispatch()
  // const [usersata, getUsersData] = useState([])

  const [id, setId] = useState('')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState(false)

  const [validate, setValidate] = useState('')

  const [checkins, setCheckins] = useState([])
  const [roomsNum, setRoomsNum] = useState('')


  useEffect(() => {
    async function getUsersAPI() {
      
      const result = await axios.get('http://localhost:8080/users')

      dispatch(addRegister(result.data.filter(user => user.role !== 'admin')))

      const rooms = await axios.get('http://localhost:8080/rooms')

      setRoomsNum(rooms.data.length)

      const userCheckins = []

      for (let i = 0; i < rooms.data.length; i++){
        if (rooms.data[i].user_id !== null) {
          
          const readDate = new Date(rooms.data[i].checkin).toLocaleDateString('en-US', {
            month: "short",
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
            
          });
          
          userCheckins.push({number:rooms.data[i].number, name: rooms.data[i].name, day_stays: rooms.data[i].day_stays, checkin: readDate,})
        }
      }

      setCheckins(userCheckins)


    }
    getUsersAPI()

    
  },[dispatch])

  const handleEdit = (user) => {
    setId(user.id)
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();

    setValidate('')

    const user = { id: id, name: name, email: email, password: password }

    axios.put('http://localhost:8080/users', JSON.stringify(user)).then(res => {
      getUsers()
      setModal(false);
    }).catch(err => {
      if (err.response.data === -1 ) setValidate('Email already exist!')
    })
    
  }

  const getUsers = () => {
    axios.get('http://localhost:8080/users').then(res => {
      const users = res.data
      dispatch(addRegister(users.filter(user => user.role !== 'admin')))
      // getUsersData(res.data)
    })
  }


  return (
    <div>
      <div className="p-12 flex flex-col min-h-screen text-gray-700 bg-[#fff] bg-gradient-to-r from-[#f6d365] to-[#fda085]">

        <div className="grid gap-4 grid-cols-4 h-24 w-full">
          <div className=" bg-white shadow-lg flex justify-center items-center rounded-md">
            <div className="rounded-l-md px-6 w-full h-full bg-[#c23616] relative">
              <FaBed className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] " size="40px" color="white"/>
            </div>
            <h1 className="text-3xl font-bold ml-4">{roomsNum}</h1>
            <h1 className="text-3xl font-bold mx-4">Rooms</h1>
          </div>

          <div className=" bg-white shadow-lg flex justify-evenly  items-center rounded-md">
            <div className="rounded-l-md px-6 w-[100%] h-full bg-[#0097e6] relative">
              <FaUser className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] " size="40px" color="white"/>
            </div>
            <h1 className="text-3xl font-bold ml-4">{user.registered.length}</h1>
            <h1 className="text-3xl font-bold mx-4">Users</h1>
          </div>

          <div className=" bg-white shadow-lg flex justify-center items-center rounded-md">
            <div className="rounded-l-md px-6 w-[100%] h-full bg-[#192a56] relative">
              <FaCalendarCheck className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] " size="40px" color="white"/>
            </div>
            <h1 className="text-3xl font-bold ml-4">{checkins.length}</h1>
            <h1 className="text-3xl font-bold mx-4">Checkin</h1>
          </div>

          <div className=" bg-white shadow-lg flex justify-center items-center rounded-md">
            <div className="rounded-l-md px-6 w-[100%] h-full bg-[#44bd32] relative">
              <FaDollarSign className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] " size="40px" color="white"/>
            </div>
            <h1 className="text-3xl font-bold ml-4">1M</h1>
            <h1 className="text-3xl font-bold mx-4">Earned</h1>
          </div>

        </div>


        {/*--------------------------------------------------------------------------*/}
        <div className="mt-4">

          <div className="flex justify-between">
            <div className="basis-[20%] sticky top-[70px] self-start h-full bg-white rounded-md shadow-lg p-3">
              <h1 className=" font-bold text-2xl">Current Admin:</h1>
              <Link className="block font-bold text-4xl mt-4 border-b-2 hover:text-[#e1b12c]" to="/profile">{user.loggedIn.name}</Link>
              <h1 className=" font-bold text-2xl mt-6">to Rooms page:</h1>
              <Link className="block font-bold text-4xl mt-4 border-b-2 hover:text-[#e1b12c]" to="/rooms">Rooms</Link>
            </div>

            <div className="basis-[37%] sticky top-[70px] self-start h-full bg-white rounded-md shadow-lg p-3">
              {user.registered.length > 0 && <ListUsers users={user.registered.filter(user => user.role === "user")} toggle={setModal} handleEdit={handleEdit} />}
            </div>

            <div className="basis-[37%] sticky top-[70px] self-start h-full bg-white rounded-md shadow-lg p-3">
              <ListCheckIn users={checkins} />
            </div>
          </div>
        </div>
      </div>

      {modal && <Modal toggle={setModal} >
          <form onSubmit={handleSubmit}>
            <h1 className="font-bold tracking-normal text-gray-800">Name:</h1>
            <FormInput label="Name" type="text" value={name} setData={setName} />
            <h1 className="font-bold tracking-normal text-gray-800">Email:</h1>
            <FormInput label="Email" type="text" value={email} setData={setEmail} />
            <h1 className="font-bold tracking-normal text-gray-800">Password:</h1>
            <FormInput label="Password" type="text" value={password} setData={setPassword} />
            <p className="font-semibold text-center text-[#c23616]">{validate}</p>

            <button className="mt-6 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full">Edit</button>
          </form>
        </Modal>}
    </div>
  );
}