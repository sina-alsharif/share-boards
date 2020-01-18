import React from 'react';

export default function Cardp(props) {
  return (
    //   <div className="tile is-parent"> </div>
    <div className="card tile is-child box column">
         <div className="card-body">
            <p className="card-title">
            {props.name}
            </p>
            <p className="subtitle">
            Some text
            </p>
    </div>
    </div>
  );
}
