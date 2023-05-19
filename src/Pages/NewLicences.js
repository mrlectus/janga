import React, { PureComponent } from "react";
import Swal from "sweetalert2";
import { baseUrl } from "../Components/BaseUrl";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Sidebar from '../Components/Sidebar';
import DatePicker from 'react-date-picker';
import coat from "../assets/images/coat.png";
import logo from "../assets/images/logo.png";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";
import moment from 'moment';
let date = new Date()
let FILEBASE64 = "";

class NewLicences extends PureComponent{

  constructor(props){
      super(props);
      this.state = {
      startDate: "",
      data: [],
      dob: "",
      noData: false,
      licenceData: [],
      userApproveData: [],
      userCertificate: [],
      isLoading: false,
      isUploading: false,
      isCanceling: false,
      isCertificateLoading: false,
      isLicenceLoading: false,
      isApproving: false,
      isApprovalLoading: false,
      loading: false,
      postsPerPage: 10,
      recid: "",
      currentPage: 1,
      approval: "",
      remarks: "",
      licenceNumber: ""
      }
      this.handleApprovalChange = this.handleApprovalChange.bind(this);
      this.handleDateChange = this.handleDateChange.bind(this);
  }

      handleDateChange(date){
        this.setState({
         startDate: date
       })
      }

      handleApprovalChange(e){
        this.setState({ approval: e.target.value });
      }

