import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'



const updateUser = () =>{
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const user = location.state?.user;

    const [data, setData] = useState({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        password: user.password || '',
        phone: user.phone || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

        




    return(
        <div>
            <h1>Update User</h1>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Password</th>
                        <th className="px-4 py-2">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2">
                            <input type="text" name="name" value={data.name} onChange={handleChange} />
                        </td>
                        <td className="border px-4 py-2">
                            <input type="text" name="email" value={data.email} onChange={handleChange} />
                        </td>
                        <td className="border px-4 py-2">
                            <input type="text" name="role" value={data.role} onChange={handleChange} />
                        </td>
                        <td className="border px-4 py-2">
                            <input type="text" name="password" value={data.password} onChange={handleChange} />
                        </td>
                        <td className="border px-4 py-2">
                            <input type="text" name="phone" value={data.phone} onChange={handleChange} />
                        </td>

                        <td className="border px-4 py-2">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => navigate('/userDetails')}>Update</button>
                        </td>
                    </tr>
                </tbody>
            </table>    


        </div>
    )   
}