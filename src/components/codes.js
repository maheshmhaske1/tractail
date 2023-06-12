import { React,useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import { CSVLink } from 'react-csv';

let Codes = () => {
    const { id } = useParams();
    const goto = useNavigate();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');
    const [rows, setRows] = useState([]);
    const [activePage, setPage] = useState(page || 1);
    const rowsPerPage = 100;
    // const [rowsPerPage, setRowsPerPage] = useState(100);
    const [total, setTotal] = useState(0);
    const status = searchParams.get('status') || '';
    // const today = new Date(); 
    // const [status, setStatus] = useState( searchParams.get('status') || '' );
    const [isLoading, setIsLoading] = useState(false);

    let pagePath = '/admin/codes';
    if( id ) {
        pagePath = '/admin/job/' + id + '/codes';
    }

    let filterType = 'Unknown'
    if( status && parseInt(status) === 0 ){
        filterType = 'Pending';
    }else if( status && parseInt(status) === 1) {
        filterType = 'Scanned';
    }else{
        filterType = 'All';
    }

    const codes = async(pageNumber=0)=> {
        if(pageNumber === 0){
            pageNumber = activePage;
        }
        goto(window.location.pathname+'?status='+status+'&page='+pageNumber || 1)
        setIsLoading(true);
        await axios.get(process.env.REACT_APP_API_URL +'/admin/codes', {
            params: {
                page        : pageNumber,
                limit       : rowsPerPage,
                jobId       : id,
                code        : 'codes',
                status      : status
            }
        }).then(response => {
            setRows(response.data.data);
            setPage(response.data.page)
            setTotal(response.data.total)
        }).catch(err => {
            console.log(err);
        }).finally( () => {
            setIsLoading( false );
        });
    };

    useEffect(() => {
        codes();
    }, []);

    /*const download = async(evt)=>{
        evt.preventDefault();
         await axios.get(process.env.REACT_APP_API_URL +'/admin/codes', {
            params: {
                jobId  : id,
                status : status
            }
        }).then((response) => {
            // Create link and download
            // if ( typeof response.data === 'string' || response.data instanceof String ) {
                let data =  response.data.data ;
                var link = document.createElement('a');
                link.href = URL.createObjectURL(  [ "\ufeff", data] );
                link.download = 'code_' + status + '_' + today.getTime() + '.csv'; 
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            // }
        }).catch((err) => {
            console.log(err);
        });
    }*/

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

    if(isLoading) {
        return <Loading rows="20" />
      }
        
    return(
        <div className="container-lg">
            <div className="row my-3">
                <div className="col-md-7">
                    <h3 className="text-primary">Codes</h3>
                </div>

                <div className="col-md-5 text-end">
                    <CSVLink filename={`code-${id}-${filterType}-${page}`} data={rows} className='btn btn-primary btn-sm me-3'>Export Codes</CSVLink>
                    {/* <button className='btn btn-primary btn-sm me-3' onClick={download}> Export Codes</button> */}
                    <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Filter by {filterType}
                    </button>
                    <ul className="dropdown-menu ms-5">
                        <li><a className="dropdown-item" href={`${pagePath}`}>All</a></li>
                        <li><a className="dropdown-item" href={`${pagePath}?status=1`}>Scanned</a></li>
                        <li><a className="dropdown-item" href={`${pagePath}?status=2`}>Error</a></li>
                        <li><a className="dropdown-item" href={`${pagePath}?status=0`}>Pending</a></li>
                    </ul>
                </div>

                <div className="col-12">
                    <div className="table-responsive mb-3">
                        <table className="table table-hover table-sm table-striped mb-0">
                            <thead className="thead-dark">
                                <tr className='table-dark'>
                                    <th scope="col">VPA </th>
                                    <th scope='col'>Name</th>
                                    <th scope="col">CloseQR </th>
                                    <th scope="col">Code  </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(row=>{
                                    return(
                                        <tr key={row.codeId } className='table-inner'>
                                            <td valign="center" className='table_dtl1'>{row.vpa}</td>
                                            <td valign="center" className='table_dtl'>{row.merchant }</td>
                                            <td valign="center" className='table_dtl'>{row.closeQR }</td>
                                            <td valign="center" className='table_dtl'>{row.code  }</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Pagination 
                        activePage={activePage}
                        totalItemsCount={total}
                        itemsCountPerPage={rowsPerPage}
                        onChange={(pageNumber)=>codes(pageNumber)}
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
export default Codes;