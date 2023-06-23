'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const pathname = usePathname();
    const size = pathname.split("/")[2];
    const [ images, setImages ] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/images/" + size)
            .then(response => response.json())
            .then(data => {
                if(data.status === 200) {
                    setImages(data.data)
                }
            })
    },[])

    const handleOpenUrl = (url) => {
        window.open(url);
    }

    const handleBackToDashbord = () => {
        window.location.replace('http://localhost:3000/dashboard');
    }
    
    return(
        <div className='container'>

            <button className='btn btn-primary' onClick={() => handleBackToDashbord()}>Back to Dashboard</button>

            { images && images.length > 0 ? (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope='col'># Phrase</th>
                        <th scope="col">Image</th>
                        <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            images.map(({id,phrase_id,image_url,updated_at}) => 
                                <tr>
                                    <th scope="row">{id}</th>
                                    <td>{ phrase_id }</td>
                                    <td>
                                        <img src={image_url} width="150" onClick={() => handleOpenUrl(image_url)}/>
                                    </td>
                                    <td> { updated_at } </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            ) : <h1>El size que esta intentando ingresar no existe</h1> }
        </div>
    )
}