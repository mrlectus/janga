import React, { Component } from 'react';
import { Route, HashRouter, Switch, Redirect } from "react-router-dom";
import CreateUser from './Pages/CreateUser';
import Dashboard from './Pages/Dashboard';
import AllFoodScientists from './Pages/AllFoodScientists';
import Licenses from './Pages/Licenses';
import Login from './Pages/Login';
import Premises from './Pages/Premises';
import Payments from './Pages/Payments';
import WorkFlow from './Pages/WorkFlow';
import AllUsers from './Pages/AdminUsers';
import PublicUsers from './Pages/PublicUsers';
import NewLicences from './Pages/NewLicences';
import NewPremises from './Pages/NewPremises';
import Inspection from './Pages/Inspections';
import ShowImage from './Pages/ShowImage';
import LicenceRenewals from './Pages/LicenceRenewals';
import RegistrationRenewals from './Pages/RegistrationRenewals';
import PremisesRenewals from './Pages/PremisesRenewals';
import PrintFoodScientistRecord from './Pages/PrintFoodScientistRecord';
import PrintLicenceRecord from './Pages/PrintLicenceRecord';
import PrintPremisesRecord from './Pages/PrintPremisesRecord';
import PrintInspectionRecord from './Pages/PrintInspectionRecord';
import NewFoodScientistRegistrations from './Pages/NewFoodScientistRegistrations';
import Logout from './Pages/Logout';
import Excel from './Excel';

class App extends Component{

  render(){
    return(
          <HashRouter>
          <Switch>
          <Route exact path="/all-licenses" component={Licenses} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/create-user" component={CreateUser} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/image" component={ShowImage} />
          <Route exact path="/food-scientists" component={AllFoodScientists} />
          <Route exact path="/all-premises" component={Premises} />
          <Route exact path="/new-premises" component={NewPremises} />
          <Route exact path="/payments" component={Payments} />
          <Route exact path="/new-licenses" component={NewLicences} />
          <Route exact path="/workflow" component={WorkFlow} />
          <Route exact path="/new-registrations" component={NewFoodScientistRegistrations} />
          <Route exact path="/licence-renewals" component={LicenceRenewals} />
          <Route exact path="/registration-renewals" component={RegistrationRenewals} />
          <Route exact path="/premises-renewals" component={PremisesRenewals} />
          <Route exact path="/print-food-scientist-record" component={PrintFoodScientistRecord} />
          <Route exact path="/print-licence-record" component={PrintLicenceRecord} />
          <Route exact path="/print-premises-record" component={PrintPremisesRecord} />
          <Route exact path="/print-inspection-record" component={PrintInspectionRecord} />
          <Route exact path="/admin-users" component={AllUsers} />
          <Route exact path="/public-users" component={PublicUsers} />
          <Route exact path="/inspections" component={Inspection} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/excel" component={Excel} />
          <Redirect exact from="/" to="/login" />
          </Switch>
          </HashRouter>
    )
  }
}

export default App;
