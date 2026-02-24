import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

// @desc    Enhance professional summary using AI
// @route   POST /api/ai/enhance-pro-sum
// @access  Private
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        
        if (!userContent) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: userContent' 
            });
        }

        console.log("Enhancing professional summary...");
        
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return the enhanced text, no explanations or additional content." 
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
            max_tokens: 200,
            temperature: 0.7
        });

        const enhancedContent = response.choices[0].message.content;
        
        return res.status(200).json({ 
            success: true,
            enhancedContent 
        });

    } catch (error) {
        console.error("Error in enhanceProfessionalSummary:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Enhance job description using AI
// @route   POST /api/ai/enhance-job-desc
// @access  Private
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        
        if (!userContent) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: userContent' 
            });
        }

        console.log("Enhancing job description...");
        
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 2-3 sentences highlighting key responsibilities, achievements, and impact. Use action verbs and quantifiable results where possible. Make it ATS-friendly. Only return the enhanced text, no explanations or additional content." 
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
            max_tokens: 300,
            temperature: 0.7
        });

        const enhancedContent = response.choices[0].message.content;
        
        return res.status(200).json({ 
            success: true,
            enhancedContent 
        });

    } catch (error) {
        console.error("Error in enhanceJobDescription:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Upload and parse resume using AI
// @route   POST /api/ai/upload-resume
// @access  Private
export const uploadResume = async (req, res) => {
    try {
        console.log("📁 Upload request received");
        console.log("Request body:", req.body);
        console.log("User ID:", req.userId);

        const { resumeText, title } = req.body;
        const userId = req.userId;

        // Validate required fields
        if (!resumeText) {
            console.log("❌ Missing resume text");
            return res.status(400).json({ 
                success: false,
                message: 'Missing resume text' 
            });
        }

        if (!title) {
            console.log("❌ Missing title");
            return res.status(400).json({ 
                success: false,
                message: 'Missing title' 
            });
        }

        if (!userId) {
            console.log("❌ Missing user ID");
            return res.status(401).json({ 
                success: false,
                message: 'User not authenticated' 
            });
        }

        console.log(`✅ Processing resume: "${title}" for user: ${userId}`);
        console.log(`📄 Resume text length: ${resumeText.length} characters`);

        // Check if OpenAI is configured
        const isAIConfigured = process.env.OPENAI_API_KEY && 
                              process.env.OPENAI_API_KEY.startsWith('sk-') &&
                              process.env.OPENAI_API_KEY.length > 20;

        if (!isAIConfigured) {
            console.warn("⚠️ OpenAI API key not configured properly. Using mock data.");
            
            // Create resume with mock data
            const mockResumeData = {
                userId,
                title,
                professional_summary: "Professional with demonstrated experience and skills.",
                skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
                personal_info: {
                    full_name: "Extracted from resume",
                    email: "email@example.com",
                    phone: "+1 234 567 8900",
                    location: "City, Country",
                    profession: "Software Developer",
                    linkedin: "linkedin.com/in/profile",
                    website: "portfolio.com",
                    image: ""
                },
                experience: [
                    {
                        company: "Previous Company",
                        position: "Software Developer",
                        start_date: "Jan 2020",
                        end_date: "Present",
                        description: "Worked on various projects using modern technologies.",
                        is_current: true
                    }
                ],
                project: [
                    {
                        name: "Project Name",
                        type: "Web Application",
                        description: "Description of the project and technologies used."
                    }
                ],
                education: [
                    {
                        institution: "University Name",
                        degree: "Bachelor's Degree",
                        field: "Computer Science",
                        graduation_date: "2020",
                        gpa: "3.5"
                    }
                ]
            };

            const newResume = await Resume.create(mockResumeData);
            console.log("✅ Mock resume created with ID:", newResume._id);

            return res.status(200).json({ 
                success: true,
                resumeId: newResume._id,
                message: "Resume created with mock data (AI not configured)"
            });
        }

        // Prepare AI prompt for resume parsing
        const systemPrompt = `You are an expert AI assistant specialized in parsing resumes. 
        Extract structured information from the provided resume text. 
        Return ONLY a valid JSON object with no additional text, comments, or markdown formatting.
        The JSON must match this exact structure:
        {
            "professional_summary": "string",
            "skills": ["string"],
            "personal_info": {
                "full_name": "string",
                "profession": "string",
                "email": "string",
                "phone": "string",
                "location": "string",
                "linkedin": "string",
                "website": "string",
                "image": ""
            },
            "experience": [
                {
                    "company": "string",
                    "position": "string",
                    "start_date": "string",
                    "end_date": "string",
                    "description": "string",
                    "is_current": false
                }
            ],
            "project": [
                {
                    "name": "string",
                    "type": "string",
                    "description": "string"
                }
            ],
            "education": [
                {
                    "institution": "string",
                    "degree": "string",
                    "field": "string",
                    "graduation_date": "string",
                    "gpa": "string"
                }
            ]
        }`;

        const userPrompt = `Extract data from this resume and return JSON:\n\n${resumeText.substring(0, 3000)}`;

        console.log("🤖 Calling OpenAI API for resume parsing...");

        // Call OpenAI API
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            max_tokens: 2000,
            temperature: 0.3,
        });

        console.log("✅ OpenAI response received");

        // Extract and parse JSON from response
        let extractedData = response.choices[0].message.content;
        
        // Clean up the response - remove markdown code blocks if present
        extractedData = extractedData.replace(/```json\s*/g, '');
        extractedData = extractedData.replace(/```\s*/g, '');
        extractedData = extractedData.trim();

        console.log("📊 Extracted data preview:", extractedData.substring(0, 200) + "...");

        // Parse JSON
        let parsedData;
        try {
            parsedData = JSON.parse(extractedData);
        } catch (parseError) {
            console.error("❌ Failed to parse AI response as JSON:", parseError.message);
            console.error("Raw response:", extractedData);
            
            // Try to extract JSON from the response using regex
            const jsonMatch = extractedData.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    parsedData = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    throw new Error("Could not parse AI response as JSON");
                }
            } else {
                throw new Error("AI response does not contain valid JSON");
            }
        }

        // Validate parsed data has required structure
        const defaultStructure = {
            professional_summary: parsedData.professional_summary || "",
            skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
            personal_info: {
                full_name: parsedData.personal_info?.full_name || "",
                profession: parsedData.personal_info?.profession || "",
                email: parsedData.personal_info?.email || "",
                phone: parsedData.personal_info?.phone || "",
                location: parsedData.personal_info?.location || "",
                linkedin: parsedData.personal_info?.linkedin || "",
                website: parsedData.personal_info?.website || "",
                image: parsedData.personal_info?.image || ""
            },
            experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
            project: Array.isArray(parsedData.project) ? parsedData.project : [],
            education: Array.isArray(parsedData.education) ? parsedData.education : []
        };

        // Create resume in database
        const newResume = await Resume.create({
            userId,
            title,
            ...defaultStructure
        });

        console.log("✅ Resume created successfully with ID:", newResume._id);

        return res.status(200).json({
            success: true,
            resumeId: newResume._id,
            message: "Resume uploaded and parsed successfully"
        });

    } catch (error) {
        console.error("❌ Fatal error in uploadResume:", error);
        
        // Even if AI fails, try to create a basic resume
        try {
            const { resumeText, title } = req.body;
            const userId = req.userId;

            if (title && userId) {
                console.log("⚠️ Creating basic resume as fallback...");
                
                const basicResume = await Resume.create({
                    userId,
                    title,
                    professional_summary: "Resume uploaded successfully. AI parsing failed.",
                    skills: [],
                    personal_info: {},
                    experience: [],
                    project: [],
                    education: []
                });

                return res.status(200).json({
                    success: true,
                    resumeId: basicResume._id,
                    message: "Resume created with basic info (AI parsing failed)",
                    warning: error.message
                });
            }
        } catch (fallbackError) {
            console.error("❌ Even fallback failed:", fallbackError);
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error during resume upload"
        });
    }
};

// @desc    Test AI connection
// @route   GET /api/ai/test
// @access  Private (for testing)
export const testAIConnection = async (req, res) => {
    try {
        console.log("🧪 Testing AI connection...");
        
        const isAIConfigured = process.env.OPENAI_API_KEY && 
                              process.env.OPENAI_API_KEY.startsWith('sk-');

        if (!isAIConfigured) {
            return res.status(200).json({
                success: true,
                message: "AI is in mock mode (no API key configured)",
                mode: "mock",
                apiKeyPresent: !!process.env.OPENAI_API_KEY
            });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say 'AI connection successful' if you receive this message." }
            ],
            max_tokens: 20
        });

        return res.status(200).json({
            success: true,
            message: "AI connection successful",
            mode: "real",
            response: response.choices[0].message.content
        });

    } catch (error) {
        console.error("❌ AI test failed:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            mode: "error"
        });
    }
};