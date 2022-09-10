import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTable, useRowSelect, usePagination } from 'react-table'
import { Checkbox } from "../components/Checkbox";
import Modal from "../components/Modal";
import { loadRooms } from "../store/hotel";
import FormInput from "../components/FormInput";
import axios from "axios";

export default function Admin() {

    const hotel = useSelector(state => state.hotel);
    const dispatch = useDispatch();

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [roomId, setRoomId] = useState(0);
    const [editRoom, setEditRoom] = useState('');

    const [newRooms, setNewRooms] = useState([{ room: '' }])
    const [validate, setValidate] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/rooms').then(res => {
            const hotelRooms = []
            res.data.forEach(room => {
                hotelRooms.push(({id: room.roomId, room: room.number, availablity: room.user_id === null ? true : false, person: room.user_id === null ? room.user_id : {name: room.name, email: room.email}}))
            });
            dispatch(loadRooms(hotelRooms))
        }).catch(err => console.log(err))
    }, [dispatch])
    
    const setRooms = () => {
        axios.get('http://localhost:8080/rooms').then(res => {
            const hotelRooms = []
            res.data.forEach(room => {
                hotelRooms.push(({id: room.roomId, room: room.number, availablity: room.user_id === null ? true : false, person: room.user_id === null ? room.user_id : {name: room.name, email: room.email}}))
            });
            dispatch(loadRooms(hotelRooms))
        }).catch(err => console.log(err))
    }

    const columns = useMemo(() => [
        {
            Header: 'Room',
            accessor: 'room'
        },
        {
            Header: 'Availability',
            accessor: a => a.availablity ? "Open" : "Close",
        },
        {
            Header: 'Person',
            accessor: p => p.person !== null ? p.person.email : 'None',
        },
    ], [])

    const actionTableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Action",
        Header: "Action",
        Cell: ({ row }) => (
            <div>
                <button className={"rounded-md p-1 text-white font-semibold mr-1 "+(row.values.Person === "None"? 'bg-[#44bd32]':'bg-[#718093]')} disabled={row.values.Person !== 'None'}  onClick={() => openEditRoom(row.original)}>
                Edit
                </button>
                <button className={"rounded-md p-1 text-white font-semibold " + (row.values.Person === "None" ? 'bg-[#c23616]' : 'bg-[#718093]')} disabled={row.values.Person !== 'None'} onClick={() => handleDeleteRoom([{ room_id: row.original.id }])}>
                Delete
                </button>

            </div> 
        ),
      },
    ]);
  };

    const data = useMemo(() => hotel.rooms, [hotel.rooms])
    
    const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    prepareRow,
    selectedFlatRows,
    // selectedRowIds,
  } = useTable({
    columns,
    data
  },
      actionTableHooks,
      usePagination,
      useRowSelect,
  hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />
        },
        ...columns
      ])
    }
        )
    
    const {pageIndex} = state
    
    const handleDeleteRoom = (rows) => {
        axios.delete('http://localhost:8080/rooms', {data: JSON.stringify(rows)}).then(res => {
            setRooms()
        }).catch(err => console.log(err))
    }
    
    const openEditRoom = (row) => {
        setValidate('')
        setRoomId(row.id);
        setEditRoom(row.room)
        setEditModal(true);
    }


    const handleEditRoom = (e) => {
        e.preventDefault()
        setValidate('')

        const isExist = hotel.rooms.filter(hotelRoom => hotelRoom.room === editRoom);

        if (isExist.length > 0) {
            alert('The new room has aleady exist, Please enter a unique room');
        } else {

            const room = { id: roomId, number: editRoom }
    
            axios.put('http://localhost:8080/rooms', JSON.stringify(room)).then(res => {
    
                if (res.status === 200) {
                    setEditModal(false)
                    setEditRoom('')
                    setRooms()
                    setValidate('')
                }
            }).catch(err => {
                if (err.response.data === -1) setValidate('Room already exist');
            })
            
        }

    }
    
    const handleRoomChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...newRooms];
        list[index][name] = value;
        setNewRooms(list);
    }

    const handleAddInput = () => {
        setNewRooms([...newRooms, {room: ''}])
    }

    const handleRemoveInput = (index) => {
        const list = [...newRooms];
        list.splice(index, 1);
        setNewRooms(list);
    }

    const handleRemoveBulkRoom = () => {
        const rooms = []
        for (let i = 0; i < selectedFlatRows.length; i++) {
            // console.log(hotel.rooms[selectedFlatRows[i].index]);
            // console.log(selectedFlatRows[i].index);
            // dispatch(removeRoom(selectedFlatRows[i].index))
            if (hotel.rooms[selectedFlatRows[i].index].person === null) {
                rooms.push({ room_id: selectedFlatRows[i].original.id });
            }

        }

        axios.delete('http://localhost:8080/rooms', { data: JSON.stringify(rooms) } ).then(res => {
            setRooms()
        }).catch(err => console.log(err))


    }

    const ifExist = (hotelRooms, newRooms) => {
        const rooms = []
        for (let i = 0; i < newRooms.length; i++) {
            rooms.push(newRooms[i].room);
        }
        if (new Set(rooms).size !== rooms.length) return null
        
        return hotelRooms.filter(hotelRoom => rooms.includes(hotelRoom.room) ? true : false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const validation = ifExist(hotel.rooms, newRooms);
        setValidate('')
        
        if (validation === null) {
            alert('The new room/s has duplicates, Please enter a unique room');
        }
        else if (validation.length > 0) {
            alert('The new room/s has aleady exist, Please enter a unique room');
        } else {

            axios.post('http://localhost:8080/rooms', JSON.stringify(newRooms)).then(res => {
    
                if (res.status === 200) {
                    
                    setAddModal(false);
                    setNewRooms([{ room: '' }])
                    setRooms()
                }
            }).catch(err => {
                if (err.response.data === -1) setValidate('Room already exist!')
            })
        }
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#fff] bg-gradient-to-r from-[#f6d365] to-[#fda085]">

            <div className="bg-white flex flex-col items-center rounded-md drop-shadow-2xl px-4 py-2">
                <h1 className="font-bold text-3xl text-gray-700 mb-2">List of Rooms:</h1>
                <div className="flex gap-4 mb-2 h-8">

                    <button className="bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full" onClick={() => setAddModal(true)} >Add Room/s</button>

                    <button className="bg-[#c23616] hover:bg-[#e84118] font-semibold text-center rounded-md py-1 text-white w-full" onClick={handleRemoveBulkRoom} >Remove Rooms</button>
                </div>

                
                <table className="border-collapse w-full" {...getTableProps()}>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th className="p-[8px] border-solid border-[1px] py-[6px] text-center bg-[#192a56] text-white border-[#273c75]" {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row)
                        return (
                        <tr className = "even:bg-gray-100 hover:bg-[#ddd] py-[6px] text-center" {...row.getRowProps()}>
                            {row.cells.map(cell => {
                            return <td className = "p-[8px] border-solid border-[1px] border-gray-800" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className="mt-1">
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex +1} of {pageOptions.length}
                        </strong>
                        {' '}
                    </span>
                    <button disabled={!canPreviousPage} className={"mx-2 font-semibold bg-[#192a56] text-white rounded-md p-1 " + (canPreviousPage ? 'bg-[#192a56] hover:bg-[#273c75]': 'bg-[#718093]')} onClick={() => previousPage()}>Previous</button>

                    <button disabled={!canNextPage} className={"mx-2 font-semibold bg-[#192a56] text-white rounded-md p-1 " + (canNextPage ? 'bg-[#192a56] hover:bg-[#273c75]': 'bg-[#718093]')} onClick={() => nextPage()}>Next</button>
                </div>
            </div>
            {addModal && <Modal toggle={setAddModal}>
                {newRooms.map((newRoom, index) => (
                    <div key={index}>
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center gap-1">
                                <input required className="outline-none p-2 rounded-md my-2 ring-2 ring-[#dcdde1] ring-offset-[-1px] w-full" placeholder="Room" name="room" type="text" value={newRoom.room} onChange={(e) => handleRoomChange(e, index)} />
                                
                                {newRooms.length !== 1 && <button type="button" className="mb-3 bg-[#c23616] hover:bg-[#e84118] font-extrabold text-center rounded-md py-0 text-white w-[15px]" onClick={() => handleRemoveInput(index)} >-</button>}
                                
                            </div>
                            
                            {newRooms.length - 1 === index && <button type="button" className="mb-3 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full" onClick={handleAddInput} >+</button>}

                            <p className="font-semibold text-center text-[#c23616]">{validate}</p>
                            
                            {newRooms.length - 1 === index && <button type="submit" className="mb-3 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full">Submit</button>}
                        </form>
                    </div>
                ))}
            </Modal>}

            {editModal && <Modal toggle={setEditModal}>
                <form onSubmit={handleEditRoom}>
                    <FormInput type="text" label="Room" value={editRoom} setData={setEditRoom}></FormInput>

                    <p className="font-semibold text-center text-[#c23616]">{validate}</p>

                    <button type="submit" className="mb-3 bg-[#44bd32] hover:bg-[#4cd137] font-semibold text-center rounded-md py-1 text-white w-full">Submit</button>
                </form>
                
            </Modal>}
        </div>
    )
}