      print(){
        window.print()
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

      getFileUpload(recid){
        this.setState({ recid: recid});
        }

        getUserCertificate = (recid) => {
          const url = `${baseUrl}License/getlicenseByRecID/${recid}`;
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


      showLicenses = async () => {
          this.setState({ loading: true });

          if (!$.fn.DataTable.isDataTable("#myTable")) {
              $(document).ready(function () {
                setTimeout(function () {
                  $("#table").DataTable({
                    pagingType: "full_numbers",
                    pageLength: 20,
                    processing: true,
                    dom: "Bfrtip",
                    select: {
                      style: "single",
                    },

                    buttons: [
                      {
                        extend: "pageLength",
                        className: "btn btn-secondary bg-secondary",
                      },
                      {
                        extend: "copy",
                        className: "btn btn-secondary bg-secondary",
                      },
                      {
                        extend: "csv",
                        className: "btn btn-secondary bg-secondary",
                      },
                      {
                        extend: "print",
                        customize: function (win) {
                          $(win.document.body).css("font-size", "10pt");
                          $(win.document.body)
                            .find("table")
                            .addClass("compact")
                            .css("font-size", "inherit");
                        },
                        className: "btn btn-secondary bg-secondary",
                      },
                    ],

                    fnRowCallback: function (
                      nRow,
                      aData,
                      iDisplayIndex,
                      iDisplayIndexFull
                    ) {
                      var index = iDisplayIndexFull + 1;
                      $("td:first", nRow).html(index);
                      return nRow;
                    },

                    lengthMenu: [
                      [10, 20, 30, 50, -1],
                      [10, 20, 30, 50, "All"],
                    ],
                    columnDefs: [
                      {
                        targets: 0,
                        render: function (data, type, row, meta) {
                          return type === "export" ? meta.row + 1 : data;
                        },
                      },
                    ],
                  });
                }, 1000);
              });
            }

          let obj = {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          };
          await fetch(`${baseUrl}License/getAllNewLicenses`, obj)
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
                }else if(responseJson.length === 0){
                  this.setState({ noData: true, loading: false})
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

        cancelApplication = (recid) => {
          this.setState({isCanceling: true})
          const url = `${baseUrl}License/removeRecord/${recid}`;
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
                    this.props.history.push("/new-licenses")
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
              // this.setState({
              //   isLoading: false,
              //   userApproveData: res,
              // });
            })
            .catch(error => {
              this.setState({isCanceling: false});
              alert(error);
            });
        }

        reviewApplication = async (value) => {
            this.setState({isApproving: true, disabled: true})
            let date = new Date();
            let newValues = value.split(",")

            if(this.state.licenceNumber === ""){
              Swal.fire({
                title: "Empty",
                text: "Please enter a licence number",
                icon: "error",
                confirmButtonText: "OK",
              })
              this.setState({isApproving: false, disabled: false})
            }else if(this.state.startDate === ""){
              Swal.fire({
                title: "Empty",
                text: "Please licence approval date",
                icon: "error",
                confirmButtonText: "OK",
              })
              this.setState({isApproving: false, disabled: false})
            }else if(this.state.remarks === ""){
              Swal.fire({
                title: "Empty",
                text: "Please specify remarks",
                icon: "error",
                confirmButtonText: "OK",
              })
              this.setState({isApproving: false, disabled: false})
            }else if(this.state.approval === ""){
              Swal.fire({
                title: "Empty",
                text: "Please specify approval status",
                icon: "error",
                confirmButtonText: "OK",
              })
              this.setState({isApproving: false, disabled: false})
            }else{

            var obj = {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify({
                applicationstatus: this.state.approval,
                licensedate: this.state.startDate,
                licensenumber: this.state.licenceNumber,
                licenseremarks: this.state.remarks,
                recid: newValues[0].trim()
              }),
            };
            await fetch(`${baseUrl}License/updatelicenseOfficial`, obj)
              .then((response) => response.json())
              .then((responseJson) => {
                console.warn(responseJson);

                if (responseJson.message === "License updated Successfully") {
                  this.setState({ isApproving: false, disabled: false})
                  Swal.fire({
                    title: "Success",
                    text: responseJson.message,
                    icon: "success",
                    confirmButtonText: "OK",
                  }).then(() => {
                      window.location.reload()
                      // this.props.history.push("/new-licenses")
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
            }
          };

        reviewLicenceRegistration = (recid) => {
        const url = `${baseUrl}License/getlicenseByRecID/${recid}`;
        this.setState({isApprovalLoading: true});
        fetch(url, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then(res => res.json())
          .then(res => {
            this.setState({
              isApprovalLoading: false,
              userApproveData: res,
            });
          })
          .catch(error => {
            this.setState({isApprovalLoading: false});
            alert(error);
          });
      }

      upLoadCertificate = async (recid) => {
        this.setState({isUploading: true, disabled: true});
        var obj = {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            recid: this.state.recid,
            imageToBase64String: FILEBASE64
          }),
        };
        await fetch(`${baseUrl}License/uploadLicenseCertificate`, obj)
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

        // getIndividualLicense = async ( userid ) => {
        //   const url = `${baseUrl}License/getlicenseByUserID/${userid}`;
        //   this.setState({isLoading: true});
        //   fetch(url, {
        //     method: 'GET',
        //     headers: {
        //       Accept: "application/json",
        //       "Content-Type": "application/json",
        //       Authorization: "Bearer " + localStorage.getItem("token"),
        //     },
        //   })
        //     .then(res => res.json())
        //     .then(res => {
        //       this.setState({
        //         isLoading: false,
        //         licenceData: res,
        //       });
        //
        //
        //     })
        //     .catch(error => {
        //       this.setState({error: true, loading: false});
        //       alert(error);
        //     });
        // }

        getLicenceDetails = async ( userid ) => {
          const url = `${baseUrl}License/getlicenseByUserID/${userid}`;
          this.setState({isLicenceLoading: true});
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
                isLicenceLoading: false,
                licenceData: res,
              });


            })
            .catch(error => {
              this.setState({error: true, isLicenceLoading: false});
              alert(error);
            });
        }


        showTable = () => {
          const { postsPerPage, currentPage, data } = this.state;
          const indexOfLastPost = currentPage * postsPerPage;
          const indexOfFirstPost = indexOfLastPost - postsPerPage;
          const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

          try {
            return typeof(data) !== undefined && currentPosts.map((item, index) => {
              return (
                  <tr>
                  <td className="text-xs font-weight-bold">{index +1}</td>
                 <td className="text-xs font-weight-bold">{item.title}</td>
                 <td className="text-xs font-weight-bold">{item.surname+ ' ' + item.othernames}</td>
                 <td className="text-xs font-weight-bold">{(item.licensenumber)}</td>
                 <td className={item.applicationstatus === "approved" ? 'badge bg-success mt-3' : item.applicationstatus=="pending" ? "badge bg-warning mt-3" : item.applicationstatus === "rejected" ? 'badge bg-danger mt-3' : ""}>{(item.applicationstatus)}</td>
                 <td className="text-xs font-weight-bold">{moment(item.applicationdaterecieved).format('LL')}</td>
                 <td className="text-xs font-weight-bold">{moment(item.licensedate).format('LL') === "Invalid date" ?null : moment(item.licensedate).format('LL')}</td>
                 <td>
                        <button className="btn btn-primary-2 mb-0" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"><span class="iconify" data-icon="charm:menu-meatball" style={{fontSize: 'large'}} ></span></button>
                        <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="#dropdownMenuButton2">
                        <li className="mb-2">
                          <a className="dropdown-item border-radius-md" href="javascript:;">
                            <div className="d-flex py-1">
                                <h6 className="text-sm font-weight-normal mb-1">
                                  <span id = { item.userid } onClick={() => this.getLicenceDetails(item.userid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal1">Review Submission</span>
                                </h6>
                            </div>
                          </a>
                        </li>

                        <li className="mb-2">
                          <a className="dropdown-item border-radius-md" href="javascript:;">
                            <div className="d-flex py-1">
                                <h6 className="text-sm font-weight-normal mb-1">
                                  <span id = { item.recid } onClick={() => this.getUserCertificate(item.recid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#certificate">View Certificate</span>
                                </h6>
                            </div>
                          </a>
                        </li>

                        {localStorage.getItem("email") !== null &&
                        <li className="mb-2" onClick={() => this.getFileUpload(item.recid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#upLoadCertificate">
                          <a className="dropdown-item border-radius-md" href="javascript:;">
                            <div className="d-flex py-1">
                                <h6 className="text-sm font-weight-normal mb-1">
                                  <span className="font-weight-bold" id = { item.recid }>Upload Licence Certificate</span>
                                </h6>
                            </div>
                          </a>
                        </li>
                      }

                        {localStorage.getItem("email") !== null &&
                        <li className="mb-2">
                          <a className="dropdown-item border-radius-md" href="javascript:;">
                            <div className="d-flex py-1">
                                <h6 className="text-sm font-weight-normal mb-1">
                                 <span id = { item.recid } onClick={() => this.reviewLicenceRegistration(item.recid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal3">Approve / Reject</span>
                                </h6>
                            </div>
                          </a>
                        </li>
                      }

                      {localStorage.getItem("email") !== null &&
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
                              <button type="button" class="btn-close bg-light text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              Are you sure you want to cancel this application? <br />You cannot UNDO this action.
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                              <button type="button" class="btn btn-danger" id={item.recid} onClick={()=>this.cancelApplication(item.recid)}>{this.state.isCanceling ? <Spinner animation="border" className="text-center" variant="light" size="lg" /> : "Yes, Continue"}</button>
                            </div>
                          </div>
                        </div>
                      </div>
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

        componentDidMount(){
            this.showLicenses();
        }

      render(){
        const { isLoading, isLicenceLoading, isCertificateLoading, isUploading, isApprovalLoading, isApproving } = this.state;
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
                     <h5 className="text-light">New Licence Applications</h5>
                     {/*
                     <div class="d-flex align-items-center">
                       <button class="btn bg-gradient-primary mb-0"  data-bs-toggle="modal" data-bs-target="#exampleModal" > <span class="iconify" data-icon="carbon:add" style={{fontSize: 'large'}}></span>Create User</button>
                     </div> */}
                   </div>
                 </div>

             <div class="card-body">
             {this.state.loading ?  <Spinner variant="success" animation="border" style={{ position:'relative', left: 450, top: 0 }} className="text-center" variant="success" size="lg" /> :
           <div class="container-fluid py-4">
           <div class="table-responsive p-0 pb-2">
         <table id="table" className="table align-items-center justify-content-center mb-0">
             <thead>
             <tr>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Title</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Name</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Licence No.</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Status</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Applied</th>
             <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Approved</th>
             <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Action</th>
             <th></th>
             </tr>
             </thead>

             <tbody>
             {this.showTable()}
             </tbody>
         </table>
         {this.state.noData && <center><p>No data available in the table</p></center>}
         <div style={{float: 'right'}}>
         {this.showPagination()}
         </div>
             </div>
             </div> }


    {/* <!-- Modal2 --> */}
    <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h5 class="modal-title">View Number Type</h5>
            <button type="button" class="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-12 col-md-4 col-sm-6">
                <label class="form-label">Number Type </label>
                <div class="input-group input-group-outline mb-3">
                  <input type="text" class="form-control" placeholder="00123384743" aria-label="Disabled input example" disabled />
                </div>
              </div>
              <div class="col-lg-12 col-md-4 col-sm-6">
                <label class="form-label">Number Sub Type </label>
                <div class="input-group input-group-outline mb-3">
                  <input type="text" class="form-control" placeholder="1234" aria-label="Disabled input example" disabled />
                </div>
              </div>
              <span class="pt-3"><hr class="dark horizontal my-3" /></span>
              <div class="table-responsive p-0 pb-2">
                <table class="table align-items-center justify-content-center mb-0">
                  <tbody>
                    <div class="text-uppercase text-primary text-xs font-weight-bolder opacity-7 ps-2">Alocation Stage:</div>
                    <tr>
                      <td>
                        <span class="text-xs font-weight-bold text-primary">Fees:</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">$500</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">$500</span>
                      </td>
                      <td>
                        <span class="text-xs font-weight-bold">$500</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="text-xs font-weight-bold text-primary">Tax:</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">90%</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">90%</span>
                      </td>
                      <td>
                        <span class="text-xs font-weight-bold">90%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="table-responsive p-0 pb-0 pt-2">
                <table class="table align-items-center justify-content-center mb-0">
                  <tbody>
                    <div class="text-uppercase text-primary text-xs font-weight-bolder opacity-7 ps-2">Submission Stage:</div>
                    <tr>
                      <td>
                        <span class="text-xs font-weight-bold text-primary">Fees:</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">$500</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">$500</span>
                      </td>
                      <td>
                        <span class="text-xs font-weight-bold">$500</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="text-xs font-weight-bold text-primary">Tax:</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">90%</span>
                      </td>
                      <td>
                        <span class="text-sm font-weight-bold">90%</span>
                      </td>
                      <td>
                        <span class="text-xs font-weight-bold">90%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
    {/* </body> */}

     {/* <!-- Modal --> */}
     <div className="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div className="modal-dialog">
         <div className="modal-content">
           <div className="modal-header d-flex align-items-center justify-content-between">
             <h5 className="modal-title">Approve / Reject Application</h5>
             <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
           </div>
           <div className="modal-body">
             <div className="row">
               <div clasNames="d-flex px-3">
                 { isApprovalLoading ? <center><Spinner animation="border" className="text-center" variant="danger" size="lg" /></center>  :
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
                       <label className="text-dark" htmlFor="role">Status</label>
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
                            className="form-label text-dark"
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

                       <div className="col-sm-12 col-lg-8 col-md-12 mb-3">
                          <label
                            className="form-label text-dark"
                          >
                            Date of approval
                          </label>
                          <div className="input-group input-group-outline mb-3">
                            <label className="form-label"></label>
                            <div className="input-group input-group-outline mb-3">
                              <label className="form-label"></label>
                                <DatePicker
                                selected={ this.state.startDate }
                                calendarAriaLabel="Select date of birth"
                                className="input-group form-control shadow-none mr-1 mb-3"
                                value={this.state.startDate}
                                onChange={ this.handleDateChange }
                                name="startDate"
                                dateFormat="MM/dd/yyyy" />
                            </div>
                          </div>
                        </div>

                       <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                          <label
                            className="form-label"
                          >
                            Licence number
                          </label>
                          <div className="input-group input-group-outline mb-3">
                            <label className="form-label"></label>
                            <input
                              className="form-control shadow-none"
                              required="required"
                              type="text"
                              onChange={(e) => this.setState({ licenceNumber: e.target.value })}
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
                            <button
                              id={`${item.recid}, ${item.licensenumber}`}
                              disabled={this.state.disabled}
                              style={{
                                alignSelf: "center",
                                width: "100%",
                                backgroundColor: "#003314",
                              }}
                              className="btn btn-success btn-lg"
                              onClick={(e) => this.reviewApplication(`${item.recid}, ${item.licensenumber}`)}
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
     {/* END OF REVIEW REGISTRATION */}


     {/* START OF UPLOAD CERTIFICATE */}
       <div className="modal fade" id="upLoadCertificate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                 </div>
                 <span className="pt-3"><hr class="dark horizontal my-3" /></span>
               </div>
             </div>
             <div class="modal-footer">
               <button type="button" data-bs-dismiss="modal" class="btn btn-primary">Close</button>
             </div>
           </div>
         </div>
       </div>
      {/* END OF UPLOAD CERTIFICATE */}

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
                                   {item.licensecertificate ?
                                   <img crossorigin="anonymous" width='450' height='450'  src={`${item.licensecertificate}`} />
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


             {/* View Submission */}
               <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                 <div className="modal-dialog modal-xl">
                   <div className="modal-content">
                     <div className="modal-header d-flex align-items-center justify-content-between bg-success">
                       <h5 className="modal-title text-light">Newly Applied Licence</h5>
                       <button className="text-light btn btn-primary btn-lg" style={{ marginRight: 18}} onClick={()=>this.print()}>Print</button>
                       <button type="button" className="btn btn-link m-0 p-0 text-light fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                     </div>
                     <div className="text-center container-fluid px-4 d-flex justify-content-between" style={{width: '100%', justifyContent: 'space-evenly', alignItems: 'center', position: 'relative', top: 18 }}>
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
                     <div className="modal-body">
                       <div className="row">
                         <div clasNames="d-flex px-3">
                           <div className="my-auto text-center">
                             <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                           </div>
                           { isLicenceLoading ? <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center>  :
                           <div className="d-flex flex-column">
                             {/*<h6 className="text-lg font-weight-normal mb-1">
                               <span className="font-weight-bold">NiCFOsT</span>
                             </h6> */}
                             {this.state.licenceData.map((item) => {
                               return (
                                 <div>
                                 <h4 className="text-dark text-uppercase ms-sm-4 ">{ item.title + ' ' + item.surname + ' ' + item.othernames }</h4>
                                 <span className="pt-3"><hr class="dark horizontal my-3" /></span>

                                <div className = "row">
                                 <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                    <label
                                      className="form-label"
                                    >
                                      Application date
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <input
                                        className="form-control shadow-none"
                                         disabled
                                        type="phone"
                                        value = { moment(item.applicationdate).format('LL') }
                                      />
                                    </div>
                                  </div>
                                 <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                    <label
                                      className="form-label"
                                    >
                                      Licence number
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <input
                                        className="form-control shadow-none"
                                         disabled
                                        type="phone"
                                        value = { item.licensenumber }
                                      />
                                    </div>
                                  </div>
                                 <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                    <label
                                      className="form-label"
                                    >
                                      Date acquired licence
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <input
                                        className="form-control shadow-none"
                                         disabled
                                        type="phone"
                                        value = { moment(item.licensedate).format('LL') }
                                      />
                                    </div>
                                  </div>

                                 <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                    <label
                                      className="form-label"
                                    >
                                     Licence expiry date
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <input
                                        className="form-control shadow-none"
                                         disabled
                                        type="phone"
                                        value = { moment(item.licenseexpdate).format('LL') }
                                      />
                                    </div>
                                  </div>

                                 <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                    <label
                                      className="form-label"
                                    >
                                     Licence remarks
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <textarea
                                        className="form-control shadow-none"
                                         disabled
                                        type="text"
                                        value = { item.licenseremarks }
                                       >
                                       </textarea>
                                    </div>
                                  </div>

                                  <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                     <label
                                       className="form-label"
                                     >
                                       Date of birth
                                     </label>
                                     <div className="input-group input-group-outline mb-3">
                                       <label className="form-label"></label>
                                       <input
                                         className="form-control shadow-none"
                                         disabled
                                         type="phone"
                                         value = { moment(item.DOB).format('LL') }
                                       />
                                     </div>
                                   </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Previous surname
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.previoussurname }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Email
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.contactemail }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Phone
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.contacttelephone }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Tertiary Institution
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.tertiaryinstitution }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Course of Study
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.courseofstudy }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Gender
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.gender }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        LGA
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.lga }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        State
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.state }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Nationality
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.nationality }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Practice category
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.practicecategory }
                                        />
                                      </div>
                                    </div>

                                    <hr />

                                    <label
                                      className="mb-3 h4"
                                      style={{ color: "green" }}
                                      htmlFor="floatingInputCustom"
                                    >
                                      Qualification
                                    </label>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        First qualification
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="text"
                                          value = { item.qualification1 }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Second qualification
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="text"
                                          value = { item.qualification2 }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Third qualification
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="text"
                                          value = { item.qualification3 }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Fourth qualification
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="text"
                                          value = { item.qualification4 }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Fifth qualification
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="text"
                                          value = { item.qualification5 }
                                        />
                                      </div>
                                    </div>

                                   <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                      <label
                                        className="form-label"
                                      >
                                        Year of qualification
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          className="form-control shadow-none"
                                          disabled
                                          type="phone"
                                          value = { item.yearofqualification }
                                        />
                                      </div>
                                    </div>
                                    <hr />

                                    <label
                                      className="mb-3 h4"
                                      style={{ color: "green" }}
                                      htmlFor="floatingInputCustom"
                                    >
                                      Previous Licence
                                    </label>

                                    <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                       <label
                                         className="form-label"
                                       >
                                         Date acquired
                                       </label>
                                       <div className="input-group input-group-outline mb-3">
                                         <label className="form-label"></label>
                                         <input
                                           className="form-control shadow-none"
                                           disabled
                                           type="phone"
                                           value = {moment(item.previouslicensedate).format('LL') }
                                         />
                                       </div>
                                     </div>

                                    <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                       <label
                                         className="form-label"
                                       >
                                         Previous licence number
                                       </label>
                                       <div className="input-group input-group-outline mb-3">
                                         <label className="form-label"></label>
                                         <input
                                           className="form-control shadow-none"
                                           disabled
                                           type="phone"
                                           value = { item.previouslicensenumber }
                                         />
                                       </div>
                                     </div>

                                    <hr />
                                  <label
                                    className="mb-3 h4"
                                    style={{ color: "green" }}
                                    htmlFor="floatingInputCustom"
                                  >
                                    Place of work
                                  </label>

                                  <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                     <label
                                       className="form-label"
                                     >
                                       Organization name
                                     </label>
                                     <div className="input-group input-group-outline mb-3">
                                       <label className="form-label"></label>
                                       <input
                                         className="form-control shadow-none"
                                         disabled
                                         type="phone"
                                         value = { item.organization }
                                       />
                                     </div>
                                   </div>

                                  <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                     <label
                                       className="form-label"
                                     >
                                       Organization name
                                     </label>
                                     <div className="input-group input-group-outline mb-3">
                                       <label className="form-label"></label>
                                       <input
                                         className="form-control shadow-none"
                                         disabled
                                         type="phone"
                                         value = { item.organization }
                                       />
                                     </div>
                                   </div>

                                  <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                     <label
                                       className="form-label"
                                     >
                                       Organization address
                                     </label>
                                     <div className="input-group input-group-outline mb-3">
                                       <label className="form-label"></label>
                                       <input
                                         className="form-control shadow-none"
                                         disabled
                                         type="phone"
                                         value = { item.organizationaddress }
                                       />
                                     </div>
                                   </div>

                                  <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                     <label
                                       className="form-label"
                                     >
                                       Organization email
                                     </label>
                                     <div className="input-group input-group-outline mb-3">
                                       <label className="form-label"></label>
                                       <input
                                         className="form-control shadow-none"
                                         disabled
                                         type="phone"
                                         value = { item.organizationemail }
                                       />
                                     </div>
                                   </div>

                                  <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                     <label
                                       className="form-label"
                                     >
                                       Organization position
                                     </label>
                                     <div className="input-group input-group-outline mb-3">
                                       <label className="form-label"></label>
                                       <input
                                         className="form-control shadow-none"
                                         disabled
                                         type="phone"
                                         value = { item.organizationposition }
                                       />
                                     </div>
                                   </div>

                                  <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                     <label
                                       className="form-label"
                                     >
                                       Organization phone
                                     </label>
                                     <div className="input-group input-group-outline mb-3">
                                       <label className="form-label"></label>
                                       <input
                                         className="form-control shadow-none"
                                         disabled
                                         type="phone"
                                         value = { item.organizationtelephone }
                                       />
                                     </div>
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
                     <div class="modal-footer">
                       <button type="button" data-bs-dismiss="modal" class="btn btn-danger">Close</button>
                     </div>
                   </div>
                 </div>

                 </div>
                 </div>
                 </div>
                 </div>
                 </div>
                 </div>

           </main>
            </div>
          )
      }
}

export default NewLicences;
