import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/button';

const SHORTCODES = [
  { code: '{{candidate_name}}', label: 'Candidate Name', desc: "Candidate's full name" },
  { code: '{{email}}', label: 'Email Address', desc: 'Candidate email' },
  { code: '{{phone}}', label: 'Phone Number', desc: 'Contact number' },
  { code: '{{application_id}}', label: 'Application ID', desc: 'Unique application ID' },
  { code: '{{trade}}', label: 'Trade/Profession', desc: 'Applied position' },
  { code: '{{submitted_date}}', label: 'Submission Date', desc: 'When application was submitted' },
  { code: '{{updated_date}}', label: 'Update Date', desc: 'Last update date' },
  { code: '{{status}}', label: 'Status', desc: 'Application status' },
  { code: '{{remarks}}', label: 'Remarks', desc: 'Admin remarks/notes' },
  { code: '{{reset_link}}', label: 'Password Reset Link', desc: 'For password reset emails' },
  { code: '{{years_of_experience}}', label: 'Years of Experience', desc: 'Work experience years' },
  { code: '{{education_level}}', label: 'Education Level', desc: 'Highest education' },
  { code: '{{languages}}', label: 'Languages', desc: 'Known languages' },
  { code: '{{passport_number}}', label: 'Passport Number', desc: 'Passport ID' },
  { code: '{{date_of_birth}}', label: 'Date of Birth', desc: 'Birth date' },
  { code: '{{address}}', label: 'Address', desc: 'Full address' },
];

export default function EmailEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);
  const [showShortcodes, setShowShortcodes] = useState(false);

  const insertShortcode = (shortcode) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const position = range ? range.index : quill.getLength();
      quill.insertText(position, shortcode);
      quill.setSelection(position + shortcode.length);
    }
    setShowShortcodes(false);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className="email-editor-container">
      <div className="mb-3 flex justify-between items-center bg-gray-50 p-3 rounded-t-lg border border-gray-300">
        <div className="text-sm font-medium text-gray-700">Email Body Editor</div>
        <Button
          type="button"
          onClick={() => setShowShortcodes(!showShortcodes)}
          className="bg-[#00A6CE] hover:bg-[#0090B5] text-white text-xs px-4 py-2"
        >
          {showShortcodes ? 'Hide' : 'Insert'} Shortcode
        </Button>
      </div>

      {showShortcodes && (
        <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg max-h-64 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Shortcodes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SHORTCODES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => insertShortcode(item.code)}
                className="text-left p-2 bg-white hover:bg-blue-100 border border-gray-300 rounded transition-colors"
              >
                <div className="font-mono text-xs text-[#00A6CE] font-semibold">{item.code}</div>
                <div className="text-xs text-gray-600">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Compose your email here..."}
        className="bg-white"
        style={{ height: '400px', marginBottom: '60px' }}
      />

      <style>{`
        .email-editor-container .ql-container {
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        .email-editor-container .ql-editor {
          min-height: 400px;
        }
        .email-editor-container .ql-toolbar {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
      `}</style>
    </div>
  );
}
