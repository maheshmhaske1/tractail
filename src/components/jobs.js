import { React,useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import axios from 'axios';

let Jobs = ()=>{
    const [rows, setRows]=useState([]);
    const [page, setPage] = useState(0);
    const rowsPerPage = 15;
    // const [rowsPerPage, setRowsPerPage] = useState(15);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [account, setAccount] = useState( '');
    const [accounts, setAccounts] = useState([]);

    const jobs = async(pageNumber=0)=> {
        setIsLoading(true);
         await axios.get(process.env.REACT_APP_API_URL +'/jobs', {
            params: {
                page        : pageNumber,
                limit       : rowsPerPage,
                search      : searchString,
                account     :  account

            }
        }).then(response => {
            setIsLoading(false)
            setRows(response.data.data);
            setPage(response.data.page)
            setTotal(response.data.total)
        }).catch(err => {
            console.log(err);
        });
    };

    const template = async()=> {
        await axios.get(process.env.REACT_APP_API_URL +'/admin/settings')
        .then(response => {
           setAccounts(response.data.accounts);
       }).catch(err => {
           console.log(err);
       });
   };

    useEffect(() => {
        jobs();
        template();
    }, [account]);

    const searchJob = (text) => {
        setSearchString(text);
        if (text.length === 0) {
            clearSearch();
            jobs();
        }
        if (text.length <= 2) {
            return;
        }
        jobs(); 
    }

    function clearSearch() {
        setRows([]);
        setSearchString('');
        document.getElementById('searchString').value = '';
    }

    const handleChange = event => {
        setAccount(event.target.value);
        jobs();
    };

    const removeJob = async(row)=> {
        await axios.post(process.env.REACT_APP_API_URL +'/job/update', row )
        .then(response => {
            alert(response.data.message);
            window.location.reload(false);
       }).catch(err => {
           console.log(err);
       });
   };

   const refresh = async() => {
        await axios.get(process.env.REACT_APP_API_URL +'/admin/statistics/recalculate' )
        .then(response => {
            alert('Statistics have been updated');
            window.location.reload(false);
        }).catch(err => {
            console.log(err);
        });
    }

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
    
    return(
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="row align-items-center mt-2">
                        <div className="col-md-2 mb-3">
                            <h2 className="text-primary mb-0">Jobs</h2>
                        </div>
                        <div className="col-md-4 mb-3 mx-auto">
                            <input type="search" name="search" id="searchString" className="form-control" placeholder="Search by batch..." maxLength="100" onChange={(e) => searchJob(e.target.value)} autoComplete="off" />
                        </div>
                        <div className="col-md-2 col-lg-1 mb-3 ms-auto">
                            <select className='form-select' value={account}  onChange={handleChange}>
                                <option value={''}>All</option>
                                {accounts.map(row=>{
                                    return(
                                        <option value={row.metaId} key={row.meta_key}>{row.meta_key}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-md-1 col-lg-auto mb-3">
                            <button  className="btn btn-outline-secondary" onClick={ refresh }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="col-md-2 col-lg-auto mb-3">
                            <Link className="btn btn-primary" to="/admin/add/job">Add Job</Link>
                        </div>
                    </div>
                    { isLoading ?
                        <Loading rows="20" />
                    :
                    <div className="table-responsive mb-3">
                        <table className="table table-hover table-sm table-striped mb-0">
                            <thead className="thead-dark">
                                <tr className='table-dark'>
                                    <th scope="col">Job</th>
                                    <th scope="col">Account ID</th>
                                    <th scope="col">Batch</th>
                                    <th scope='col'>Total</th>
                                    <th scope='col'>Scanned</th>
                                    <th scope='col'>Error</th>
                                    <th scope='col'>Pending</th>
                                    <th scope="col">Created On</th>
                                    <th scope="col" className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {rows.map(row=>{
                                return(
                                    <tr key={row.jobId}>
                                        <td><Link to={`/admin/job/${row.jobId}`}>#{row.jobId || '1'}</Link></td>
                                        <td>{row.accountId }</td>
                                        <td>{row.batch }</td>
                                        <td>{row.total }</td>
                                        <td>{row.scanned }</td>
                                        <td>{row.error }</td>
                                        <td>{row.pending }</td>
                                        <td>{new Date(row.updated).toLocaleDateString()}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm border-0 btn-outline-danger" onClick={() => { if (window.confirm('Are you sure you want to delete this Job?')) {removeJob(row) } } } >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            
                            </tbody>
                        </table>
                    </div>
                    }
                    <Pagination 
                        activePage={page}
                        totalItemsCount={total}
                        itemsCountPerPage={rowsPerPage}
                        onChange={(pageNumber)=>jobs(pageNumber)}
                        innerClass="pagination justify-content-center small mb-0"
                        itemClass="page-item"
                        linkClass="page-link"
                        activeLinkClass="active"
                        firstPageText="First"
                        lastPageText="Last"
                    />
                </div>
            </div>
        </div>
    );
}
export default Jobs;