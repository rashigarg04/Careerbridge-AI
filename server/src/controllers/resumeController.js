
import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import Resume from "../models/Resume.js";

// Basic skill identification
const skillKeywords = [
  "HTML", "CSS", "JavaScript", "React", "Node.js",
  "Express", "MongoDB", "SQL", "Python", "Java",
  "C++", "Git", "GitHub", "Tailwind CSS",
  "TypeScript", "REST API", "AWS", "Docker",
  "Communication", "Leadership", "Problem Solving",
];

const extractSkills = (text) => {
  return skillKeywords.filter((skill) =>
    new RegExp(
      `\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i"
    ).test(text)
  );
};

// Upload and analyze resume
export const uploadResume = async (req, res) => {
  let parser;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const fileBuffer = await fs.readFile(req.file.path);

    parser = new PDFParse({
      data: new Uint8Array(fileBuffer),
    });

    const result = await parser.getText();
    const extractedText = result.text.trim();

    if (!extractedText) {
      await fs.unlink(req.file.path).catch(() => {});

      return res.status(400).json({
        success: false,
        message: "No readable text found in this PDF",
      });
    }

    const skills = extractSkills(extractedText);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      extractedText,
      skills,
      analysis:
        "Resume uploaded and text extracted successfully. Detailed AI feedback will be added in the next stage.",
      score: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      resume: {
        _id: resume._id,
        fileName: resume.fileName,
        skills: resume.skills,
        analysis: resume.analysis,
        score: resume.score,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    console.error("Resume upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process resume",
    });
  } finally {
    if (parser) {
      await parser.destroy().catch((error) => {
        console.error("PDF parser cleanup error:", error.message);
      });
    }
  }
};

// Get logged-in user's resumes
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    })
      .select("-filePath -extractedText")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch resumes",
    });
  }
};

// Delete logged-in user's resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    await fs.unlink(resume.filePath).catch((error) => {
      if (error.code !== "ENOENT") {
        throw error;
      }
    });

    await resume.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete resume",
    });
  }
};
