import { Component } from "react";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { baseUrl } from "../Components/BaseUrl";
import Sidebar from '../Components/Sidebar';
import { Link } from "react-router-dom";

class Dashboard extends Component{

  constructor(props){
    super(props);
    this.state = {
      numberOfPublicUsers: '',
      numberOfAdminUsers: '',
      numberOfFoodScientists: '',
      numberOfRegisteredLicence: '',
      numberOfPayments: '',
      isCountingPublicUsers: false,
      isCountingAdminUsers: false,
      isCountingFoodScientists: false,
      isCountingLicence: false,
      isCountingPayments: false,
    }
  }

  countPublicUsers = async () => {
    this.setState({ isCountingPublicUsers: true })
      let obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await fetch(`${baseUrl}UsersMgt/GetUsersByType/public`, obj)
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
            }else if(responseJson.length > 0){
              this.setState({numberOfPublicUsers: responseJson.length, isCountingPublicUsers: false});
          }else{
              this.setState({numberOfPublicUsers: 'No registered users', isCountingPublicUsers: false});
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

  countAdminUsers = async () => {
    this.setState({ isCountingAdminUsers: true })
      let obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await fetch(`${baseUrl}UsersMgt/GetUsersByType/private`, obj)
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
            }else if(responseJson.length > 0){
              this.setState({numberOfAdminUsers: responseJson.length, isCountingAdminUsers: false});
          }else{
              this.setState({numberOfAdminUsers: 'No registered users', isCountingAdminUsers: false});
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

  countFoodScientists = async () => {
    this.setState({ isCountingFoodScientists: true })
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
            }else if(responseJson.length > 0){
              this.setState({numberOfFoodScientists: responseJson.length, isCountingFoodScientists: false});
          }else{
              this.setState({numberOfFoodScientists: 'No registered food scientists', isCountingFoodScientists: false});
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

  countLicence = async () => {
    this.setState({ isCountingLicence: true })
      let obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await fetch(`${baseUrl}License/getAllLicense`, obj)
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
            }else if(responseJson.length > 0){
              this.setState({numberOfRegisteredLicence: responseJson.length, isCountingLicence: false});
          }else{
              this.setState({numberOfRegisteredLicence: 'No registered licenced user', isCountingLicence: false});
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

  countPayments = async () => {
    this.setState({ isCountingPayments: true })
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
            }else if(responseJson.length > 0){
              this.setState({numberOfPayments: responseJson.length, isCountingPayments: false});
          }else{
              this.setState({numberOfPayments: 'No payment has been recorded', isCountingPayments: false});
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


   componentDidMount(){
     if(localStorage.getItem("userid") === null){
       this.props.history.push("/login")
     }else{
       this.countPublicUsers();
       this.countAdminUsers();
       this.countFoodScientists();
       this.countLicence();
       this.countPayments();
     }
   }

    render(){
      const { isCountingPublicUsers, isCountingAdminUsers, isCountingFoodScientists, isCountingLicence, isCountingPayments, numberOfPayments, numberOfRegisteredLicence, numberOfFoodScientists, numberOfAdminUsers, numberOfPublicUsers } = this.state
        return(
          <div>
            <Sidebar />
            <div class="container-fluid py-4" style={{ width: '70%', position: 'relative', left: 81, height: '100%' }}>
              <div class="row">
                <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
                  <div class="card bg-success">
                    <div class="card-header bg-success p-3 pt-2">
                      <div class="icon icon-lg icon-shape bg-success shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                        <i class="material-icons opacity-10">store</i>
                      </div>
                      <div class="text-end pt-1">
                        <p class="text-sm mb-0 text-light text-capitalize fw-bold">All Public Users</p>
                      </div>
                    </div>
                    <span class="pt-4"><hr class="light horizontal my-0" /></span>
                    <div class="card-footer p-3">
                      <h4 class="mb-0 text-light text-end">{isCountingPublicUsers ? <Spinner animation="border" size="sm" className="justify-content-end text-end" variant="light" style={{ position: 'relative', left: 0, top: 0}} /> : numberOfPublicUsers }</h4>
                    </div>
                  </div>
                </div>
                <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
                  <div class="card bg-warning">
                    <div class="card-header bg-warning p-3 pt-2">
                      <div class="icon icon-lg icon-shape bg-gradient-danger shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                        <i class="material-icons opacity-10">receipt</i>
                      </div>
                      <div class="text-end pt-1">
                        <p class="text-sm mb-0 text-light text-capitalize fw-bold">All Admin Users</p>
                      </div>
                    </div>
                    <span class="pt-4"><hr class="dark horizontal my-0" /></span>
                    <div class="card-footer p-3">
                    <h4 class="mb-0 text-light text-end">{isCountingAdminUsers ? <Spinner animation="border" size="sm" className="justify-content-end text-end" variant="light" style={{ position: 'relative', left: 0, top: 0}} /> : numberOfAdminUsers }</h4>
                    </div>
                  </div>
                </div>
                <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
                  <div class="card bg-success">
                    <div class="card-header bg-success p-3 pt-2">
                      <div class="icon icon-lg icon-shape bg-gradient-warning shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                        <i class="material-icons opacity-10">badge</i>
                      </div>
                      <div class="text-end pt-1">
                        <p class="text-sm mb-0 text-light text-capitalize fw-bold">Food Scientist Registration</p>
                      </div>
                    </div>
                    <span class="pt-4"><hr class="dark horizontal my-0" /></span>
                    <div class="card-footer p-3">
                      <h4 class="mb-0 text-light text-end">{isCountingFoodScientists ? <Spinner animation="border" size="sm" className="justify-content-end text-end" variant="light" style={{ position: 'relative', left: 0, top: 0}} /> : numberOfFoodScientists }</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-lg-4 col-md-6 mt-4 mb-4">
                  <div class="card bg-primary z-index-2 ">
                    <div class="card-body">
                      <h6 class="mb-0 text-light font-weight-bold text-end">Licence Registrations</h6>
                      <hr class="dark horizontal" />
                      {/* <p class="text-sm text-end">Total Number of Sort Codes Available</p> */}
                      <h4 class="mb-0 text-light text-end">{isCountingLicence ? <Spinner animation="border" size="sm" className="justify-content-end text-end" variant="light" style={{ position: 'relative', left: 0, top: 0}} /> : numberOfRegisteredLicence }</h4>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 mt-4 mb-4">
                  <div class="card bg-success z-index-2  ">
                    <div class="card-body">
                      <h6 class="mb-0 text-light font-weight-bold text-end"> Payments </h6>
                      <hr class="dark horizontal" />
                      {/* <p class="text-sm text-end">Total Number Of Invoice Available</p> */}
                      <h4 class="mb-0 text-light text-end">{isCountingPayments ? <Spinner animation="border" size="sm" className="justify-content-end text-end" variant="light" style={{ position: 'relative', left: 0, top: 0}} /> : numberOfPayments }</h4>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 mt-4 mb-3">
                  <div class="card bg-gradient-danger z-index-2 ">
                    <div class="card-body">
                      <h6 class="mb-0 text-light font-weight-bold text-end">Declined Applications</h6>
                      <hr class="dark horizontal" />
                      {/* <p class="text-sm text-end">Total Standard Numbers Available</p> */}
                      <h4 class="mb-0 text-light text-end">5</h4>
                    </div>
                  </div>
                </div>
              </div>
              </div>
             </div>
        )
    }
}

export default Dashboard;
