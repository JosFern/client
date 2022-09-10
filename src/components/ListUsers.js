export default function ListUsers(props) {

    const handleClick = (user) => {

        props.handleEdit(user);
        props.toggle(true);
    }
    return (
        <div className="bg-white flex flex-col items-center mt-4 px-4 py-2 w-full">
            <h1 className="text-center font-bold mb-6 text-4xl">Users:</h1>

            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((user, index)=> (
                        <tr key={index} className="text-gray-800 font-medium text-center">
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <th>{user.role}</th>
                            <th><button className="bg-[#273c75] px-3 py-1 text-white rounded-md hover:bg-[#40739e]" onClick={() => handleClick(user)}>Edit</button></th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}