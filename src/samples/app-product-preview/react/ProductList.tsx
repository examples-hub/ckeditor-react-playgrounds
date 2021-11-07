import React from 'react';

import { ProductPreview } from './ProductPreview';

export class ProductList extends React.Component<any, any> {
  render() {
    return (
      <div className='app__product-list'>
        <h3>Products</h3>
        <ul>
          {this.props.products.map((product) => {
            return (
              <li key={product.id}>
                <ProductPreview
                  id={product.id}
                  onClick={this.props.onClick}
                  {...product}
                />
              </li>
            );
          })}
        </ul>
        <p>
          <b>提示</b>: 点击上面的产品，就可以将产品信息插入编辑器
        </p>
      </div>
    );
  }
}
