import React, { PureComponent } from "react";
import Swal from "sweetalert2";
import { baseUrl } from "../Components/BaseUrl";
import { Link } from "react-router-dom";
import Sidebar from '../Components/Sidebar';
import { Spinner } from "react-bootstrap";
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
import ReactToPrint from "react-to-print";
import { DownloadExcel } from "react-excel-export";



class InspectionReport extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loading: false,
            isLoading: false,
            premisesData: [],
            postsPerPage: 10,
            currentPage: 1,
        }
    }


    print(){
      window.print()
     }

    getSinglePremises = (userid) => {
      const url = `${baseUrl}Premises/getPremisesByUserID/${userid}`;
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
            premisesData: res,
          });
        })
        .catch(error => {
          this.setState({error: true, loading: false});
          alert(error);
        });
    }

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
        await fetch(`${baseUrl}Inspection/getAllInspection`, obj)
          .then((response) => response.json())
          .then((responseJson) => {
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
        try {
          return this.state.data.map((item, index) => {
            return (
                <tr>
                 <td className="text-xs text-capitalize font-weight-bold">{index +1}</td>
                 <td className="text-xs text-capitalize font-weight-bold">{(item.organisationname)}</td>
                 <td className="text-xs text-capitalize font-weight-bold">{(item.addressstate)}</td>
                 <td className="text-xs text-capitalize font-weight-bold">{(item.businesstype)}</td>
                 <td className={item.inspectionstatus.toLowerCase() === "approved" ? 'badge bg-success mt-3' : item.inspectionstatus.toLowerCase()=="pending" ? "badge bg-warning mt-3" : item.inspectionstatus.toLowerCase() === "rejected" ? 'badge bg-danger mt-3' : ""}>{(item.inspectionstatus)}</td>
                 <td className="text-xs text-capitalize font-weight-bold">{(item.applicationdate) === "Invalid Date" ? null : (moment(item.applicationdate).format('LL'))}</td>
                 <td className="text-xs text-capitalize font-weight-bold">{(moment(item.reportdate).format('LL'))}</td>
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
          this.showLicenses();
      }

    render(){
      console.warn(this.state.data);
      const { isLoading } = this.state;
        return(
        <div className="g-sidenav-show">
          <Sidebar />
       <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{width: '80%', float: 'right'}}>
         <div class="container-fluid px-4">
         <div class="rown">
           <div class="col-12">
             <div class="card my-3">
               <div class="card-header pb-4 bg-light">
                 <div class="d-flex flex-wrap align-items-center justify-content-between">
                   <h5 className="text-dark">All Inspection Applications</h5>
                   <div class="d-flex flex-wrap align-items-center justify-content-between">
                   <button className="text-dark btn btn-light btn-lg" style={{ marginRight: 18}} onClick={()=>this.print()}>Print</button>

                   <button className="btn btn-lg btn-light">
                   <DownloadExcel
                    className="btn btn-light"
                    data={this.state.data.trim()}
                    buttonLabel="Export as Excel"
                    fileName="premises"
                  />
                  </button>
                   </div>
                 </div>
               </div>

           <div class="card-body">

         {this.state.loading ?  <Spinner animation="border" style={{ position:'relative', left: 450, top: 0 }} className="text-center" variant="success" size="lg" /> :
         <div class="container-fluid py-4">
         <div class="table-responsive p-0 pb-2">
         <table id="table" className="table align-items-center justify-content-center mb-0">
           <thead>
             <tr>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Organization</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">State Location</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Business Type</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Status</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Date</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Approval Date</th>
             <th></th>
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
           </div>
            }
           {/* <Footer /> */}

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

export default InspectionReport;
