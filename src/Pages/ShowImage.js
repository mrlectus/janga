import React, { PureComponent } from 'react';

function ShowImage({ location }) {
  console.log(location)
  return (
    <div>
      <h2>{location.state.data}</h2>
    </div>
  );
}


export default ShowImage;
