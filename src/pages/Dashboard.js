import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import ListRooms from "../components/ListRooms";
// import { checkinUser, checkoutUser } from "../store/hotel";
import { Link } from "react-router-dom";
import ListRooms from "../components/ListRooms";
import axios from "axios";
import { loadRooms } from "../store/hotel";
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";

export default function Dashboard() {

  const userInfo = useSelector(state => state.log)
  const hotel = useSelector(state => state.hotel);

  const dispatch = useDispatch()

  const [checkInModal, setCheckInModal] = useState(false)
  const [checkOutModal, setCheckOutModal] = useState(false)

  const [days, setDays] = useState('')
  const [room, setRoom] = useState({})//{id: 21, room: 'A7', availablity: false, person: {…}}

  const [currRoom, setCurrRoom] = useState(null);
  const [validate, setValidate] = useState('')
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [payment, setPayment] = useState({ total: 0, subtotal: 0 })
  const [readDate, setReadDate] = useState('')
  

  const user = JSON.parse(localStorage.getItem("logged_in"))

  useEffect(() => {
    async function getRoomsAPI() {
      
      const result = await axios.get('http://localhost:8080/rooms')

      const hotelRooms = [];

      result.data.forEach(room => {
        hotelRooms.push(({ id: room.roomId, room: room.number, availablity: room.user_id === null ? true : false, person: room.user_id === null ? room.user_id : { name: room.name, email: room.email } }))

        if (room.user_id === user.id) {

          const readDate = new Date(room.checkin).toLocaleDateString('en-US', {
            month: "short",
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
            
          })
          setReadDate(readDate)
          setCurrRoom({checkin: room.checkin, day_stays: room.day_stays, roomId: room.roomId, number: room.number}) //set current room
        } 

      }); 

      dispatch(loadRooms(hotelRooms))


    }
    
    getRoomsAPI()

  }, [dispatch, user.id])


//gets rooms
  const getUserRoom = async () => {
    const rooms = await axios.get('http://localhost:8080/rooms')

    const hotelRooms = []
  
    rooms.data.forEach(room => {
      hotelRooms.push(({ id: room.roomId, room: room.number, availablity: room.user_id === null ? true : false, person: room.user_id === null ? room.user_id : { name: room.name, email: room.email } }))

      if (room.user_id === user.id) {

          const readDate = new Date(room.checkin).toLocaleDateString('en-US', {
            month: "short",
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
            
          })
          setReadDate(readDate)
          setCurrRoom({checkin: room.checkin, day_stays: room.day_stays, roomId: room.roomId, number: room.number}) //set current room
        } 
    });

    dispatch(loadRooms(hotelRooms))
  }


//validates room availability
  const checkinRoom = (room) => {
    setRoom(room)

    if (currRoom !== null) {
      alert(`${userInfo.loggedIn.name} is already check in to ${currRoom.number}`);
    } else {
      if (!room.availablity) {
        alert('someone else checked-in here')
      } else {
        setCheckInModal(true)
      }
    }
  }
  
  //executes if user is checkin in
  const handleCheckin = (e) => {
    e.preventDefault()

    setValidate('')

    const today = new Date();

    const checkinInfo = {room_id:room.id, user_id: userInfo.loggedIn.id, day_stays: days, checkin: today}

    axios.post('http://localhost:8080/check-in',JSON.stringify(checkinInfo)).then(res => {
      if (res.status === 200) {
        getUserRoom()
        setCheckInModal(false)
        setValidate('')
        setDays('')
      }
    }).catch(err => {
      if (err === 0) setValidate('Room does not exist!')
      
      if (err === 0) setValidate('Room is already occupied!')
    })
  }

//displays checkout room modal and calculate fee
  const checkOutRoom = () => {
    calculateCheckOut()
    setCheckOutModal(true)
  }



//executes if user checks out
  const handleCheckOut = (e) => {
    e.preventDefault()
    const roomId = { room_id: currRoom.roomId }
    
    axios.put('http://localhost:8080/check-out', JSON.stringify(roomId)).then(res => {
      if (res.status === 200) {
        setCheckOutModal(false)
        getUserRoom()
        setCurrRoom(null)
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setPayment({ total: 0, subtotal: 0 })
        setReadDate('')

      } 
      
    }).catch(err => console.log(err))
  }

  //calculate total payment
  const calculateCheckOut = () => {
    
    const currtime = new Date().getTime();

    const checkinTime = new Date(currRoom.checkin).getTime()

    const totalSeconds = (currtime - checkinTime) / 1000

    const days = Math.floor(totalSeconds / 3600 / 24)
    const hours = Math.floor(totalSeconds / 3600) % 24
    const minutes = Math.floor(totalSeconds / 60) % 60
    const seconds = Math.floor(totalSeconds) % 60

    setTime({ days, hours, minutes, seconds })
    


    const dailyRating = days * 300 //300 per day

    const subtotal = days > 3 ? dailyRating - (dailyRating * .1)/* apply 10%discount */ : dailyRating;

    const exceedingHours = days >= currRoom.day_stays ? (hours * 50) + ((currRoom.day_stays - currRoom.day_stays) * 24) * 50/*50 per hour*/ : 0;

    
    setPayment({ total: subtotal + exceedingHours, subtotal})
  }


  return (
    <div>

      <div className="flex min-h-screen justify-center items-center gap-4 pt-12 bg-[#fff] bg-gradient-to-r from-[#f6d365] to-[#fda085]">

        <div className="bg-white flex self-start sticky basis-[30%] flex-col items-center justify-center rounded-md drop-shadow-2xl px-4 py-2 mb-4">

          <h1 className="text- w-full font-bold text-4xl text-gray-800 text-center border-b-2 pb-4 mt-4">Welcome <Link className="hover:text-[#e1b12c]" to="/profile">{userInfo.loggedIn.name}</Link>!!</h1>

          <h1 className="text- w-full font-bold text-xl text-gray-500 text-center mt-12">Status: {currRoom === null ? <span className="text-[#c23616]">Not checked in</span>: <span className="text-[#fbc531]">Checked In</span> }</h1>

          {currRoom !== null &&
            <div className="p-4 border-solid border-2 border-[#192a56]">
              <h1 className="font-bold tracking-normal text-gray-800 mb-1">Room: <span className="text-[#0097e6]">{currRoom.number}</span></h1>

              <h1 className="font-bold tracking-normal text-gray-800 mb-1">Days stay: <span className="text-[#0097e6]">{currRoom.day_stays}</span></h1>
              
              <h1 className="font-bold tracking-normal text-gray-800 mb-1">Checkin: <span className="text-[#0097e6]">{readDate}</span></h1>
          </div> }


          {currRoom !== null && <button className=" mt-6 bg-[#c23616] text-white w-[200px] py-2 rounded-md font-semibold tracking-wide hover:bg-[#e84118] hover:drop-shadow-xl" onClick={checkOutRoom}>Checkout Room: { currRoom.number}</button>}
        </div>
        <div className="flex self-start basis-[60%] sticky top-0">
          <ListRooms rooms={hotel.rooms} checkinRoom={checkinRoom} />
        </div>

      </div>

      {checkInModal && <Modal toggle={setCheckInModal}>
        <form onSubmit={handleCheckin}>
          <h1 className="font-bold tracking-normal text-gray-800 mb-1">Room: <span className="text-[#0097e6]">{ room.room}</span></h1>
          <FormInput type="text" label="Days Stay" value={days} setData={setDays} />
          <p className="font-semibold text-center text-[#c23616]">{validate}</p>
          <button type="submit" className="mb-3 bg-[#192a56] hover:bg-[#273c75] font-semibold text-center rounded-md py-1 text-white w-full">Submit</button>
        </form>

      </Modal>}

      {checkOutModal && <Modal toggle={setCheckOutModal}>
        <form className="px-4" onSubmit={handleCheckOut}>
          <h1 className="font-bold tracking-normal text-gray-800 mb-1">Are you sure you wanna checkout?</h1>
          <h1 className="font-bold tracking-normal text-gray-800 mb-1">Room: <span className="text-[#0097e6]">{currRoom.number}</span></h1>

            <h1 className="font-bold tracking-normal text-gray-800 mb-1">Days stay: <span className="text-[#0097e6]">{currRoom.day_stays}</span></h1>

          <h1 className="font-bold tracking-normal text-gray-800 mb-1">Checkin Time:</h1>

          <div className="flex gap-3">
            <h1 className="font-bold tracking-normal text-gray-800 mb-1">Day/s: <span className="text-[#0097e6]">{time.days}</span></h1>
            <h1 className="font-bold tracking-normal text-gray-800 mb-1">hour/s: <span className="text-[#0097e6]">{time.hours}</span></h1>
            <h1 className="font-bold tracking-normal text-gray-800 mb-1">minutes: <span className="text-[#0097e6]">{time.minutes}</span></h1>
            <h1 className="font-bold tracking-normal text-gray-800 mb-1">seconds: <span className="text-[#0097e6]">{time.seconds}</span></h1>
          </div>

          <h1 className="font-bold tracking-normal text-gray-800 mb-1 my-4">Subtotal: <span className="text-[#0097e6]">P{payment.subtotal}</span></h1>
          
          <h1 className="font-bold tracking-normal text-gray-800 mb-1 border-t-2 my-4">Total Payment: <span className="text-[#0097e6]">P{payment.total}</span></h1>

          <button type="submit" className="my-3 bg-[#192a56] hover:bg-[#273c75] font-semibold text-center rounded-md py-1 text-white w-full">Check Out</button>
        </form>
      </Modal>}
    </div>
  );
}
