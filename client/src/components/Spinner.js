// import React from 'react';
// import '../styles/Spinner.css';

// const Spinner = () => {
//   return (
//    <span className="loader ms-5 justify-content:center align-content:center" />

//     );
// };

// export default Spinner;

import React, { useEffect, useState } from 'react';
import '../styles/Spinner.css';

const Spinner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
  // Hide the spinner after 5 seconds
  const timer = setTimeout(() => {
    setVisible(false);
  }, 5000); // 5000 milliseconds = 5 seconds

  return () => clearTimeout(timer); // cleanup
}, []);


  if (!visible) return null;

  return (
    <div className="spinner-container">
      <span className="loader" />
    </div>
  );
};

export default Spinner;
