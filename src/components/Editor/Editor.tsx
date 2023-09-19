import React from "react";
import ReactQuill from "react-quill"; // Import Quill type
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const EditorComponent: React.FC<EditorProps> = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ "font": [] }, { "size": [] }],
      ["bold", "italic", "underline", "strike"],
      [{ "color": [] }, { "background": [] }],
      [{ "list": "ordered" }, { "list": "bullet" }],
      ["blockquote", "code-block"],
      [{ "align": [] }],
      ["link", "image", "video"],
      ["clean"]
    ],
  };
  return (
    <div>
      <ReactQuill
        modules={modules}
        value={value as string}
        onChange={(newValue) => {
          onChange(newValue as string);
        }}
        theme="snow"
      />
    </div>
  );
};

export default EditorComponent;
