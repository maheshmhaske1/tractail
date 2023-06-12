import { React, useState, useEffect} from 'react';
import { Link, } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const [row, setData] = useState([{},{},{},{},{},{}]);
    const [isLoading, setIsLoading] = useState(false);

    const getData = () => {
        setIsLoading(true);
        axios.get(process.env.REACT_APP_API_URL +'/admin/home').then(response => {
            setData(response.data.data || []);
        }).catch(err => {
            console.log(err);
        }).finally(function(){
            setIsLoading(false);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return(
        <div className="container-lg">
            <h1 className="text-primary">Dashboard</h1>
            <div className="row g-4 mb-4">
                {row.map((val,index)=>{
                    return(
                        <div className="col-6 col-md-4 col-lg-2" key={index}>
                            <Link className="text-decoration-none text-reset" to= { val.link || '' }>
                                <div className="card border-0 rounded-0 shadow-sm text-center h-100">
                                    { isLoading ? 
                                        <div className="d-flex align-items-center justify-content-center my-5" title="Loading"><div className="spinner-border spinner-border-lg text-primary" role="status" style={{borderWidth: '1px'}}></div></div>
                                    :
                                        <div className="card-body p-3 p-lg-4">
                                            <h4 className="card-title mb-1">{ val.title || '' }</h4>
                                            <div className="text-primary fw-bold fs-2">{ val.value || '' }</div>
                                        </div>
                                    }
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}