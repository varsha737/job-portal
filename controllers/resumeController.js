import fs from 'fs';
import util from 'util';

// Helper function to parse PDF files
const parsePDF = async (filePath) => {
  try {
    const pdf = await import('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf.default(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
};

// Helper function to parse DOCX files
const parseDOCX = async (filePath) => {
  try {
    const docxParser = await import('docx-parser');
    const readFile = util.promisify(docxParser.parseDocx);
    const content = await readFile(filePath);
    return content;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
};

// Upload and parse resume
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();
    let text;

    // Parse file based on extension
    if (fileExt === 'pdf') {
      text = await parsePDF(filePath);
    } else if (fileExt === 'docx') {
      text = await parseDOCX(filePath);
    } else if (fileExt === 'doc') {
      return res.status(400).json({ message: 'DOC format is not supported. Please convert to DOCX or PDF.' });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Resume uploaded and parsed successfully',
      content: text
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Create resume from form data
export const generateResume = async (req, res, next) => {
  try {
    const { fullName, email, phone, education, experience, skills } = req.body;

    // Validate required fields
    if (!fullName || !email || !experience || !skills) {
      return res.status(400).json({ message: 'Please provide all required information' });
    }

    // Create a simple formatted resume
    const resumeContent = `
RESUME

Personal Information
------------------
Name: ${fullName}
Email: ${email}
Phone: ${phone}

Education
---------
${education}

Professional Experience
---------------------
${experience}

Skills
------
${skills}
    `;

    res.status(200).json({
      message: 'Resume generated successfully',
      resume: resumeContent
    });

  } catch (error) {
    next(error);
  }
}; 