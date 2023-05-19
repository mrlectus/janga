import React, { PureComponent } from 'react';
import { Spinner } from "react-bootstrap";
import Sidebar from '../Components/Sidebar';

class Logout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount(){
      localStorage.clear();
        this.props.history.push("/login")
  }

  render() {
    return (
      <div>
        <Sidebar />
        <div
          style={{
            display: "flex",
            width: "100%",
            marginTop: 350,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            {this.state.loading ? (
              <Spinner animation="border" variant="dark" />
            ) : null}
          </div>
        </div>
      </div>
    )
}
}

export default Logout
