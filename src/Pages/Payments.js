import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { baseUrl } from "../Components/BaseUrl";
import moment from 'moment';
import Sidebar from '../Components/Sidebar';

class Payments extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      paymentData: [],
      postsPerPage: 10,
      currentPage: 1,
      loading: true,
      payer: "",
      noRecords: false,
      isPreviewLoading: false,
      showSearchResults: false,
      isSearching: false,
    }
  }

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

  searchPayer = () => {
    this.setState({ isSearching: true, showSearchResults: true })
    const url = `${baseUrl}Payments/getPaymentsByPayer/${this.state.payer}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        this.setState({
          isSearching: false,
          data: res,
        });
      })
      .catch(error => {
        this.setState({error: true, isPreviewLoading: false});
        alert(error);
      });
  }

  getPaymentDetails = (recid) => {
    this.setState({ isPreviewLoading: true })
    const url = `${baseUrl}Payments/getPaymentsByRecID/${recid}`;
    this.setState({isPreviewLoading: true});
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        this.setState({
          isPreviewLoading: false,
          paymentData: res,
        });
      })
      .catch(error => {
        this.setState({error: true, isPreviewLoading: false});
        alert(error);
      });
  }

  showTable = () => {
    const { postsPerPage, currentPage, data } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

    try {
      return currentPosts.map((item, index) => {
        return (
            <tbody>
            <tr>
           <td>
           <span className="text-xs font-weight-bold">{postsPerPage * (currentPage -1)+index+1 }</span>
           </td>
           <td className="text-xs text-secondary text-capitalize font-weight-bold">{item.payer}</td>
           <td className="text-xs font-weight-bold">{item.description}</td>
           <td className={item.formtype === "registration" ? "badge bg-success text-xs font-weight-bold" : item.formtype === "renewal" ? "badge bg-primary text-xs font-weight-bold" : "text-xs font-weight-bold"}>{item.formtype.toUpperCase()}</td>
           <td className="text-xs font-weight-bold">{item.amount}</td>
           <td className={item.message === "Successful" ? 'badge bg-success' : item.message=="Payment Initialized" || item.message === "Transaction Pending" ? "badge bg-warning" : 'btn btn-danger'}>{(item.message)}</td>
           <td className="text-xs font-weight-bold">{moment(item.transactiontime).format('LL') === "Invalid date" ? null : moment(item.transactiontime).format('LL')}</td>
           <td>
            <button className="btn btn-primary-2 mb-0" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"><span class="iconify" data-icon="charm:menu-meatball" style={{fontSize: 'large'}} ></span></button>
            <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="#dropdownMenuButton2">
              <li className="mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                <a className="dropdown-item border-radius-md" href="javascript:;">
                  <div className="d-flex py-1">
                      <h6 className="text-sm font-weight-normal mb-1">
                        <span id = { item.recid } onClick={() => this.getPaymentDetails(item.recid)} className="font-weight-bold">View</span>
                      </h6>
                  </div>
                </a>
              </li>

            </ul>
            </td>
            <td></td>
           </tr>
           </tbody>
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


  retrievePayments = async () => {
    let obj = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    await fetch(`${baseUrl}Payments/getAllPayments`, obj)
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
          }else if(responseJson.length <= 0){
            this.setState({ noRecords: true, loading: false})
          }else{
            // console.warn(responseJson);
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
  }


  componentDidMount(){
    this.retrievePayments();
    // this.searchPayer();
  }

  render() {
    const { loading, noRecords, isSearching, showSearchResults, isPreviewLoading } = this.state;
    return (
      <div className="g-sidenav-show">
      <Sidebar />

      <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style={{width: '80%', float: 'right'}}>


      {!showSearchResults &&
      <div class="container-fluid px-4">
        <div class="rown">
          <div class="col-12">
            <div class="card my-3">
              <div class="card-header pb-2" style={{ backgroundColor: '#00264C'}}>
                <div class="d-flex flex-wrap">
                  <h5 className="text-light">Payments History</h5>
                </div>
              </div>
              <div class="card-body">

              <div className="tab-content container-fluid" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <form role="form">
                  <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6">
                      <label className="form-label">Search payments by name</label>
                      <div className="input-group input-group-outline mb-3">
                      <input onChange={(e) =>
                        this.setState({ payer: e.target.value })} type="text" className="form-control" />
                      </div>
                    </div>

                    <div className="col">
                      <div><label className="form-label opacity-0">btn label</label></div>
                      <button onClick={()=>this.searchPayer()} className="btn btn-lg bg-gradient-success text-md">Search</button>
                    </div>
                  </div>
                  <hr />
                </form>
                </div>
                </div>

        {loading ?  <center><Spinner animation="border" variant="success" size="lg" className="text-center" /></center> :
      <div class="table-responsive p-0 pb-2">
      <table id="table" className="table align-items-center justify-content-center mb-0">
        <thead>
            <tr>
            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">S/N</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Payer</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Payment Description</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Item Paid For</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Amount</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Message</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Transaction Date</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Action</th>
            </tr>
        </thead>
        {this.showTable()}
      </table>
      {noRecords && <center><p>No payment record found.</p></center>}
      </div> }

      <div style={{float: 'right'}}>
      {this.showPagination()}
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    }

    {showSearchResults &&
      <div class="container-fluid px-4">
        <div class="rown">
          <div class="col-12">
            <div class="card my-3">
              <div class="card-header pb-2" style={{ backgroundColor: '#00264C'}}>
                <div class="d-flex flex-wrap">
                  <h5 className="text-light">Payments History</h5>
                </div>
              </div>
              <div class="card-body">
              <div className="tab-content container-fluid" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <form role="form">
                  <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6">
                      <label className="form-label">Search payments by name</label>
                      <div className="input-group input-group-outline mb-3">
                      <input onChange={(e) =>
                        this.setState({ payer: e.target.value })} type="text" className="form-control" />
                      </div>
                    </div>

                    <div className="col">
                      <div><label className="form-label opacity-0">btn label</label></div>
                      <button onClick={()=>this.searchPayer()} className="btn btn-lg bg-gradient-success text-md">Search</button>
                    </div>
                  </div>
                  <hr />
                </form>
                </div>
                </div>

        {isSearching ?  <center><Spinner animation="border" variant="success" size="lg" className="text-center" /></center> :
      <div class="table-responsive p-0 pb-2">
      <table id="table" className="table align-items-center justify-content-center mb-0">
        <thead>
            <tr>
            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">S/N</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Payer</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Payment Description</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Item Paid For</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Amount</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Message</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Transaction Date</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Action</th>
            </tr>
        </thead>
        {this.showTable()}
      </table>
      </div> }

      <div style={{float: 'right'}}>
      {this.showPagination()}
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    }



      {/* View Modal */}
        <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header d-flex align-items-center justify-content-between">
                <h5 className="modal-title">Details</h5>
                <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div clasNames="d-flex px-3">
                  {/*
                    <div className="my-auto text-center">
                      <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                    </div> */}
                    { isPreviewLoading ? <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center>  :
                    <div className="d-flex flex-column">
                      {this.state.paymentData.length > 0 && this.state.paymentData.map((item) => {
                        return (
                          <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{width: !localStorage.getItem("token") ? '90%' : '100%', position: localStorage.getItem("token") ? 'relative' : '', right: 0, padding: 18, float: !localStorage.getItem("token") ? '' : 'right', marginBottom: 90 }}>
                            <div className="container-fluid px-4">
                              <div className="rown">
                                <div className="col-12">
                                  <div className="card my-3 mb-4">
                                    <div className="card-header pb-0 bg-success">
                                      <div className="text-center">
                                        <h5 className="text-light text-center font-weight-bold mb-4">{`Payment Information For ${item.payer}`}</h5>
                                      </div>
                                    </div>
                                   {/* <div class="card-body"> */}
                                   <div className="container" style={{ marginTop: 18, padding: 9 }}>
                                     <div style={{ marginTop: 0 }}></div>
                                     <form className="row">

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           style={{ color: this.state.colorSurname }}
                                           className="form-label"
                                         >
                                           Name <span className="text-danger">*</span>
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             className="form-control w-50 shadow-none"
                                             type="text"
                                             required="required"
                                             value={item.payer}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           className="form-label text-dark"
                                         >
                                           Description
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <textarea
                                             className="form-control w-50 shadow-none"
                                             type="text"
                                             value={item.description}
                                           ></textarea>
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           style={{ color: this.state.colorOthername }}
                                           className="form-label"
                                         >
                                           Form Type <span className="text-danger">*</span>
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             className="form-control shadow-none"
                                             type="text"
                                             value={item.formtype}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           style={{ color: this.state.colorTitle }}
                                           className="form-label"
                                         >
                                           Message <span className="text-danger">*</span>
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             className="form-control shadow-none"
                                             type="text"
                                             value={item.message}
                                           />
                                         </div>
                                       </div>


                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           style={{ color: this.state.colorOthername }}
                                           className="form-label"
                                         >
                                           Remita ID
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             className="form-control shadow-none"
                                             type="text"
                                             value={item.orderId}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           className="form-label"
                                           style={{ color: this.state.colorNationality }}
                                         >
                                           Payment Category
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             type="text"
                                             className="form-control shadow-none"
                                             value={item.paymentcategory}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           className="form-label"
                                           style={{ color: this.state.colorNationality }}
                                         >
                                           Payment Date
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             type="text"
                                             className="form-control shadow-none"
                                             value={item.paymentdate}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           className="form-label"
                                           style={{ color: this.state.colorNationality }}
                                         >
                                           Payment Sub-category
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             type="text"
                                             className="form-control shadow-none"
                                             value={item.paymentsubcategory}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           style={{ color: this.state.colorLga }}
                                           className="form-label"
                                         >
                                           Payment Type
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             className="form-control shadow-none"
                                             type="text"
                                             required="required"
                                             value={item.paymenttype}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           style={{ color: this.state.colorNIFST }}
                                           className="form-label"
                                         >
                                           Transaction Time
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             className="form-control shadow-none"
                                             type="text"
                                             value={item.transactiontime}
                                           />
                                         </div>
                                       </div>

                                       <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                         <label
                                           style={{ color: this.state.colorNIFST }}
                                           className="form-label"
                                         >
                                           Status
                                         </label>
                                         <div className="input-group input-group-outline mb-3">
                                           <label className="form-label"></label>
                                           <input
                                             className=""
                                             type="text"
                                             value={item.status}
                                           />
                                         </div>
                                       </div>

                              </form>
                            </div>

                            </div>
                            </div>
                            </div>
                            </div>
                         {/*   </div>*/}
                          </main>
                      )
                      })}
                    </div>
                  }
                  </div>
                  <span className="pt-3"><hr class="dark horizontal my-3" /></span>

                  {/*
                  <div className="d-flex flex-column px-3">
                    <h6 className="mb-3 text-sm">Applicant's History</h6>

                    <span className="mb-2 text-xs">Date Applied: <span class="text-dark font-weight-bold ms-sm-2">8 Feb, 2022</span></span>
                    <span className="mb-2 text-xs">Created By: <span class="text-dark ms-sm-2 font-weight-bold">info@byteworks.com</span></span>
                    <span className="mb-2 text-xs">Updated By: <span class="text-dark ms-sm-2 font-weight-bold">info@byteworks.com</span></span>
                  </div>
                  */}
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" data-bs-dismiss="modal" class="btn btn-primary">Close</button>
              </div>
            </div>
          </div>
        </div>


      </main>

      </div>
    );
  }
}

export default Payments;
