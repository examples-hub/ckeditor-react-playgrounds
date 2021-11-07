import './assets/styles.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import Link from '@ckeditor/ckeditor5-link/src/link';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

import { ProductPreviewEditing } from './ckeditor/product-preview/editing';
import { initialDataForEditor } from './config';
import { ProductList } from './react/ProductList';
import { ProductPreview } from './react/ProductPreview';

/**
 * The React application class.
 * It renders the editor and the product list.
 */
class ProcutPreviewBaseApp extends React.Component<any, any> {
  editor: any;
  editorConfig: {
    plugins: any[];
    toolbar: string[];
    table: { contentToolbar: string[] };
    products: { productRenderer: (id: any, domElement: any) => void };
  };

  constructor(props) {
    super(props);

    // A place to store the reference to the editor instance created by the <CKEditor> component.
    // The editor instance is created asynchronously and is only available when the editor is ready.
    this.editor = null;

    this.state = {
      // The initial editor data. It is bound to the editor instance and will change as
      // the user types and modifies the content of the editor.
      editorData: initialDataForEditor,
    };

    // The configuration of the <CKEditor> instance.
    this.editorConfig = {
      plugins: [
        // A set of editor features to be enabled and made available to the user.
        Essentials,
        Heading,
        Bold,
        Italic,
        Underline,
        Link,
        Paragraph,
        Table,
        TableToolbar,

        // Your custom plugin implementing the widget is loaded here.
        ProductPreviewEditing,
      ],
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'link',
        'insertTable',
        '|',
        'undo',
        'redo',
      ],
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
      // * The configuration of the Products plugin. It specifies a function that will allow
      // the editor to render a React <ProductPreview> component inside a product widget.
      products: {
        productRenderer: (id, domElement) => {
          const product = this.props.products.find(
            (product) => product.id === id,
          );

          ReactDOM.render(<ProductPreview id={id} {...product} />, domElement);
        },
      },
    };

    this.handleEditorDataChange = this.handleEditorDataChange.bind(this);
    this.handleEditorReady = this.handleEditorReady.bind(this);
  }

  // A handler executed when the user types or modifies the editor content.
  // It updates the state of the application.
  handleEditorDataChange(evt, editor) {
    this.setState({
      editorData: editor.getData(),
    });
  }

  // A handler executed when the editor has been initialized and is ready.
  // It synchronizes the initial data state and saves the reference to the editor instance.
  handleEditorReady(editor) {
    this.editor = editor;

    this.setState({
      editorData: editor.getData(),
    });

    CKEditorInspector.attach({ 'react-editor': editor });
  }

  render() {
    return (
      <div className='app'>
        <div className='app__offer-editor' key='offer-editor'>
          <h3>ckeditor-react示例应用</h3>
          <CKEditor
            editor={ClassicEditor}
            config={this.editorConfig}
            data={this.state.editorData}
            onChange={this.handleEditorDataChange}
            onReady={this.handleEditorReady}
          />

          <h3>Editor data</h3>
          <textarea value={this.state.editorData} readOnly={true} />
        </div>
        <ProductList
          key='product-list'
          products={this.props.products}
          onClick={(id) => {
            this.editor.execute('insertProductPreview', id);
            this.editor.editing.view.focus();
          }}
        />
      </div>
    );
  }
}

export function CKEApp() {
  return (
    <ProcutPreviewBaseApp
      products={[
        {
          id: 1,
          name: 'Colors of summer in Poland',
          price: '$1500',
          image: 'product1.jpg',
        },
        {
          id: 2,
          name: 'Mediterranean sun on Malta',
          price: '$1899',
          image: 'product2.jpg',
        },
        {
          id: 3,
          name: 'Tastes of Asia',
          price: '$2599',
          image: 'product3.jpg',
        },
        {
          id: 4,
          name: 'Exotic India',
          price: '$2200',
          image: 'product4.jpg',
        },
      ]}
    />
  );
}

export default CKEApp;
