import React, { PureComponent } from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css';
import './index.less';

class Editor extends PureComponent {
  render() {
    return (
      <div>
        <ReactQuill
          theme="snow"
          onChange={this.props.handleChange}
          value={this.props.editorHtml}
          modules={Editor.modules}
          formats={Editor.formats}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

Editor.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' },
      { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

Editor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
];

export default Editor;

// Editor.propTypes = {
//   placeholder: React.PropTypes.string,
// };
