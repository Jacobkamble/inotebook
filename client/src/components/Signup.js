import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';

export default function Signup() {

  // let host ='http://localhost:5000'

  const context = useContext(NoteContext);
  const { showAlert } = context;

  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {


    try {
      e.preventDefault();
      const url = `/api/auth/createuser`;

      const response = await axios.post(url, 
        JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
        {
          headers:{
            'Content-Type':'application/json'
          }
        }
        )

        
      console.log(response)
      if ( response.data.success) {
        // save the auth token to localstorage and redirect
        // localStorage.setItem("token", json.authtoken);
        navigate("/login");
        showAlert("Account Created Successfully...!!!", 'success');
      }
      

    } catch (error) {
      showAlert("Please Enter Valid Details...!!!", 'danger');
    }
     

  }

  return (
    <>
      <div className='container mt-2'>
        <h3>Create an account to use iNotebook</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label htmlFor="name" className="form-label">Name</label>
            <input required minLength={5} onChange={onChange} value={credentials.name} name='name' id='name' type="text" className="form-control" aria-describedby="emailHelp" />
          </div>
          <div className="mb-1">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input required onChange={onChange} value={credentials.email} name='email' id='email' type="email" className="form-control" aria-describedby="emailHelp" />
          </div>
          <div className="mb-1">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input required minLength={5} onChange={onChange} value={credentials.password} name='password' type="password" className="form-control" id="password" />
          </div>

          <div className="mb-1">
            <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
            <input required minLength={5} onChange={onChange} value={credentials.setCredentials} name='cpassword' type="password" className="form-control" id="cpassword" />
          </div>

          <button type="submit" className="mt-2 btn btn-danger">Create Account</button>
        </form>
      </div>
    </>
  )
}
