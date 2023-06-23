'use client';

import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Login() {

    let usernameRef = useRef();
    let passwordRef = useRef();
    const [csrfToken, setCsrfToken] = useState();
    const [token, setToken] = useState();
    useEffect(() => {
        fetch("http://localhost:8000/token")
            .then(response => response.json())
            .then(data => {
                setCsrfToken(data["token"]);
            })
            .catch(error => {
                console.log(error);
            })
    },[])

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("username", usernameRef.current.value);
        formData.append("password", passwordRef.current.value);
        let headers = {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          }
           
           axios.post("http://localhost:8000/api/login",{"username": usernameRef.current.value, "password": passwordRef.current.value},headers)
            .then(data => {
                setToken(data.data.token);
                localStorage.setItem("authorization", data.data.token)
                localStorage.setItem("user",data.data.user.username)
                localStorage.setItem("role", data.data.user.role)
            })
    }

    if( localStorage.getItem("authorization")) {
        window.location.replace("http://localhost:3000/dashboard")
    } 

    return(
        <div className="container d-flex justify-content-center mt-5">
            <div className="card" style={{width: "30rem"}}>
                <div className="card-header">
                    <h3 className="text-center">Login</h3>
                </div>
                <div className="card-body">
                <form onSubmit={handleSubmit} encType="multiple/form-data" method="POST">
                    <div className="form-group">
                        <label>Username</label>
                        <input ref={usernameRef} type="text" className="form-control mt-2" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" />
                    </div>
                    <div className="form-group mt-2">
                        <label for="exampleInputPassword1">Password</label>
                        <input ref={passwordRef} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </div>

                    <button type="submit" className="btn btn-primary mt-2">Submit</button>
                </form>
                </div>
            </div>
        </div>
    );
}