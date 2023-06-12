import { React, useReducer } from 'react';
import axios from 'axios';

let Scanner = () => {
    const [scannerdata, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            code       : '',
            status     : '2'
        }
    );

    const handleInput = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ [name] : newValue });
    };

    const submit = (evt)=>{
        evt.preventDefault();
        axios.post(process.env.REACT_APP_API_URL +'/admin/code/update', scannerdata )
        .then((response) => {
            alert(response.data.message);
            evt.target.reset();
        }).catch((err) => {
            console.log(err);
        });
    }

    return(
        <div className="container-lg">
            <div className="row mt-5">
                <div className="col-md-8 col-lg-6 col-xl-4 mx-auto mt-5">
                    <form className="form" name="form" onSubmit={submit}>
                        <div className="card">
                            <h3 className="card-header">Get QR Code Status</h3>
                            <div className="card-body">
                                <div className='col-12 mb-3'>
                                    <label htmlFor="code">Scan QR Code <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control form-control-lg" id="code" name="code" onChange={handleInput} autoFocus required />
                                </div>
                                <div className='col-12 mb-3'>
                                    <label htmlFor='status'>Status<span className='text-danger'>*</span> </label><br/>
                                    <div className="form-check form-check-inline mt-2">
                                        <input className="form-check-input" type="radio" name="status" id="statusAll" value="1" required onChange={handleInput} />
                                        <label className="form-check-label" htmlFor="statusAll">Scanned</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="status" id="status0" value="2" required onChange={handleInput} defaultChecked />
                                        <label className="form-check-label" htmlFor="status0">Error</label>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary btn-lg w-100" type="submit" disabled={ !scannerdata.code}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-save" viewBox="0 0 16 16" style={{position:'relative',top:'-2px'}}>
                                        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
                                    </svg>
                                    <span className="ms-2">Submit</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Scanner;