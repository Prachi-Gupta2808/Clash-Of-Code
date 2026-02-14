import { useState } from "react";
import { addQuestion } from "../api/auth";

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  backgroundColor: "#18181b",
  color: "#e4e4e7",
  border: "1px solid #27272a",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  fontFamily: "monospace",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  fontSize: "0.9rem",
  color: "#a1a1aa",
};

const sectionHeaderStyle = {
  marginTop: "24px",
  marginBottom: "16px",
  paddingBottom: "8px",
  borderBottom: "1px solid #3f3f46",
  color: "#fff",
  fontSize: "1.1rem",
  fontWeight: "bold",
};

const Admin = () => {
  const [form, setForm] = useState({
    title: "",
    rating: "",
    tags: "",
    theme: "",
    timeLimit: 1.0,   // Default 1s
    memoryLimit: 256, // Default 256MB
    statement: "",
    inputFormat: "",
    outputFormat: "",
    contraints: "",
    options: "",
    preTest: "",
    preTestOutput: "",
    actualTest: "",
    actualTestOutput: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      rating: Number(form.rating),
      timeLimit: Number(form.timeLimit),
      memoryLimit: Number(form.memoryLimit),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      options: form.options
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean),
    };

    try {
      await addQuestion(payload);
      alert("Question added successfully ✅");
      // Reset form
      setForm({
        title: "",
        rating: "",
        tags: "",
        theme: "",
        timeLimit: 1.0,
        memoryLimit: 256,
        statement: "",
        inputFormat: "",
        outputFormat: "",
        contraints: "",
        options: "",
        preTest: "",
        preTestOutput: "",
        actualTest: "",
        actualTestOutput: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add question");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        color: "#fff",
        backgroundColor: "#0f0f0f",
        padding: "30px",
        borderRadius: "12px",
        border: "1px solid #27272a",
      }}
    >
      <h2 style={{ marginBottom: "10px", fontSize: "1.8rem", textAlign: "center" }}>
        Admin Panel
      </h2>
      <p style={{ textAlign: "center", color: "#71717a", marginBottom: "30px" }}>
        Create a new coding problem
      </p>

      <form onSubmit={handleSubmit}>
        {/* --- Section 1: General Info --- */}
        <div style={sectionHeaderStyle}>1. General Information</div>
        
        <label style={labelStyle}>Problem Title</label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Two Sum"
          value={form.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Row 1: Rating & Theme */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Rating (Difficulty)</label>
            <input
              type="number"
              name="rating"
              placeholder="e.g. 800"
              value={form.rating}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Theme / Category</label>
            <input
              type="text"
              name="theme"
              placeholder="e.g. contest"
              value={form.theme}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Row 2: Time & Memory Limits */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Time Limit (seconds)</label>
            <input
              type="number"
              name="timeLimit"
              placeholder="e.g. 1.0"
              value={form.timeLimit}
              onChange={handleChange}
              step="0.1"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Memory Limit (MB)</label>
            <input
              type="number"
              name="memoryLimit"
              placeholder="e.g. 256"
              value={form.memoryLimit}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <label style={labelStyle}>Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          placeholder="e.g. math, dp, greedy"
          value={form.tags}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* --- Section 2: Problem Details --- */}
        <div style={sectionHeaderStyle}>2. Problem Statement</div>

        <label style={labelStyle}>Description</label>
        <textarea
          name="statement"
          placeholder="Full problem description..."
          value={form.statement}
          onChange={handleChange}
          required
          style={{ ...inputStyle, minHeight: "120px" }}
        />

        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Input Format</label>
            <textarea
              name="inputFormat"
              placeholder="Describe input..."
              value={form.inputFormat}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Output Format</label>
            <textarea
              name="outputFormat"
              placeholder="Describe output..."
              value={form.outputFormat}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
          </div>
        </div>

        <label style={labelStyle}>Constraints</label>
        <textarea
          name="contraints" 
          placeholder="e.g. 1 <= N <= 10^5"
          value={form.contraints}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "60px" }}
        />

        {/* --- Section 3: Test Cases --- */}
        <div style={sectionHeaderStyle}>3. Test Cases</div>
        
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Sample Input (Public)</label>
            <textarea
              name="preTest"
              placeholder="Input shown to user"
              value={form.preTest}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: "100px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Sample Output (Public)</label>
            <textarea
              name="preTestOutput"
              placeholder="Expected output for sample"
              value={form.preTestOutput}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: "100px" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Actual Input (Hidden)</label>
            <textarea
              name="actualTest"
              placeholder="Input for validation"
              value={form.actualTest}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: "100px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Actual Output (Hidden)</label>
            <textarea
              name="actualTestOutput"
              placeholder="Expected output for validation"
              value={form.actualTestOutput}
              onChange={handleChange}
              required
              style={{ ...inputStyle, minHeight: "100px" }}
            />
          </div>
        </div>
        
        {/* --- Section 4: Extras --- */}
        <div style={sectionHeaderStyle}>4. Extras</div>
        <label style={labelStyle}>Options (for MCQs - one per line)</label>
        <textarea
          name="options"
          placeholder="Option A&#10;Option B"
          value={form.options}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "80px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "20px",
            transition: "background 0.2s",
          }}
          className="bg-(--c4) hover:bg-(--c3)"
        >
          Publish Question
        </button>
      </form>
    </div>
  );
};

export default Admin;