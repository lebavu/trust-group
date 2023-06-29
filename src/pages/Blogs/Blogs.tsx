import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

const BlogTable = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const queryClient = useQueryClient();

  // Lấy danh sách blog
  const { isLoading, data: blogs } = useQuery("blogs", () =>
    axios.get("/api/blogs").then((res) => res.data)
  );

  // Thêm mới blog
  const addBlogMutation = useMutation((newBlog) =>
    axios.post("/api/blogs", newBlog)
  );

  // Cập nhật blog
  const updateBlogMutation = useMutation((updatedBlog) =>
    axios.put(`/api/blogs/${updatedBlog.id}`, updatedBlog)
  );

  // Xoá blog
  const deleteBlogMutation = useMutation((blogId) =>
    axios.delete(`/api/blogs/${blogId}`)
  );

  // Hiển thị pop-up thêm mới/cập nhật
  const openPopup = (blog = null) => {
    setCurrentBlog(blog);
    setPopupOpen(true);
  };

  // Đóng pop-up
  const closePopup = () => {
    setCurrentBlog(null);
    setPopupOpen(false);
  };

  // Xử lý submit biểu mẫu thêm mới/cập nhật
  const handleFormSubmit = (data) => {
    if (currentBlog) {
      // Cập nhật blog
      updateBlogMutation.mutate({ ...currentBlog, ...data });
    } else {
      // Thêm mới blog
      addBlogMutation.mutate(data);
    }
    closePopup();
  };

  // Xoá blog
  const deleteBlog = (blogId) => {
    deleteBlogMutation.mutate(blogId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => openPopup()}>Add New Blog</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.name}</td>
              <td>{blog.description}</td>
              <td>{blog.image}</td>
              <td>
                <button onClick={() => openPopup(blog)}>Edit</button>
                <button onClick={() => deleteBlog(blog.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupOpen && (
        <BlogForm
          blog={currentBlog}
          onSubmit={handleFormSubmit}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default BlogTable;
