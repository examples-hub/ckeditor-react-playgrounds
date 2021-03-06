import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import { InsertProductPreviewCommand } from './cmd';

/**
 * extend the editor data layers to support the new kind of content.
 */
export class ProductPreviewEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add(
      'insertProductPreview',
      new InsertProductPreviewCommand(this.editor),
    );
  }

  /**
   * 定义model： <productPreview id="..." />
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('productPreview', {
      // Behaves like a self-contained object (e.g. an image).
      isObject: true,

      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: '$block',

      // Each product preview has an ID. A unique ID tells the application which
      // product it represents and makes it possible to render it inside a widget.
      allowAttributes: ['id'],
    });
  }

  _defineConverters() {
    const editor = this.editor;
    const conversion = editor.conversion;
    /** 从editor.config中获取product对应的react组件 */
    const renderProduct = editor.config.get('products').productRenderer;

    // <productPreview> converters ((data) view → model)
    conversion.for('upcast').elementToElement({
      view: {
        name: 'section',
        classes: 'product',
      },
      model: (viewElement, { writer: modelWriter }) => {
        // Read the "data-id" attribute from the view and set it as the "id" in the model.
        return modelWriter.createElement('productPreview', {
          id: parseInt(viewElement.getAttribute('data-id'), 10),
        });
      },
    });

    // <productPreview> converters (model → data view)
    // * 注意data view中不包含样式
    conversion.for('dataDowncast').elementToElement({
      model: 'productPreview',
      view: (modelElement, { writer: viewWriter }) => {
        // In the data view, the model <productPreview> corresponds to:

        // <section class="product" data-id="..."></section>

        return viewWriter.createEmptyElement('section', {
          class: 'product',
          'data-id': modelElement.getAttribute('id'),
        });
      },
    });

    // <productPreview> converters (model → editing view)
    /**
     * * 注意editingDowncast中，createRawElement('div',options)会创建div作为react组件容器。
     * * options为函数时，这里可以执行ReactDOM.render。
     * - Raw elements work as data containers but their children are not managed or even recognized by the editor.
     * - Raw elements are a perfect tool for integration with external frameworks and data sources.
     * - they are considered by the editor selection and they can work as widgets.
     * - You should not use raw elements to render the UI in the editor content
     */
    conversion.for('editingDowncast').elementToElement({
      model: 'productPreview',
      view: (modelElement, { writer: viewWriter }) => {
        // In the editing view, the model <productPreview> corresponds to:

        // <section class="product" data-id="...">
        //     <div class="product__react-wrapper">
        //         <ProductPreview /> (React component)
        //     </div>
        // </section>

        const id = modelElement.getAttribute('id');

        // The outermost <section class="product" data-id="..."></section> element.
        const section = viewWriter.createContainerElement('section', {
          class: 'product',
          'data-id': id,
        });

        // The inner <div class="product__react-wrapper"></div> element.
        // * This element will host a React <ProductPreview /> component.
        const reactWrapper = viewWriter.createRawElement(
          'div',
          {
            class: 'product__react-wrapper',
          },
          function (domElement) {
            // This the place where React renders the actual product preview hosted
            // by a UIElement in the view. You are using a function (renderer) passed as
            // editor.config.products#productRenderer.
            renderProduct(id, domElement);
          },
        );

        viewWriter.insert(
          viewWriter.createPositionAt(section, 0),
          reactWrapper,
        );

        return toWidget(section, viewWriter, {
          label: 'product preview widget',
        });
      },
    });
  }
}
