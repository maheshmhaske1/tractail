import { React, useState,useEffect} from 'react';
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';
let ManageJob = () => {
    const { id } = useParams();
    let [template, setData] = useState({});

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL +'/admin/template', {
            params: {
                metaId : id,
            }
        }).then(response => {
            setData( response.data.data);
        }).catch(err => {
            console.log(err);
        });
    }, [id]);

    return(
    <div className="container-lg">
        <div className="row align-items-center mb-4">
            <div className="col-auto">
                <h3 className="text-primary mb-0">Template Details</h3>
            </div>
            <div className="col">
                <Link className="btn btn-sm btn-outline-dark" to="/admin/templates">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon icon-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    <span className="ms-1">Back</span>
                </Link>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <table className="table table-bordered mb-0">
                    <tbody>
                        <tr>
                            <th scope="row">Title</th>
                            <td>{template.title}</td>
                        </tr>
                        <tr>
                            <th scope="row">Language</th>
                            <td>{template.language}</td>
                        </tr>
                        <tr>
                            <th scope="row">Items</th>
                            <td>{template.items}</td>
                        </tr>
                        <tr>
                            <th scope="row">Pages</th>
                            <td>{template.pages}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-md-6 col-lg-4 mx-auto">
                <img src={ '/templates/' + template.slug + '.jpg' } className="img-fluid" alt={template.slug} title={template.title} />
            </div>
        </div>
    </div>
    );
}
export default ManageJob;