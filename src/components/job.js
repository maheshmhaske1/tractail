import { React, useState, useReducer, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

let Job = () => {
    const { id } = useParams();
    const [job, setData] = useState({ jobId : id, template : {} });
    const [isLoading, setIsLoading] = useState(false);

    function Loading( placeholders ) {
        placeholders = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        return (<>
            {placeholders.map( (i) => (
                <p className="placeholder-wave mb-0" key={i}>
                    <span className="placeholder col-12 bg-secondary"></span>
                </p>
            ))}
        </>)
    }

    const getData = async()=> {
        setIsLoading(true);
        await axios.get(process.env.REACT_APP_API_URL +'/job', {
            params: {
                jobId : id,
            }
        }).then(response => {
            setIsLoading(false)
            setData(response.data.data);
        }).catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        getData();
    }, [id]);

    const [data, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            jobId  : id,
            print  : '',
            pageNo : 0,
            total  : 0,
        }
    );

    const handleInput = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ [name] : newValue });
    };

    const createQR = (evt) => {
        evt.preventDefault();
        axios.post( process.env.REACT_APP_API_URL +'/job/start', data )
        .then((response) => {
            if( response.data.status === 'success' ) {
                //  Dismiss popup
                var el = document.getElementById('dimissModal');
                if (el.onclick) {
                   el.onclick();
                } else if (el.click) {
                   el.click();
                }
            }
            alert(response.data.message);
            evt.target.reset();
        }).catch((err) => {
            console.log(err);
        });
    }

    const deleteFile = () => {
        axios.post( process.env.REACT_APP_API_URL +'/job/file/delete',job )
        .then((response) => {
            alert(response.data.message);
        }).catch((err) => {
            console.log(err);
        });
    }

    if( isLoading ) {
        return (<Loading rows="20" />)
    }

    return (
        <div className="container-lg">
            <div className="row mb-4">
                <div className='col-md-6'>
                    <h3>Job Id #{id}</h3>
                </div>
                <div className='col-md-6 text-end'>
                     {/* <a href={`${process.env.REACT_APP_API_URL}/job/start?jobId=${id}`} type="button" className="btn btn-primary" target="_blank" rel="noreferrer"> 
                        Add QRCode
                    </a> */}
                    <Link to={`/admin/job/${id}/edit`} type="button" className="btn btn-outline-primary"> 
                        Edit
                    </Link>
                    <button type="button" className="btn btn-outline-dark ms-2" onClick={() => { if (window.confirm('Are you sure you want to delete this PDF files?')) {deleteFile() } } }>
                        Delete Files
                    </button>
                    <button type="button" className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#qrcode">
                        Create PDF
                    </button>
                </div>
            </div>
            <div className="row mb-4 g-4 row-cols-2 row-cols-md-5">
                <div className="col">
                    <Link className="text-decoration-none text-reset" to={`/admin/job/${id}/codes`}>
                        <div className="card border-0 shadow h-100">
                            <div className="card-body p-3 p-lg-4">
                                <h4 className="card-title mb-1">Codes</h4>
                                <div className="card-text fw-bold">{job.total || 0}</div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col">
                    <Link className="text-decoration-none text-reset" to={`/admin/job/${id}/codes?status=1`}>
                        <div className="card border-0 shadow h-100">
                            <div className="card-body p-3 p-lg-4">
                                <h4 className="card-title mb-1">Scanned</h4>
                                <div className="card-text fw-bold">{job.scanned || 0 }</div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col">
                    <Link className="text-decoration-none text-reset" to={`/admin/job/${id}/codes?status=2`}>
                        <div className="card border-0 shadow h-100">
                            <div className="card-body p-3 p-lg-4">
                                <h4 className="card-title mb-1">Error</h4>
                                <div className="card-text fw-bold">{job.error || 0}</div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col">
                    <Link className="text-decoration-none text-reset" to={`/admin/job/${id}/codes?status=0`}>
                        <div className="card border-0 shadow h-100">
                            <div className="card-body p-3 p-lg-4 text-reset">
                                <h4 className="card-title mb-1">Pending</h4>
                                <div className="card-text fw-bold">{job.printed || 0 }</div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col">
                    <Link className="text-decoration-none text-reset" to={`/admin/job/${id}/files`}>
                        <div className="card border-0 shadow h-100">
                            <div className="card-body p-3 p-lg-4">
                                <h4 className="card-title mb-1">Files</h4>
                                <div className="card-text fw-bold">{job.files || 0}</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                        Job Details
                        </div>
                        <table className="table table-bordered mb-0">
                            <tbody>
                                <tr>
                                    <td>Batch</td>
                                    <td>{job.batch}</td>
                                </tr>
                                <tr>
                                    <td>Total Files</td>
                                    <td>{job.files}</td>
                                </tr>
                                <tr>
                                    <td>Total Codes</td>
                                    <td>{job.total}</td>
                                </tr>
                                <tr>
                                    <td>Background</td>
                                    <td>{job.background === 1 ? 'Yes' : 'No'}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>{job.status === 1 ? 'Active' : 'Draft' }</td>
                                </tr>
                                <tr>
                                    <td>Duplicate</td>
                                    <td>{job.clone > 1 ? 'Yes' : 'No'}</td>
                                </tr>
                                <tr>
                                    <td>File</td>
                                    <td><a href={job.data_file_url||'#'} download>{job.data_file||'-'}</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Template Details</div>
                        <table className="table table-bordered mb-0">
                            <tbody>
                            <tr>
                                <td>Title</td>
                                <td>{job.template.title}</td>
                            </tr>
                            <tr>
                                <td>Language</td>
                                <td>{job.template.language}</td>
                            </tr>
                            <tr>
                                <td>Items</td>
                                <td>{job.template.items}</td>
                            </tr>
                            <tr>
                                <td>Pages</td>
                                <td>{job.template.pages}</td>
                            </tr>
                            <tr>
                                <td>Background</td>
                                <td>
                                    <img src={ '/templates/' + job.template.slug + '.jpg' } className='img-fluid' alt={job.template.slug} title={job.template.title} />
                                    {/* <a className="text-reset text-decoration-none" href={job.template.backgroundImage} target="_blank" rel="noreferrer" download>{template.backgroundImage}</a> */}
                                </td>
                            </tr>
                            
                            </tbody>
                            
                        </table>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="qrcode" tabIndex="-1" aria-labelledby="qrcodeModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="qrcodeModalLabel">Generate PDF's</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form method='post' onSubmit={createQR}>
                    <div className="modal-body row">
                        <div className='col-12 mb-3'>
                            <label htmlFor='status'>Print<span className='text-danger'>*</span> </label><br/>
                            <div className="form-check form-check-inline mt-2">
                                <input className="form-check-input" type="radio" name="print" id="statusAll" value="" required onChange={handleInput} defaultChecked/>
                                <label className="form-check-label" htmlFor="statusAll">All</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="print" id="status0" value="0" required onChange={handleInput}  />
                                <label className="form-check-label" htmlFor="status0">Un-Scanned</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="print" id="status0" value="2" required onChange={handleInput}  />
                                <label className="form-check-label" htmlFor="status0">Error</label>
                            </div>
                        </div>
                        <div className='col-6 mb-3'>
                            <label className="form-control-label">Start Page</label>
                            <input type={'number'} name="pageNo" max={job.total} defaultValue={data.pageNo} step="1" className="form-control" required onChange={handleInput}/>
                        </div>
                        <div className='col-6 mb-3'>
                            <label className="form-control-label">End Page</label>
                            <input type={'number'} name="total" max={job.total} defaultValue={data.total} step="1" className="form-control" required onChange={handleInput}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary me-auto px-4">CREATE</button>
                        <button type="button" className="btn btn-outline-dark" id="dimissModal" data-bs-dismiss="modal">Cancel</button>
                    </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Job;