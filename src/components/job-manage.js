import { React, useState, useReducer,useEffect} from 'react';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

let ManageJob = () => {
    const goto = useNavigate();
    const { id } = useParams();
    // const [job, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [accounts, setAccounts] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [file, setFile] = useState('');
    const [isFetchingData, setIsFetchingData] = useState(false);

    const template = async()=> {
         await axios.get(process.env.REACT_APP_API_URL +'/admin/settings')
         .then(response => {
            setAccounts(response.data.accounts);
            setTemplates(response.data.templates);
        }).catch(err => {
            console.log(err);
        });
    };

    const getData = async()=> {
        setIsLoading(true);
        await axios.get(process.env.REACT_APP_API_URL +'/job', {
            params: {
                jobId : id,
            }
        }).then(response => {
            setIsLoading(false)
            // setData(response.data.data);
            // setTemplate(response.data.template);
            Object.keys( response.data.data ).forEach(( name, idx ) => {
                // console.log( idx, name, response.data.data[ name ] );
                setFormInput({ [name] : response.data.data[ name ] });
            });
        }).catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        if( id ) {
            getData();
        }
        template();
    }, [id]);

    const [job, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            jobId       : id,
            accountId   : 1,
            templateId  : 0,
            batch       : '',
            total       : 0,
            files       : 0,
            background  : 1,
            data_file   : '',
            status      : 1,
            clone       : 0,
        }
    );

    const handleInput = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ [name] : newValue });
    };

    const onFileChange = (e) => {
        setFile( e.target.files[0] );
    }  

    const saveData = (evt) => {
        evt.preventDefault();
        setIsFetchingData(true)
        const formData = new FormData();
        if( id ) {
            formData.append('jobId', job.jobId);
        }
        formData.append('accountId', job.accountId);
        formData.append('templateId', job.templateId);
        formData.append('status', job.status);
        formData.append('clone', job.clone);
        formData.append('batch', job.batch);
        formData.append('background', job.background);
        formData.append('total', job.total);
        formData.append('files', job.files);
        if( job.templateId ) {
            var temdx = templates.findIndex( s => s.metaId === parseInt( job.templateId )  );
            if( temdx !== -1 ) {
                formData.append('meta_value', JSON.stringify( templates[temdx].meta_value ) );
            }
        }
        formData.append('file', file);

        axios.post( process.env.REACT_APP_API_URL +'/job', formData )
        .then((response) => {
            alert(response.data.message);
            setIsFetchingData(false);
            if( response.data.status === 'success' ) {
                goto( '/admin/job/' + response.data.data.jobId );
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    if( isLoading ) {
        return
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status" style={{borderWidth: '1px'}}>
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    }

    return(
    <div className="container-lg">
        <div className="row">
            <div className="col-12">
                <h3 className="text-primary">{ job.jobId ? 'Manage Job #' + id : 'Add a Job' }</h3>
                <form onSubmit={saveData} encType="multipart/form-data">
                    <div className='row'>
                        <div className='col-md-4 mb-3'>
                            <label htmlFor='name'> Account <span className='text-danger'>*</span></label>
                            <select className='form-select' value={job.accountId} required  name='accountId' onChange={handleInput} >
                                <option value="0" disabled>--Select Account--</option>
                                {accounts.map(row=>{
                                    return(
                                        <option key={row.metaId} value={row.metaId}>{row.meta_key || ''}</option>
                                    )
                                })}
                            </select>
                        </div>
                    
                        <div className='col-md-4 mb-3'>
                            <label htmlFor='templateId'>Template <span className='text-danger'>*</span></label>
                            <select className='form-select' value={job.templateId} name='templateId' required onChange={handleInput}>
                                <option value="0" disabled>--Select Template--</option>
                                {templates.map(row=>{
                                    return(
                                        <option key={row.metaId} value={row.metaId}>{row.meta_value.title || row.meta_key}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className='col-md-4 mb-3'>
                            <label htmlFor='batch'>Batch <span className='text-danger'>*</span></label>
                            <input type='text' className='form-control' defaultValue={job.batch} name='batch' required onChange={handleInput} />
                        </div>

                        <div className='col-md-4 mb-3'>
                            <label htmlFor='background'>Show Background <span className='text-danger'>*</span> </label><br/>
                            <div className="form-check form-check-inline mt-2">
                                <input className="form-check-input" type="radio" name="background" id="background1" value="1" onChange={handleInput} defaultChecked={(parseInt(job.background) === 1 ? true : false)}/>
                                <label className="form-check-label" htmlFor="background1">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="background" id="background2" value="0" onChange={handleInput} defaultChecked={(parseInt(job.background) === 0 ? true : false)}/>
                                <label className="form-check-label" htmlFor="background2">No</label>
                            </div>
                        </div>

                        <div className='col-md-4 mb-3'>
                            <label htmlFor='status'> Status <span className='text-danger'>*</span> </label><br/>
                            <div className="form-check form-check-inline mt-2">
                                <input className="form-check-input" type="radio" name="status" id="status0" value="0" onChange={handleInput} defaultChecked={(parseInt(job.status) === 0 ? true : false)}/>
                                <label className="form-check-label" htmlFor="status0">Draft</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="status" id="status1" value="1" onChange={handleInput} defaultChecked={(parseInt(job.status) === 1 ? true : false)}/>
                                <label className="form-check-label" htmlFor="status1">Print</label>
                            </div>
                        </div>

                        <div className='col-md-4 mb-3'>
                            <label htmlFor='status'>Duplicate</label><br/>
                            <div className="form-check form-check-inline mt-2">
                                <input className="form-check-input" type="radio" name="clone" id="clone_1" value="1" onChange={handleInput} defaultChecked={(parseInt(job.clone) === 1 ? true : false)}/>
                                <label className="form-check-label" htmlFor="clone_1">No</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="clone" id="clone_2" value="2" onChange={handleInput} defaultChecked={(parseInt(job.clone) === 2 ? true : false)} />
                                <label className="form-check-label" htmlFor="clone_2">Yes</label>
                            </div>
                        </div>

                        <div className='col-md-4 mb-3'>
                            <label htmlFor='data_file'> Upload file{ job.data_file ? null : <span className='text-danger'>*</span> }</label>
                            <input type='file' onChange={onFileChange} accept=".csv" className='form-control' name='data_file' required={ job.data_file ? false : true }  />
                        </div>

                        { job.jobId &&
                            <>
                            <div className='col-md-4 mb-3'>
                                <label htmlFor="total">Total <span className="text-danger">*</span></label>
                                <input type="number" step="1" className='form-control' defaultValue={job.total} name="total" required onChange={handleInput} />
                            </div>
                            <div className='col-md-4 mb-3'>
                                <label htmlFor="files">Files <span className="text-danger">*</span></label>
                                <input type="number" step="1" className='form-control' defaultValue={job.files} name="files" required onChange={handleInput} />
                            </div>
                            </>
                        }
                        
                        <div className="col-12 mt-3">
                            <button className="btn btn-primary" type="submit" disabled={isFetchingData} style={{minWidth : '5.5rem'}}>
                                { isFetchingData ? 
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{borderWidth: '1px'}}></span>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon icon-save" viewBox="0 0 16 16">
                                        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
                                    </svg>
                                }
                                <span className="ms-2">Save</span>
                            </button>

                            <Link className="btn btn-outline-dark ms-3" to={ id ? '/admin/job/' + id : '/admin/jobs' }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon icon-chevron-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                </svg>
                                <span className="ms-1">Back</span>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
}
export default ManageJob;