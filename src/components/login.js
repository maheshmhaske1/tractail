import * as React from 'react';
import { useReducer } from 'react';
import axios from 'axios';
let Login=()=>{
    const [user, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
          {
              email       : '',
              password    : ''
          }
      );
    
      const handleInput = evt => {
          const name = evt.target.name;
          const newValue = evt.target.value;
          setFormInput({ [name] : newValue });
      };
      
      const formhandle = evt=>{
        evt.preventDefault();
        axios.post( process.env.REACT_APP_API_URL + '/login', user )
        .then((response) => {
            if( response.data.status === 'success' ) {
                localStorage.setItem('token',response.data.data[0].token);
                localStorage.setItem('user_id',response.data.data[0].userID);
                window.location.href = '/admin/dashboard';
            }else{
                alert(response.data.message);
            }
        }).catch((err) => {
            console.log(err);
        });
      }
    return(
        <section className="container-lg">
            <div className="row">
                <div className='col-md-8 col-lg-6 col-xl-4 mx-auto mt-5'>
                    <h2 className='text-center mb-3'>Login</h2>
                    <form onSubmit={formhandle}>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="email" name='email' onChange={handleInput}/>
                            <label htmlFor="email">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" name='password' id="pwd" onChange={handleInput}/>
                            <label htmlFor="pwd">Password</label>
                        </div>
                        <button type="submit" className="form-control btn btn-lg btn-primary">LOGIN</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
export default Login;