// import './index.scss';

import * as React from 'react';

import { Card } from './components';
import CKEApp from './samples/app-product-preview/ProductPreviewApp';

// import CKEApp from '.';

export const App = () => {
  return (
    <div>
      {/* <input type='' /> */}
      <h1>Hello, CKEditor 5 编辑器 20201 </h1>
      {/* <Card size={16} /> */}
      <CKEApp />
    </div>
  );
};

export default App;
