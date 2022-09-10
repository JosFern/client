export default function ListRooms(props) {

    const handleClick = (room) => {
        props.checkinRoom(room)
    }

    return (
        <div className="bg-white flex flex-col items-center rounded-md drop-shadow-2xl px-4 py-2 w-[100%]">
            <h1 className="font-bold text-center mb-6 text-4xl text-gray-800">List of Rooms:</h1>
            <div className="grid grid-cols-5 w-full">
                
                {props.rooms.map((room, index) => (
                    <div key={index} onClick={()=>handleClick(room)} className={room.availablity? 'bg-[#0097e6] m-1 flex flex-col justify-center items-center rounded-md text-white font-bold drop-shadow-md relative cursor-pointer' : 'bg-red-500 m-1 flex flex-col justify-center items-center rounded-md text-white font-bold relative cursor-pointer'}>
                        <p>{ room.room}</p>
                        <p>{room.availablity ? 'Open' : 'Close'}</p>
                    </div>
                ))}
                
            </div>
        </div>
    )
}