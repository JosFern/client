export default function ListCheckIn(props) {
    return (
        <div className="bg-white flex flex-col items-center mt-4 px-4 py-2 w-full">
            
            <h1 className="text-center font-bold mb-6 text-4xl">Checked In:</h1>

            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>Room#</th>
                        <th>Customer</th>
                        <th>Day Stays</th>
                        <th>CheckIn Time</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((room, index)=> (
                        <tr key={index} className="text-gray-800 font-medium text-center">
                            <td>{room.number}</td>
                            <td>{room.name}</td>
                            <td>{room.day_stays}</td>
                            <th>{room.checkin}</th>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}