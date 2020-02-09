import React from 'react';
import './ScrollView.css';

const ScrollView = (props) => (
   <div className="horizontal-scroll" {...props}>
     { props.children }
   </div>
);

  export default ScrollView;
