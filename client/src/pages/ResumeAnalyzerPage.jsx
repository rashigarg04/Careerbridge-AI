
import { useEffect, useState } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Code,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const fetchResumes = async () => {
    try {
      setFetching(true);

      const response = await api.get("/resumes");
      setResumes(response.data.resumes || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load resumes"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");
    setSuccess("");
    setAnalysis(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file only.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setAnalysis(null);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/resumes/upload", formData);

      setSuccess(response.data.message);
      setAnalysis(response.data.resume);
      setFile(null);

      event.target.reset();

      await fetchResumes();
    } catch (err) {
      setError(
        err.response?.data?.message || "Resume upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/resumes/${id}`);

      setResumes((previous) =>
        previous.filter((resume) => resume._id !== id)
      );

      setSuccess("Resume deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete resume."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Heading */}
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Sparkles size={20} />
            <span className="text-sm font-semibold">
              AI POWERED CAREER TOOL
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Resume Analyzer
          </h1>

          <p className="text-gray-500 mt-2">
            Upload your resume and discover the skills mentioned in it.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
              <UploadCloud size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Upload Your Resume
              </h2>
              <p className="text-sm text-gray-500">
                Upload your resume in PDF format (maximum 5 MB).
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload}>
            <label className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition">
              <UploadCloud
                size={42}
                className="text-indigo-500 mb-3"
              />

              <span className="font-semibold text-gray-700">
                Click to select your resume
              </span>

              <span className="text-sm text-gray-400 mt-2">
                PDF files only · Maximum 5 MB
              </span>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-4 flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <FileText className="text-indigo-600" />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="mt-5 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-7 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Upload & Analyze
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        {/* Latest Analysis */}
        {analysis && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="text-indigo-600" size={24} />

              <h2 className="text-xl font-bold text-gray-900">
                Resume Analysis Results
              </h2>
            </div>

            <div className="bg-indigo-50 rounded-xl p-5 mb-5">
              <p className="text-sm text-indigo-600 font-medium">
                Resume Score
              </p>

              <p className="text-3xl font-bold text-indigo-700 mt-1">
                {analysis.score}/100
              </p>

              <p className="text-xs text-indigo-500 mt-1">
                Detailed scoring will be implemented in the AI analysis stage.
              </p>
            </div>

            <h3 className="font-semibold text-gray-800 mb-3">
              Detected Skills
            </h3>

            {analysis.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No matching skills detected in this resume.
              </p>
            )}

            <p className="text-gray-600 text-sm mt-5">
              {analysis.analysis}
            </p>
          </div>
        )}

        {/* Resume History */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <FileText size={23} className="text-indigo-600" />

            <h2 className="text-xl font-bold text-gray-900">
              My Uploaded Resumes
            </h2>
          </div>

          {fetching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-600" size={30} />
            </div>
          ) : resumes.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <FileText
                size={42}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="font-semibold text-gray-700">
                No resumes uploaded yet
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Upload your first resume to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                        <FileText size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {resume.fileName}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(resume._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                      title="Delete resume"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Code size={16} />
                      {resume.skills?.length || 0} skills detected
                    </span>

                    <span className="text-sm font-semibold text-indigo-600">
                      {resume.score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ResumeAnalyzerPage;
