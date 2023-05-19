import React, { PureComponent } from "react";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { baseUrl } from "../Components/BaseUrl";
import { Link, Redirect } from "react-router-dom";
import Sidebar from '../Components/Sidebar';
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery"
import coat from "../assets/images/coat.png";
import logo from "../assets/images/logo.png";
import moment from 'moment';

let FILE = "";
let FILEBASE64 = "";
let d = new Date();

// const imageToBase64 = require('image-to-base64');

class NewFoodScientistRegistrations extends PureComponent {
  constructor(props){
      super(props);
      this.state = {
      data: [],
      file: [],
      fileBase64: "",
      formid: "",
      noData: false,
      loading: false,
      isLoading: false,
      isPreviewLoading: false,
      isCertificateLoading: false,
      userData: [],
      userCertificate: [],
      userReviewData: [],
      userApproveData: [],
      selectValue: '',
      postsPerPage: 10,
      currentPage: 1,
      licensedate: null,
      regNumber: "",
      isCanceling: false,
      isApproving: false,
      disabled: false,
      remarks: "",
      approval: ""
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleLicenceDate = this.handleLicenceDate.bind(this);
      this.handleApprovalChange = this.handleApprovalChange.bind(this);
      // this.handleFileChange = this.handleFeeChange.bind(this);
  }

  print(){
    window.print()
  }


    handleChange(e) {
      this.setState({ selectValue: e.target.value });
    }

    handleApprovalChange(e){
      this.setState({ approval: e.target.value });
    }

    handleLicenceDate(e){
      this.setState({licensedate: e.target.value})
    }

    async handleFileChange(e){
      return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(e.target.files[0]);

          fileReader.onload = () => {
              resolve(fileReader.result);
              FILEBASE64 = fileReader.result
          };

          fileReader.onerror = (error) => {
              reject(error);
          };
      });
    }



    getFileUpload(formid){
      this.setState({ formid: formid});
      }

    upLoadCertificate = async (formid) => {
      this.setState({isUploading: true, disabled: true});
      // const { base64URL } = this.state;

      var obj = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          formid: this.state.formid,
          imageToBase64String: FILEBASE64
        }),
      };
      await fetch(`${baseUrl}Registration/uploadRegistrationCertificate`, obj)
        .then((response) => response.json())
        .then((responseJson) => {
          console.warn(responseJson);
          // console.warn(responseJson);

          if (responseJson.message === "Image Updated Successfully") {
            this.setState({ isUploading: false, disabled: false})
            Swal.fire({
              title: "Success",
              text: responseJson.message,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload()
                // this.props.history.push("/new-registrations")
            })
          } else {
            this.setState({ isUploading: false, disabled: false });
            Swal.fire({
              title: "Error!",
              text: responseJson.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          this.setState({ loading: false, disabled: false });
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }



    reviewApplication = async (value) => {
        this.setState({isApproving: true, disabled: true})
        let date = new Date();
        let newValues = value.split(",")

        // console.warn(newValues[0]);
        // console.warn(newValues[1]);
        // console.warn(this.state.remarks);
        // console.warn(this.state.approval);

        var obj = {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            applicationstatus: this.state.approval,
            formid: newValues[0].trim(),
            registrationdate: date.getDate(),
            registrationnumber: this.state.regNumber,
            officialremarks: this.state.remarks
          }),
        };
        await fetch(`${baseUrl}Registration/updateRegistrationOfficial`, obj)
          .then((response) => response.json())
          .then((responseJson) => {
            // console.warn(responseJson);

            if (responseJson.message === "Registration Information Updated Successfully") {
              this.setState({ isApproving: false, disabled: false})
              Swal.fire({
                title: "Success",
                text: responseJson.message,
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                window.location.reload()
                  // this.props.history.push("/new-registrations")
              })
            } else {
              this.setState({ isApproving: false, disabled: false });
              Swal.fire({
                title: "Error!",
                text: responseJson.message,
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          })
          .catch((error) => {
            this.setState({ loading: false, disabled: false });
            Swal.fire({
              title: "Error!",
              text: error.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      };


      showLicenses = async () => {
      this.setState({ loading: true });
      let obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await fetch(`${baseUrl}Registration/getAllRegistration`, obj)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.warn(responseJson);
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
            }else if(responseJson.length === 0){
              this.setState({noData: true, loading: false})
            }else {
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

    getUserDetails = (formid) => {
      const url = `${baseUrl}Registration/getRegistrationByFormID/${formid}`;
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
          this.setState({
            isPreviewLoading: false,
            userData: res,
          });
        })
        .catch(error => {
          this.setState({error: true, isPreviewLoading: false});
          alert(error);
        });
    }

    getUserCertificate = (formid) => {
      const url = `${baseUrl}Registration/getRegistrationByFormID/${formid}`;
      this.setState({isCertificateLoading: true});
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
          this.setState({
            isCertificateLoading: false,
            userCertificate: res,
          });
        })
        .catch(error => {
          this.setState({error: true, isCertificateLoading: false});
          alert(error);
        });
    }

    updateUserDetails = (formid) => {
      const url = `${baseUrl}Registration/getRegistrationByFormID/${formid}`;
      this.setState({isLoading: true});
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
          this.setState({
            isLoading: false,
            userReviewData: res,
          });
        })
        .catch(error => {
          this.setState({error: true, loading: false});
          alert(error);
        });
    }

      reviewRegistration = (formid) => {
      const url = `${baseUrl}Registration/getRegistrationByFormID/${formid}`;
      this.setState({isLoading: true});
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
          this.setState({
            isLoading: false,
            userApproveData: res,
          });
        })
        .catch(error => {
          this.setState({error: true, loading: false});
          alert(error);
        });
    }

    cancelApplication = (formid) => {
      this.setState({isCanceling: true})
      const url = `${baseUrl}Registration/removeRecord/${formid}`;
      fetch(url, {
        method: 'DELETE',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then(res => res.json())
        .then(res => {
          console.warn(res);
          if(res.message === "Record removed successfully"){
              this.setState({isCanceling: false});
            Swal.fire({
              title: "Success",
              text: "Record removed successfully",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
                window.location.reload()
                // this.props.history.push("/new-registrations")
            })
          }else{
            Swal.fire({
              title: "Error",
              text: "An error occurred, please try again",
              icon: "error",
              confirmButtonText: "OK",
            })
            this.setState({isCanceling: false});
          }
        })
        .catch(error => {
          this.setState({isCanceling: false});
          alert(error);
        });
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


    showTable = () => {
      // alert(this.state.data.length)//
      // console.warn(this.state.data);
      const { postsPerPage, currentPage, data } = this.state;
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = parseInt(indexOfLastPost) - parseInt(postsPerPage);
      const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
      try {
        return currentPosts.map((item, index) => {
          return (
              <tr>
             <td className="text-xs font-weight-bold">{postsPerPage * (currentPage-1)+index+1}</td>
             <td className="text-xs text-capitalize font-weight-bold">{item.title}</td>
             <td className="text-xs font-weight-bold">{item.surname+ ' ' + item.othernames}</td>
             <td className={item.applicationstatus === "approved" ? 'badge bg-success mt-3' : item.applicationstatus=="pending" ? "badge bg-warning mt-3" : item.applicationstatus === "rejected" ? "badge bg-danger mt-3" : "" }>{(item.applicationstatus)}</td>
             <td className="text-xs font-weight-bold">{(item.registrationnumber)}</td>
             <td className="text-xs font-weight-bold">{moment(item.applicationdate).format('LL') === "Invalid date" ? null : moment(item.applicationdate).format('LL')}</td>
             <td className="text-xs font-weight-bold">{moment(item.registrationdate).format('LL') === "Invalid date" ? null : moment(item.registrationdate).format('LL')}</td>
             <td>
             <button className="btn btn-primary-2 mb-0" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"><span class="iconify" data-icon="charm:menu-meatball" style={{fontSize: 'large'}} ></span></button>
              <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="#dropdownMenuButton2">
                <li className="mb-2">
                  <a className="dropdown-item border-radius-md" href="javascript:;">
                    <div className="d-flex py-1">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <span id = { item.formid } onClick={() => this.getUserDetails(item.formid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal1">Review Submission</span>
                        </h6>
                    </div>
                  </a>
                </li>
                {/*<li className="mb-2">
                  <a className="dropdown-item border-radius-md" href="javascript:;">
                    <div className="d-flex py-1">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <span id = { item.formid } onClick={() => this.getUserCertificate(item.formid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#certificate">View Applicant's Certificate</span>
                        </h6>
                    </div>
                  </a>
                </li> */}
                {parseInt(localStorage.getItem("canApprove")) !== 0 &&
                    <li className="mb-2" onClick={() => this.getFileUpload(item.formid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                            <h6 className="text-sm font-weight-normal mb-1">
                              <span className="font-weight-bold" id = { item.formid } onClick={() => this.getUserCertificate(item.formid)}>Upload Reg. Certificate</span>
                            </h6>
                        </div>
                      </a>
                    </li>
                  }

                    {parseInt(localStorage.getItem("canApprove")) !== 0 &&
                      <li className="mb-2" data-bs-toggle="modal" data-bs-target="#approve">
                        <a className="dropdown-item border-radius-md" href="javascript:;">
                          <div className="d-flex py-1">
                              <h6 className="text-sm font-weight-normal mb-1">
                               <span id = { item.formid } onClick={() => this.reviewRegistration(item.formid)} className="font-weight-bold" >Approve / Reject</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                    }

                    {parseInt(localStorage.getItem("canApprove")) !== 0 &&
                      <li className="mb-2" data-bs-toggle="modal" data-bs-target="#cancel">
                        <a className="dropdown-item border-radius-md" href="javascript:;">
                          <div className="d-flex py-1">
                              <h6 className="text-sm font-weight-normal mb-1">
                                <span className="font-weight-bold text-danger">Cancel Application</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                    }

                    </ul>
                    </td>
                    <td></td>

                    {/*Cancel Application */}
                    <div class="modal fade" id="cancel" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header bg-danger">
                          <h5 class="modal-title text-uppercase font-weight-bold text-light" id="exampleModalLabel">Cancel Application</h5>
                          <button type="button" class="btn-close text-light bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          Are you sure you want to cancel this application? <br />You cannot UNDO this action.
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                          <button type="button" class="btn btn-danger" id={item.formid} onClick={()=>this.cancelApplication(item.formid)}>{this.state.isCanceling ? <Spinner animation="border" className="text-center" variant="light" size="lg" /> : "Yes, Continue"}</button>
                        </div>
                      </div>
                    </div>
                  </div>
             </tr>
              );
        });
      } catch (e) {
        // Swal.fire({
        //   title: "Error",
        //   text: e.message,
        //   type: "error",
        // })
      }
    };

    componentDidMount(){
        this.showLicenses();
    }

  render(){
    const { isLoading, isUploading, isPreviewLoading, isCertificateLoading, noData, isApproving, disabled, loading } = this.state;
      return(
      <div className="container">
        <Sidebar />
     <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style={{width: '80%', float: 'right'}}>
       <div class="container-fluid px-4">
       <div class="rown">
         <div class="col-12">
           <div class="card my-3">
             <div class="card-header pb-4 bg-success">
               <div class="d-flex flex-wrap align-items-center justify-content-between">
                 <h5 className="text-light font-weight-bold">All Registered Food Scientists</h5>
               </div>
             </div>
         <div class="card-body">


       {this.state.loading ?  <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center> :
       <div class="container-fluid py-4">
       <div class="table-responsive p-0 pb-2">
     <table className="table align-items-center justify-content-center mb-0">
         <thead>
             <tr>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Title</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Name</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Status</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Reg. No.</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Applied</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Approved</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Action</th>
             </tr>
         </thead>

         <tbody>
            {this.showTable()}
         </tbody>
     </table>
     {this.state.noData && <center><p>No data available in the table</p></center>}
         </div>
         <div style={{float: 'right'}}>
         {this.showPagination()}
         </div>
         </div> }
         {/* <Footer /> */}

       {/* View Modal */}
         <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
           <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
             <div className="modal-content">
               <div className="modal-header bg-success d-flex align-items-center justify-content-between">
                 <h5 className="modal-title text-light font-weight-bold">User Registration Details</h5>
                 <button className="text-light btn btn-primary btn-lg" style={{ marginRight: 18}} onClick={()=>this.print()}>Print</button>
                 <button type="button" className="btn btn-link text-light m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
               </div>
               <div className="modal-body">
                 <div className="row">
                   <div clasNames="d-flex px-3">
                   <div className="text-center container-fluid px-4 d-flex justify-content-between" style={{width: '85%', justifyContent: 'space-evenly', alignItems: 'center', position: 'relative', top: 18 }}>
                   <div>
                   <img src={logo} className="navbar-brand-img" alt="main_logo" style={{ width: 81 }} />
                   </div>
                   <div>
                   <h4 className="font-weight-bold text-center">NIGERIAN COUNCIL OF FOOD SCIENCE AND TECHNOLOGY (NiCFoST)</h4>
                   </div>
                   <div>
                   <img src={coat} className="navbar-brand-img h-100" style={{ width: 126 }} alt="main_logo" />
                   </div>
                   </div>
                   {/*
                     <div className="my-auto text-center">
                       <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                     </div> */}
                     { isPreviewLoading ? <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center>  :
                     <div className="d-flex flex-column">
                       {this.state.userData.map((item) => {
                         return (
                           <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{width: !localStorage.getItem("token") ? '90%' : '100%', position: localStorage.getItem("token") ? 'relative' : '', right: 0, padding: 18, float: !localStorage.getItem("token") ? '' : 'right', marginBottom: 90 }}>
                             <div className="container-fluid px-4">
                               <div className="rown">
                                 <div className="col-12">
                                   <div className="card my-3 mb-4">
                                     <div className="card-header pb-0 bg-success">
                                       <div className="text-center">
                                         <h5 className="text-light text-center font-weight-bold mb-4">Registration For Food Scientist</h5>
                                       </div>
                                     </div>
                                    {/* <div class="card-body"> */}
                                    <div className="container" style={{ marginTop: 18, padding: 9 }}>
                                      <div style={{ marginTop: 0 }}></div>
                                    {/*  <img crossorigin="anonymous" width='500' height='200'  src={`${item.tertiaryinstitutioncertificateimage}`} /> */}
                                      <form className="row">
                                        <label
                                          className="mb-3 h4"
                                          style={{ color: "#145973" }}
                                          htmlFor="floatingInputCustom"
                                        >
                                          Personal Information
                                        </label>
                                        <br />
                                        <br />
                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorSurname }}
                                            className="form-label"
                                          >
                                            Surname
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control w-50 shadow-none"
                                              type="text"
                                              required="required"
                                              value={item.surname}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            className="form-label text-dark"
                                          >
                                            Previous Surname
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control w-50 shadow-none"
                                              type="text"
                                              value={item.previoussurname}
                                            />
                                          </div>
                                        </div>

                                        {/*
                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorFirstName }}
                                            className="form-label"
                                          >
                                            First name <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control w-50 shadow-none"
                                              type="text"
                                              required="required"
                                              defaultValue={item.surname}
                                              onChange={(e) => this.setState({ firstname: e.target.value })}
                                            />
                                          </div>
                                        </div> */}

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorOthername }}
                                            className="form-label"
                                          >
                                            Other name(s)
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.othernames}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorTitle }}
                                            className="form-label"
                                          >
                                            Title
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.title}
                                            />
                                          </div>
                                        </div>


                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorOthername }}
                                            className="form-label"
                                          >
                                            DOB <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.DOB}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            Nationality
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.nationality}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            Gender
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.gender}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            State
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.state}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorLga }}
                                            className="form-label"
                                          >
                                            LGA <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              required="required"
                                              value={item.lga}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            NIFST Registration Number
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.nifstregistrationnumber}
                                            />
                                          </div>
                                        </div>

                                        <hr />
                                        <label
                                          className="mb-3 h4"
                                          style={{ color: "#145973" }}
                                          htmlFor="floatingInputCustom"
                                        >
                                          Qualification
                                        </label>
                                        <br />
                                        <br />

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Course of study
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.courseofstudy1}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Tertiary Institution
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.tertiaryinstitution1}
                                            />
                                          </div>
                                        </div>


                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.qualification1}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorQualYear }}
                                            className="form-label"
                                          >
                                            Year of Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.yearofqualification1}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Course of study
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.courseofstudy2}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Tertiary Institution
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.tertiaryinstitution2}
                                            />
                                          </div>
                                        </div>


                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.qualification2}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorQualYear }}
                                            className="form-label"
                                          >
                                            Year of Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.yearofqualification2}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Course of study
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.courseofstudy3}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Tertiary Institution
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.tertiaryinstitution3}
                                            />
                                          </div>
                                        </div>


                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.qualification3}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorQualYear }}
                                            className="form-label"
                                          >
                                            Year of Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.yearofqualification3}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Course of study
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.courseofstudy4}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Tertiary Institution
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.tertiaryinstitution4}
                                            />
                                          </div>
                                        </div>


                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.qualification4}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorQualYear }}
                                            className="form-label"
                                          >
                                            Year of Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.yearofqualification4}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Course of study
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.courseofstudy5}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorNIFST }}
                                            className="form-label"
                                          >
                                            Tertiary Institution
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.tertiaryinstitution5}
                                            />
                                          </div>
                                        </div>


                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            className="form-label"
                                            style={{ color: this.state.colorNationality }}
                                          >
                                            Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              type="text"
                                              className="form-control shadow-none"
                                              value={item.qualification5}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-3 col-md-3 mb-3">
                                          <label
                                            style={{ color: this.state.colorQualYear }}
                                            className="form-label"
                                          >
                                            Year of Qualification <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.yearofqualification5}
                                            />
                                          </div>
                                        </div>

                                        <hr />

                                        <label
                                          className="mb-3 h4"
                                          style={{ color: "#145973" }}
                                          htmlFor="floatingInputCustom"
                                        >
                                          Contact Information
                                        </label>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorMailAddress }}
                                            className="form-label"
                                          >
                                            Mailing Address <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>

                                            <textarea
                                              className="form-control shadow-none"
                                              type="text"
                                              required="required"
                                              rows="1"
                                              value={item.contactaddress}
                                            ></textarea>
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label className="form-label" style={{color:this.state.colorEmail}} >
                                            Email <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="email"
                                              value={item.contactemail}
                                            />
                                          </div>
                                        </div>


                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label className="form-label" style={{color:this.state.colorEmail}} >
                                            Practice Category <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="email"
                                              value={item.practicecategory}
                                            />
                                          </div>
                                        </div>

                                        <hr />
                                        <label
                                          className="mb-3 h4"
                                          style={{ color: "#145973" }}
                                          htmlFor="floatingInputCustom"
                                        >
                                          Place of work
                                        </label>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorOrgName }}
                                            className="form-label"
                                          >
                                            Name of Organization/Institution{" "}
                                            <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              value={item.organization}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorPosition }}
                                            className="form-label"
                                          >
                                            Position <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.organizationposition}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorAddress }}
                                            className="form-label"
                                          >
                                            Address <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.organizationaddress}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorOrgPhone }}
                                            className="form-label"
                                          >
                                            Organization Telephone <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.organizationtelephone}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorOrgEmail }}
                                            className="form-label"
                                          >
                                            Organization Email <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.organizationemail}
                                            />
                                          </div>
                                        </div>

                                        <hr />

                                        <label
                                          className="h4"
                                          htmlFor="floatingInputCustom"
                                          style={{ color: "#145973" }}
                                        >
                                          Sponsor Information
                                        </label>
                                        <br />
                                        <br />

                                        <label className="h5" htmlFor="floatingInputCustom">
                                          Sponsor 1
                                        </label>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorSponsor }}
                                            className="form-label"
                                          >
                                            Sponsor Name <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.sponsorname1}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label
                                            style={{ color: this.state.colorSponsorNo }}
                                            className="form-label"
                                          >
                                            Current CFSN Number <span className="text-danger">*</span>
                                          </label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.sponsorcfsnno1}
                                            />
                                          </div>
                                        </div>

                                        <label className="h5" htmlFor="floatingInputCustom">
                                          Sponsor 2
                                        </label>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label className="form-label">Sponsor Name</label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.sponsorname2}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                          <label className="form-label">Current CFSN Number</label>
                                          <div className="input-group input-group-outline mb-3">
                                            <label className="form-label"></label>
                                            <input
                                              className="form-control shadow-none"
                                              type="text"
                                              value={item.sponsorcfsnno2}
                                            />
                                          </div>
                                        </div>
                                        <hr />


                                        <div style={{ height: 45}} />

                                        <label className="h5" htmlFor="floatingInputCustom">
                                          Certificates
                                        </label>

                                    <div style={{ flexDirection: 'row', alignItems: 'center', margin: 9, justifyContent: 'space-between', flexWrap: 'wrap'}}>

                                    {item.qualificationimage1 ?
                                     <img crossorigin="anonymous" width='306' height='306'  src={`${item.qualificationimage1}`} /> :
                                     <img src="../assets/images/image.jpeg" alt="No image uploaded for qualification 1"/> }

                                     {item.qualificationimage2 ?
                                     <img crossorigin="anonymous" width='306' height='306'  src={`${item.qualificationimage2}`} />:
                                     <img src="../assets/images/image.jpeg" alt="No image uploaded for qualification 2"/> }


                                     {item.qualificationimage3 ?
                                     <img crossorigin="anonymous" width='306' height='306'  src={`${item.qualificationimage3}`} /> :
                                     <img src="../assets/images/image.jpeg" alt="No image uploaded for qualification 3"/> }

                                     {item.qualificationimage4 ?
                                     <img crossorigin="anonymous" width='306' height='306'  src={`${item.qualificationimage4}`} /> :
                                     <img src="../assets/images/image.jpeg" alt="No image uploaded for qualification 4"/> }

                                     {item.qualificationimage5 ?
                                     <img crossorigin="anonymous" width='306' height='306'  src={`${item.qualificationimage5}`} /> :
                                     <img src="../assets/images/image.jpeg" alt="No image uploaded for qualification 5"/> }
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
    {/* View Application */}

       {/* View Certificate */}
         <div className="modal fade" id="certificate" tabindex="-1" aria-labelledby="ViewCertificate" aria-hidden="true">
           <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
             <div className="modal-content">
               <div className="modal-header d-flex align-items-center justify-content-between">
                 <h5 className="modal-title">View Certificate</h5>
                 <div class="d-flex align-items-center">
                   <button class="btn bg-danger text-light font-weight-bold mb-0"> <span class="iconify" data-icon="carbon:printer" style={{fontSize: 36}}></span> Print</button>
                 </div>
                 <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
               </div>
               <div className="modal-body">
                 <div className="row">
                   <div clasNames="d-flex px-3">

                     { isCertificateLoading ? <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center>  :
                     <div className="d-flex flex-column">
                       {this.state.userCertificate.map((item) => {
                         return (
                         <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{width: !localStorage.getItem("token") ? '90%' : '100%', position: localStorage.getItem("token") ? 'relative' : '', right: 0, padding: 18, float: !localStorage.getItem("token") ? '' : 'right', marginBottom: 90 }}>
                           <div className="container-fluid px-4">
                             <div className="rown">
                               <div className="col-12">
                                 <div className="card my-3 mb-4">
                                   <div className="card-header pb-0 bg-success">
                                     <div className="text-center">
                                       <h5 className="text-light text-center font-weight-bold mb-4">{`Certificate For ${item.surname} ${item.othernames}`}</h5>
                                     </div>
                                   </div>
                                  {/* <div class="card-body"> */}
                                  <div className="container" style={{ marginTop: 18, padding: 9 }}>
                                    <div style={{ marginTop: 0 }}></div>
                                    <center>
                                    {item.registrationcertificate ?
                                    <img crossorigin="anonymous" width='450' height='450'  src={`${item.registrationcertificate}`} />
                                    : <p>No certificate uploaded for this user.</p> }
                                    </center>

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
                 </div>
               </div>
               <div class="modal-footer">
                 <button type="button" data-bs-dismiss="modal" class="btn btn-danger">Close</button>
               </div>
             </div>
           </div>
         </div>
    {/* View Certificate */}


       {/* Update Modal */}
         <div className="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
           <div className="modal-dialog">
             <div className="modal-content">
               <div className="modal-header d-flex align-items-center justify-content-between">
                 <h5 className="modal-title">Upload Certificate</h5>
                 <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
               </div>
               <div className="modal-body">
                 <div className="row">
                   <div clasNames="d-flex text-center">

                     { isLoading ? <Spinner animation="border" style={{ position:'relative', left: 680, top: 250 }} className="text-center" variant="success" size="lg" />  :
                     <div className="d-flex flex-column">
                     <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                       <label
                         className="form-label"
                         style={{ color: 'black' }}
                       >
                         Upload Image <span className="text-danger">*</span>
                       </label>
                       <div className="input-group input-group-outline mb-3">
                         <label className="form-label"></label>
                         <input
                           type="file"
                           className="form-control shadow-none"
                           // defaultValue={localStorage.getItem("nationality")}
                           onChange={this.handleFileChange}
                         />
                       </div>


                     <div
                     className="text-center"
                       style={{
                         margin: "auto",
                         width: "100%",
                         marginTop: 45,
                         marginBottom: 0,
                       }}
                     >
                       <button
                         disabled={this.state.disabled}
                         style={{
                           alignSelf: "center",
                           width: "100%",
                           backgroundColor: "#147332",
                         }}
                         className="btn btn-success btn-lg col-sm-12 col-lg-12 col-md-12 mb-3"
                         onClick={(e) => this.upLoadCertificate()}
                       >
                         {isUploading ? (
                           <Spinner animation="border" variant="light" size="sm" />
                         ) : (
                           <span className="font-weight-bold">
                             {/* APPLY <i class="fas fa-chevron-right"></i> */}
                             SUBMIT APPLICATION
                           </span>
                         )}
                       </button>
                     </div>
                     </div>
                     </div>
                   }

                  { isCertificateLoading ? <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center>  :
                  <div className="d-flex flex-column">
                    {this.state.userCertificate.map((item) => {
                      return (
                   <div className="container" style={{ marginTop: 18, padding: 9 }}>
                     <div style={{ marginTop: 0 }}></div>
                     <center>
                     {item.registrationcertificate ?
                     <img crossorigin="anonymous" width='450' height='450'  src={`${item.registrationcertificate}`} />
                     : <p>No certificate uploaded for this user.</p> }
                     </center>
                     </div>
             )})}
             </div>
           }

               <div class="modal-footer">
                 <button type="button" data-bs-dismiss="modal" class="btn btn-primary">Close</button>
               </div>
             </div>
           </div>
           </div>
           </div>
           </div>
           </div>
           </div>
           </div>
           </div>
           </div>
           </div>
         {/* END OF UPDATE MODAL */}


         {/* Review Registration Modal */}
           <div className="modal fade" id="approve" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
             <div className="modal-dialog">
               <div className="modal-content">
                 <div className="modal-header d-flex align-items-center justify-content-between bg-success">
                   <h5 className="modal-title text-light">Approve / Reject Application</h5>
                   <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                 </div>
                 <div className="modal-body">
                   <div className="row">
                     <div clasNames="d-flex px-3">
                       {/*<div className="my-auto text-center">
                         <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                       </div> */}
                       { isLoading ? <center><Spinner animation="border" className="text-center" variant="danger" size="lg" /></center>  :
                       <div className="d-flex flex-column">
                         {/*<h6 className="text-lg font-weight-normal mb-1">
                           <span className="font-weight-bold">NiCFOsT</span>
                         </h6> */}
                         {this.state.userApproveData.map((item) => {
                           return (
                             <div>
                             <span><hr class="dark horizontal my-3" /></span>

                            <div className = "row">
                            <label
                              className="h6"
                              style={{ color: "red", marginTop: -36 }}
                              htmlFor="floatingInputCustom"
                            >
                              Administrative action
                            </label>

                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                             <label htmlFor="role">Status</label>
                               <select
                                 className="form-control shadow-none"
                                 aria-label="Floating label select example"
                                 onChange={this.handleApprovalChange}
                                 id="role"
                               >
                                  <option selected disabled>--Select Application Status --</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>

                               </select>
                             </div>

                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Remarks
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <textarea className="form-control shadow-none"  onChange={(e) => this.setState({ remarks: e.target.value })}>
                                  </textarea>
                                </div>
                              </div>
                             </div>

                             <hr />

                             <label
                               className="h6"
                               style={{ color: "red" }}
                               htmlFor="floatingInputCustom"
                             >
                               Administrative information for approval
                             </label>

                             <div className = "row">

                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Date of approval
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { moment(d.getTime()).format('LL') }
                                    onValue={this.handleLicenceDate}

                                  />
                                </div>
                              </div>

                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                <label
                                  className="form-label"
                                >
                                  NiCFoST Registration Number
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                    type="text"
                                    onChange={(e) => this.setState({ regNumber: e.target.value })}
                                    value = {item.applicationstatus === "approved" ? item.nifstregistrationnumber : null }
                                  />
                                </div>
                              </div>

                                <div
                                className="text-center"
                                  style={{
                                    margin: "auto",
                                    width: "100%",
                                    marginTop: 45,
                                  }}
                                >
                                {item.applicationstatus !== "approved" &&
                                  <button
                                    id={`${item.formid}, ${item.nifstregistrationnumber}`}
                                    disabled={this.state.disabled}
                                    style={{
                                      alignSelf: "center",
                                      width: "100%",
                                      backgroundColor: "#003314",
                                    }}
                                    className="btn btn-success btn-lg"
                                    onClick={(e) => this.reviewApplication(`${item.formid}, ${item.nifstregistrationnumber}, ${item.licensenumber}`)}
                                  >
                                    {isApproving ? (
                                      <Spinner animation="border" variant="light" size="sm" />
                                    ) : (
                                      <span className="font-weight-bold">
                                        {/* APPLY <i class="fas fa-chevron-right"></i> */}
                                        Submit Review
                                      </span>
                                    )}
                                  </button>
                                }
                                </div>

                             </div>
                             </div>
                         )
                         })}
                       </div>
                     }
                     </div>

                     <span className="pt-3"><hr class="dark horizontal my-3" /></span>
                   </div>
                 </div>
                 <div class="modal-footer" style={{ display: "none"}}>
                   <button type="button" data-bs-dismiss="modal" class="btn btn-danger">Close</button>
                 </div>
               </div>
             </div>
           </div>


        </main>
        </div>



    )
  }
}

export default NewFoodScientistRegistrations