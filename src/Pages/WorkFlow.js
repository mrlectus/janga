import React, { Component } from "react";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { baseUrl } from "../Components/BaseUrl";
import { Link } from "react-router-dom";
import Sidebar from '../Components/Sidebar';
import moment from 'moment';

class WorkFlow extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isLoading: false,
      data: [],
      postsPerPage: 10,
      currentPage: 1
    }
  }

  showTasks = async () => {
      this.setState({ loading: true });
      let obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await fetch(`${baseUrl}Workflow/getAllTasks`, obj)
        .then((response) => response.json())
        .then((responseJson) => {
          console.warn(responseJson);
          if (responseJson.status === 401) {
              this.setState({ loading: false });
              Swal.fire({
                title: "Session Expired",
                text: "Session expired. Please login",
                icon: "error",
                confirmButtonText: "OK",
              }).then(() => {
                this.props.history.push("/login");
              });
            }else{
            this.setState({data: responseJson, loading: false})
            }
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    showPagination = () => {
      const { postsPerPage, data } = this.state;
      const pageNumbers = [];
      const totalPosts = data.length;
      for(let i = 1; i<= Math.ceil(totalPosts/postsPerPage); i++){
        pageNumbers.push(i)
      }

     const paginate = (pageNumbers) => {
       this.setState({currentPage: pageNumbers})
     }

      return(
        <nav>
        <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={this.state.currentPage === number ? 'page-item active' : 'page-item'}>
          <button onClick={()=> paginate(number)} className="page-link">
            { number }
          </button>
         </li>
       ))}
        </ul>
        </nav>
      )
    }


    showTable = () => {
      const { postsPerPage, currentPage, data } = this.state;
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
      try {
        return currentPosts.map((item, index) => {
          return (
              <tr>
             <td className="text-xs font-weight-bold">{index +1}</td>
             <td className="text-xs text-capitalize font-weight-bold">{item.actionperformed}</td>
             <td className="text-xs font-weight-bold">{item.remarks}</td>
             <td>
             <button className={item.taskstatus === "APPROVED" ? 'btn btn-success badge badge-success text-xs font-weight-bold' : item.taskstatus === "PENDING" ? 'btn btn-warning badge badge-warning text-xs font-weight-bold' : item.taskstatus === "INITIATED" ? 'btn btn-primary badge badge-primary text-xs font-weight-bold' : item.taskstatus === 'REJECTED' ? 'btn btn-danger badge badge-danger text-xs font-weight-bold' : 'text-xs font-weight-bold' } >{item.taskstatus}</button>
             </td>
             <td className="text-xs font-weight-bold">{moment(item.dateassigned).format('LL')}</td>
             <td className="text-xs font-weight-bold">{moment(item.datecompleted).format('LL')}</td>
             <td>
                    <button className="btn btn-primary-2 mb-0" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"><span class="iconify" data-icon="charm:menu-meatball" style={{fontSize: 'large'}} ></span></button>
                    <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="#dropdownMenuButton2">
                      <li className="mb-2">
                        <a className="dropdown-item border-radius-md" href="javascript:;">
                          <div className="d-flex py-1">
                              <h6 className="text-sm font-weight-normal mb-1">
                                <span id = { item.userid } onClick={() => this.getUserDetails(item.userid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal1">View</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                      <li className="mb-2">
                        <a className="dropdown-item border-radius-md" href="javascript:;">
                          <div className="d-flex py-1">
                              <h6 className="text-sm font-weight-normal mb-1">
                                <span id = { item.userid } onClick={() => this.getReviewDetails(item.userid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal2">Update</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                      <li className="mb-2">
                        <a className="dropdown-item border-radius-md" href="javascript:;">
                          <div className="d-flex py-1">
                              <h6 className="text-sm font-weight-normal mb-1">
                               <span id = { item.userid } onClick={() => this.approveRegistration(item.userid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal3">Review</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                    </ul>
                    </td>
                    <td></td>
             </tr>
              );
        });
      } catch (e) {
        Swal.fire({
          title: "Error",
          text: e.message,
          type: "error",
        })
      }
    };

    componentDidMount(){
      this.showTasks()
    }

  render() {
      const { isLoading, loading } = this.state;
        return(
        <div className="g-sidenav-show">
         <Sidebar />
       <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style={{width: '80%', float: 'right'}}>
         <div class="container-fluid px-4">
         <div class="rown">
           <div class="col-12">
             <div class="card my-3">
               <div class="card-header pb-4 bg-success">
                 <div class="d-flex flex-wrap align-items-center justify-content-between">
                   <h5 className="text-light font-weight-bold">Task Management</h5>
                 </div>
               </div>
           <div class="card-body">

         {this.state.loading ?  <Spinner animation="border" style={{ position:'relative', left: 450, top: 0 }} className="text-center" variant="success" size="lg" /> :
         <div class="container-fluid py-4">
         <div class="table-responsive p-0 pb-2">
       <table className="table align-items-center justify-content-center mb-0">
           <thead>
               <tr>
               <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
               <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Action Performed</th>
               <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Remarks</th>
               <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Task Status</th>
               <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Assigned</th>
               <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Completed</th>
               <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Action</th>
               </tr>
           </thead>

           <tbody>
              {this.showTable()}
           </tbody>

       </table>
           </div>
           <div style={{float: 'right'}}>
           {this.showPagination()}
           </div>
           </div> }

           </div>
           </div>
           </div>
           </div>
           </div>


         </main>
      </div>
    );
  }
}

export default WorkFlow;
