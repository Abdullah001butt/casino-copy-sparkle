import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your casino article...",
  height = "400px"
}) => {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'script',
    'code-block'
  ];

  return (
    <div className="rich-text-editor">
      <style>{`
        .rich-text-editor .ql-editor {
          min-height: ${height};
          font-size: 16px;
          line-height: 1.6;
          color: #ffffff;
          background-color: #1f2937;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #d4af37;
          border-left: 1px solid #d4af37;
          border-right: 1px solid #d4af37;
          background-color: #374151;
        }
        
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #d4af37;
          border-left: 1px solid #d4af37;
          border-right: 1px solid #d4af37;
          background-color: #1f2937;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #d4af37;
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #d4af37;
        }
        
        .rich-text-editor .ql-toolbar button:hover {
          background-color: #d4af37;
          color: #000000;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active {
          background-color: #d4af37;
          color: #000000;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3,
        .rich-text-editor .ql-editor h4,
        .rich-text-editor .ql-editor h5,
        .rich-text-editor .ql-editor h6 {
          color: #d4af37;
          font-weight: bold;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #d4af37;
          background-color: #374151;
          padding: 16px;
          margin: 16px 0;
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor code {
          background-color: #374151;
          color: #00ffff;
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        .rich-text-editor .ql-editor pre {
          background-color: #111827;
          color: #00ffff;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #d4af37;
        }
        
        .rich-text-editor .ql-editor a {
          color: #00ffff;
          text-decoration: underline;
        }
        
        .rich-text-editor .ql-editor a:hover {
          color: #d4af37;
        }
      `}</style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
