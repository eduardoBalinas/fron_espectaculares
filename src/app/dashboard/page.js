'use client'
import { React,useEffect,useRef,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import axios from 'axios';

export default function Dashboard() {

    const [showState, setShowState] = useState(false);
    const [background, setBackground] = useState();
    const [avatar, setAvatar] = useState();
    const [token, setToken] = useState();
    const [backgroundName, setBackgroundName] = useState();
    const [avatarName, setAvatarName] = useState()
    const [ phraseDetail, setPhraseDetail ] = useState("")
    const [phrasesData, setPhrasesData] = useState([]);
    const [isAddData, setIsAddData] = useState(false);
    const [isSucess, setIsSuccess] = useState();
    const [isFailed, setIsFailed] = useState();
    const [isDelete, setIsDelete] = useState(false);
    const [user, setUser] = useState(typeof window !== "undefined" ? localStorage.getItem("user"): null);
    const [role, setRole] = useState(typeof window !== "undefined" ? localStorage.getItem("role"): null);
    const [ indexEdit, setIndexEdit ] = useState();
    const [ isEdit, setIsEdit ] = useState(false)
    let phraseRef = useRef()
    const uploader = Uploader({ apiKey: "public_12a1yMU4s52UarCh1oFyDsTMz9wU" });
    axios.defaults.headers.common['Authorization'] = `Bearer ${typeof window !== "undefined" ?  localStorage.getItem("authorization") : null}`;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = typeof window !== "undefined" ?  localStorage.getItem("token") : null
    axios.defaults.headers.common['Content-Type'] = "application/json";

    useEffect(() => {
        fetch("https://orca-app-wnq8y.ondigitalocean.app/token")
            .then(response => response.json())
            .then(data => {
                setToken(data["token"])
                typeof window !== "undefined" ? localStorage.setItem("token", data["token"]) : null
            })
            .catch(error => console.log(error))    

    },[])

    useEffect(() => {
       
        axios.get("https://orca-app-wnq8y.ondigitalocean.app/api/getPhrases")
            .then(data => {
                setPhrasesData(data.data.data)
            })
            .catch(error => console.log(error))
    },[isAddData, isDelete])

    const showModal = () => {
        setShowState(!showState)
        setPhraseDetail("")
        setBackgroundName("")
        setAvatarName("")
        setIsEdit(false);
    }

    const handleDelete = (index) => {
        let isConfirm = confirm("Your delete the campaign # " + index)
        if(!isConfirm) return 

        axios.delete("https://orca-app-wnq8y.ondigitalocean.app/api/deletePhrase/" + index)
            .then(data => {
                console.log(data.status);
                if(data.status === 200) {
                    setIsDelete(!isDelete);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleEdit = (index) => {
        setShowState(true);
        let actual_data = phrasesData.filter(info => info.id === index);
        console.log(actual_data);
        setPhraseDetail(actual_data[0].phrase )
        setBackgroundName(actual_data[0].background)
        setAvatarName(actual_data[0].avatar)
        setIsEdit(true);
        setIndexEdit(index)
    }

    const handleSubmit = (event) => {
        event.preventDefault();

          if (isEdit) {
            axios.put("https://orca-app-wnq8y.ondigitalocean.app/api/editPhrase/" + indexEdit ,{
                        "phrase": phraseDetail, 
                       })
                       .then(data => {
                        console.log(data);
                          if(data.data.status === 200) {
                              setIsSuccess(true)
                              setPhraseDetail(phraseDetail)
                          setTimeout(() => {
                              setIsSuccess(false)
                          },3000)
                          }
                          setIsAddData(!isAddData)
                          event.target.reset();
                          handleSetInfoForm()
                          setShowState(false)
                       })
                       .catch(error => {
                          setIsFailed(true)
                          setTimeout(() => {
                              setIsFailed(false)
                          },3000)
                          setShowState(false)
                       })

          }else {
              axios.post("https://orca-app-wnq8y.ondigitalocean.app/api/phrase",{
                           "phrase": phraseDetail,
                           "background": background,
                           "avatar":avatar
                       })
                       .then(data => {
                          if(data.data.status === 200) {
                              setIsSuccess(true)
                          setTimeout(() => {
                              setIsSuccess(false)
                          },3000)
                          }
                          setIsAddData(!isAddData)
                          event.target.reset();
                          handleSetInfoForm()
                          setShowState(false)
                       })
                       .catch(error => {
                          setIsFailed(true)
                          setTimeout(() => {
                              setIsFailed(false)
                          },3000)
                          setShowState(false)
                       })

          }
    }

    const handleBackground = (files) => {
        setBackground(files[0].fileUrl)
        setBackgroundName(files[0].originalFile.file.name)
    }

    const handleAvatar = (files) => {
        setAvatar(files[0].fileUrl)
        setAvatarName(files[0].originalFile.file.name)
    }

    const handleSetInfoForm = () => {
        setBackgroundName(null)
        setAvatarName(null)
        setBackground(null)
        setAvatar(null)
    }

    const handleCreateImage = (id, size) => {
        window.open("https://localstorage-window--aquamarine-mochi-2abaaf.netlify.app/template/" + id + "/" + size)
    }

    const handleLogOut = () => {
        axios.post("https://orca-app-wnq8y.ondigitalocean.app/api/logout")
            .then(data => {
                if(data.status === 200) {
                    typeof window !== "undefined" ? localStorage.removeItem("user"): null
                    typeof window !== "undefined" ? localStorage.removeItem("role"): null
                    typeof window !== "undefined" ? localStorage.removeItem("authorization"): null
                    typeof window !== "undefined" ? localStorage.removeItem("token"): null
                    window.location.replace("https://localstorage-window--aquamarine-mochi-2abaaf.netlify.app/login")
                }
            })
            .catch(error => console.log(error))
    }

    return(
        <div className='container'>
      {
        isSucess ? (
            <div class="alert alert-success" role="alert">
                Success to create campaign 
            </div>
        ): null
      }

      {
        isFailed ? (
            <div class="alert alert-danger" role="alert">
               Failed to add campaign pls review your data
            </div>
        ) : null
      }
            <h1>Bienvenido al dashboard {user} </h1>
            <button className='btn btn-danger' onClick={() => handleLogOut()}>Log out</button>
            <h2 className='m-2'>Campañas Activas: {phrasesData.length}</h2>
            <div className='d-flex justify-content-between w-50'>
                <button className='btn btn-primary' onClick={() => window.location.replace("https://localstorage-window--aquamarine-mochi-2abaaf.netlify.app/images/1920X1080")}>Image 1920X1080</button>
                <button className='btn btn-primary' onClick={() => window.location.replace("https://localstorage-window--aquamarine-mochi-2abaaf.netlify.app/images/1280X720")}>Image 1280X720</button>
                <button className='btn btn-primary' onClick={() => window.location.replace("https://localstorage-window--aquamarine-mochi-2abaaf.netlify.app/images/720X480")}>Image 720X480</button>
            </div>
            {
                role === "admin" ? 
                <button className='btn btn-primary' style={{ position: "relative", left: "88%", marginBottom: "10px" }} onClick={showModal} onChange={() => phraseRef.current.value = ""}>
                    Create Campaing
                </button>
                : null
            }

            <Modal show={showState} onHide={showModal}>
                <Modal.Header closeButton>
                    <h4 className='text-center'> Create Campaign </h4>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleSubmit} method='POST' encType="multipart/form-data">
                <div class="form-group">
                    <label htmlFor="phraseId">Phrase</label>
                    <input type="textarea" class="form-control" id="phraseId" value={phraseDetail}  onChange={event => setPhraseDetail(event.target.value)} />
                </div>
                <div class="form-group mt-2 mb-2">
                <label className='mb-2'>Background</label>
                <UploadButton uploader={uploader}
                                options={{ multi: false }}
                                onComplete={files => handleBackground(files)}>
                    {({onClick}) =>
                    <button class="form-control" onClick={onClick}>
                        { backgroundName ? backgroundName : "Upload your background" }
                    </button>
                    }
                </UploadButton>
                </div>
                <div class="form-group mb-2">
                <label className='mb-2'>Avatar</label>
                <UploadButton uploader={uploader}
                                options={{ multi: false }}
                                onComplete={files => handleAvatar(files)}>
                    {({onClick}) =>
                    <button class="form-control" onClick={onClick}>
                        { avatarName ? avatarName : "Upload your avatar" }
                    </button>
                    }
                </UploadButton>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                </form> 
                </Modal.Body>
                
            </Modal>

            {
                phrasesData ?( <table className="table table-bordered">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Phrase</th>
                    <th scope="col">Background</th>
                    <th scope="col">Avatar</th>
                    <th scope="col-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                 {phrasesData && phrasesData.length > 0 && phrasesData.map(({id,phrase,background,avatar,updated_at}) => 
                    <tr>
                        <th scope="row">{id}</th>
                        <td>{phrase}</td>
                        <td>
                            <img src={background} width="150"/>
                        </td>
                        <td>
                            <img src={avatar} width="150"/>
                        </td>
                        <td className='d-flex'>
                            <div>
                                Create Image size
                                <ul>
                                    <li style={{cursor: "pointer"}} onClick={() => handleCreateImage(id, "1920X1080")}>1920X1080</li>
                                    <li style={{cursor: "pointer"}} onClick={() => handleCreateImage(id, "1280X720")}>1280X720</li>
                                    <li style={{cursor: "pointer"}} onClick={() => handleCreateImage(id, "720X480")}>720X480</li>
                                </ul>
                            </div>
                            {
                                role === "admin" ? <>
                                <FontAwesomeIcon icon={faPencil} color='yellow' style={{height: "2em", marginLeft: "10px", marginRight: "10px", cursor: "pointer"}} onClick={() => { handleEdit(id); }}/>
                                <FontAwesomeIcon icon={faTrash} color='red' style={{height: "2em", marginLeft: "10px", marginRight: "10px", cursor: "pointer"}} onClick={() => {handleDelete(id)}}/>
                                </>
                                :null
                            }
                             </td>
                    </tr>
                ) } 
                </tbody>
                </table>
                )
                : <h3>No hay campañas activas</h3>
            
            }
            
        </div>
    )
}