import { useState } from "react";
import { addQuestion } from "../api/auth";

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  backgroundColor: "#fff",
  color: "#000",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
};

const Admin = () => {
  const [form, setForm] = useState({
    rating: "",
    tags: "",
    theme: "",
    statement: "",
    options: "",
    preTest: "",
    expectedOutput: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      rating: Number(form.rating),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      theme: form.theme,
      statement: form.statement,
      options: form.options
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean),
      preTest: form.preTest,
      expectedOutput: form.expectedOutput,
    };

    try {
      await addQuestion(payload);
      alert("Question added successfully ✅");
      setForm({
        rating: "",
        tags: "",
        theme: "",
        statement: "",
        options: "",
        preTest: "",
        expectedOutput: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add question");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Add Question (Admin)</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="theme"
          placeholder="Theme"
          value={form.theme}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="statement"
          placeholder="Question statement"
          value={form.statement}
          onChange={handleChange}
          required
          style={{ ...inputStyle, minHeight: "100px" }}
        />

        <textarea
          name="options"
          placeholder="Options (one per line)"
          value={form.options}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "80px" }}
        />

        <textarea
          name="preTest"
          placeholder="Pre-test code (optional)"
          value={form.preTest}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "80px" }}
        />

        <textarea
          name="expectedOutput"
          placeholder="Expected output"
          value={form.expectedOutput}
          onChange={handleChange}
          required
          style={{ ...inputStyle, minHeight: "80px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default Admin;
