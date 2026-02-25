import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../configs/api';

import PersonalInfoForm from '../components/PersonalInfoForm';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ResumePreview from '../components/ResumePreview';

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector(state => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    personal_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3883F6',
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: 'personal', name: 'Personal Info' },
    { id: 'summary', name: 'Summary' },
    { id: 'experience', name: 'Experience' },
    { id: 'education', name: 'Education' },
    { id: 'projects', name: 'Projects' },
    { id: 'skills', name: 'Skills' },
  ];

  const activeSection = sections[activeSectionIndex];

// const loadExistingResume = async () => {
//   try {
//     console.log('🔄 Loading resume...');
//     const { data } = await api.get('/api/resumes/get/' + resumeId, {
//       headers: { Authorization: token },
//     });

//     console.log('🔍 RAW API RESPONSE in loadExistingResume:', data);

//     if (data.resume) {
//       const resume = data.resume;
      
//       console.log('📥 Resume personal_info from API:', resume.personal_info);
//       console.log('📥 Resume professional_info from API:', resume.professional_info);
      
//       // FIX: Use professional_info if it exists, otherwise use personal_info
//       const personalInfo = resume.professional_info || resume.personal_info || {};
      
//       setResumeData(prev => ({
//         ...prev,
//         ...resume,
//         personal_info: personalInfo, // Use the correct data source
//         professional_summary: resume.professional_summary || "",
//         experience: resume.experience || [],
//         education: resume.education || [],
//         project: resume.project || [],
//         skills: resume.skills || [],
//       }));

//       document.title = resume.title;
//       console.log('✅ Resume data set in state with personal_info:', personalInfo);
//     }
//   } catch (error) {
//     console.log('❌ Error loading resume:', error.message);
//     toast.error('Failed to load resume');
//   }
// };
const loadExistingResume = async () => {
  try {
    console.log('🔄 Loading resume...');
    const { data } = await api.get('/api/resumes/get/' + resumeId, {
      headers: { Authorization: token },
    });

    console.log('🔍 RAW API RESPONSE in loadExistingResume:', data);

    if (data.resume) {
      const resume = data.resume;
      
      console.log('📥 Resume personal_info from API:', resume.personal_info);
      console.log('📥 Resume professional_info from API:', resume.professional_info);
      
      // 🚨 CRITICAL FIX: Use personal_info (the one with real data), NOT professional_info
      const personalInfo = resume.personal_info; // This has the real data!
      
      console.log('✅ Using this personal_info data:', personalInfo);
      
      setResumeData(prev => ({
        ...prev,
        ...resume,
        personal_info: personalInfo, // Use the REAL personal_info data
        professional_summary: resume.professional_summary || "",
        experience: resume.experience || [],
        education: resume.education || [],
        project: resume.project || [],
        skills: resume.skills || [],
      }));

      document.title = resume.title;
      console.log('✅ Resume data set in state with CORRECT personal_info:', personalInfo);
    }
  } catch (error) {
    console.log('❌ Error loading resume:', error.message);
    toast.error('Failed to load resume');
  }
};


  useEffect(() => {
    if (resumeId) loadExistingResume();
  }, [resumeId]);

    useEffect(() => {
    console.log('Resume Data:', resumeData);
    console.log('Personal Info:', resumeData.personal_info);
  }, [resumeData]);



// const saveResume = async () => {
//   try {
    
//     const updatedResumeData = structuredClone(resumeData);
    
//     // FIX: Ensure both personal_info and professional_info are in sync
//     updatedResumeData.professional_info = updatedResumeData.personal_info;
    
//     const formData = new FormData();
//     formData.append('resumeId', resumeId);
//     formData.append('resumeData', JSON.stringify(updatedResumeData));

//     if (removeBackground) formData.append('removeBackground', 'yes');
//     if (resumeData.personal_info?.image instanceof File) {
//       formData.append('image', resumeData.personal_info.image);
//     }

//     const { data } = await api.put('/api/resumes/update', formData, {
//       headers: { Authorization: token },
//     });

//     console.log('✅ Save response:', data);
//     setResumeData(data.resume);
//     toast.success(data.message);
//   } catch (error) {
//     console.error('❌ Error saving resume', error);
//     toast.error('Failed to save resume');
//   }
// };

// const saveResume = async () => {
//   try {
//     console.log('💾 Saving resume...');
    
//     const updatedResumeData = structuredClone(resumeData);
    
//     // 🚨 Remove professional_info completely
//     if (updatedResumeData.professional_info) {
//       console.log('🧹 Removing professional_info from data');
//       delete updatedResumeData.professional_info;
//     }
    
//     const formData = new FormData();
//     formData.append('resumeId', resumeId);
//     formData.append('resumeData', JSON.stringify(updatedResumeData));

//     if (removeBackground) formData.append('removeBackground', 'yes');
//     if (resumeData.personal_info?.image instanceof File) {
//       formData.append('image', resumeData.personal_info.image);
//     }

//     console.log('📦 Sending data to backend:', updatedResumeData);

//     const { data } = await api.put('/api/resumes/update', formData, {
//       headers: { Authorization: token },
//     });

//     console.log('✅ Save response:', data);
//     setResumeData(data.resume);
//     toast.success(data.message);
//   } catch (error) {
//     console.error('❌ Error saving resume', error);
//     toast.error('Failed to save resume');
//   }
// };


// const saveResume = async () => {
//   try {
//     console.log('💾 Saving resume...');
    
//     const updatedResumeData = structuredClone(resumeData);
    
//     // Remove professional_info completely
//     if (updatedResumeData.professional_info) {
//       console.log('🧹 Removing professional_info from data');
//       delete updatedResumeData.professional_info;
//     }
    
//     const formData = new FormData();
//     formData.append('resumeId', resumeId);
//     formData.append('resumeData', JSON.stringify(updatedResumeData));

//     if (removeBackground) formData.append('removeBackground', 'yes');
    
//     // FIX: Check if image exists and is a File object
//     if (resumeData.personal_info?.image) {
//       if (resumeData.personal_info.image instanceof File) {
//         formData.append('image', resumeData.personal_info.image);
//         console.log('📁 Image file appended to FormData');
//       } else if (typeof resumeData.personal_info.image === 'string') {
//         console.log('🔗 Image is already a URL, not uploading again');
//         // Image is already a URL, no need to upload again
//       }
//     }

//     console.log('📦 Sending data to backend...');

//     const { data } = await api.put('/api/resumes/update', formData, {
//       headers: { 
//         Authorization: token,
//         // FIX: Remove Content-Type header for FormData (let browser set it automatically)
//       },
//     });

//     console.log('✅ Save response:', data);
    
//     // FIX: Update the resume data with the response from server
//     if (data.resume) {
//       setResumeData(prev => ({
//         ...prev,
//         ...data.resume,
//         // Ensure personal_info is properly merged
//         personal_info: {
//           ...prev.personal_info,
//           ...data.resume.personal_info
//         }
//       }));
//     }
    
//     toast.success(data.message || 'Resume saved successfully!');
//   } catch (error) {
//     console.error('❌ Error saving resume', error);
//     console.error('Error response:', error.response?.data);
//     toast.error(error.response?.data?.message || 'Failed to save resume');
//   }
// };
const saveResume = async () => {
  try {
    console.log('💾 ========== SAVE RESUME START ==========');
    
    // Check what's in personal_info
    console.log('📋 Current resumeData.personal_info:', resumeData.personal_info);
    
    if (resumeData.personal_info?.image) {
      console.log('🖼️ Image property exists:', {
        type: typeof resumeData.personal_info.image,
        constructor: resumeData.personal_info.image.constructor?.name,
        isFile: resumeData.personal_info.image instanceof File,
        value: resumeData.personal_info.image
      });
      
      if (resumeData.personal_info.image instanceof File) {
        console.log('✅ Valid File object found:', {
          name: resumeData.personal_info.image.name,
          type: resumeData.personal_info.image.type,
          size: resumeData.personal_info.image.size
        });
      }
    } else {
      console.log('❌ No image found in personal_info');
      console.log('🔍 Available keys in personal_info:', resumeData.personal_info ? Object.keys(resumeData.personal_info) : 'none');
    }
    
    const updatedResumeData = structuredClone(resumeData);
    
    // Remove professional_info
    if (updatedResumeData.professional_info) {
      delete updatedResumeData.professional_info;
    }
    
    const formData = new FormData();
    formData.append('resumeId', resumeId);
    formData.append('resumeData', JSON.stringify(updatedResumeData));

    if (removeBackground) {
      formData.append('removeBackground', 'yes');
    }
    
    // Check if we have a new image to upload
    if (resumeData.personal_info?.image instanceof File) {
      console.log('📁 Appending image file to FormData...');
      formData.append('image', resumeData.personal_info.image);
      
      // Verify FormData was appended correctly
      console.log('🔍 FormData entries:');
      let hasImage = false;
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`   ✅ ${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
          hasImage = true;
        } else {
          console.log(`   📝 ${key}: ${value.toString().substring(0, 50)}...`);
        }
      }
      
      if (!hasImage) {
        console.log('❌ Image was not found in FormData entries!');
      }
    } else {
      console.log('📷 No new image file to upload');
    }

    console.log('🚀 Sending request to backend...');
    
    const { data } = await api.put('/api/resumes/update', formData, {
      headers: { 
        Authorization: token,
        // Let browser set Content-Type automatically for FormData
      },
    });

    console.log('✅ Save successful!');
    console.log('========== SAVE RESUME END ==========');
    
    // Update state
    if (data.resume) {
      setResumeData(prev => ({
        ...prev,
        ...data.resume,
        personal_info: {
          ...prev.personal_info,
          ...data.resume.personal_info
        }
      }));
    }
    
    toast.success('Resume saved successfully!');
  } catch (error) {
    console.error('❌ Save error:', error);
    console.error('Error response:', error.response?.data);
    toast.error(error.response?.data?.message || 'Failed to save resume');
  }
};

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append(
        'resumeData',
        JSON.stringify({ public: !resumeData.public })
      );

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });

      setResumeData({...resumeData, public: !resumeData.public});
      toast.success(data.message);
    } catch (error) {
      console.error('Error updating visibility', error);
      toast.error('Failed to update visibility');
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' });
    } else {
      navigator.clipboard.writeText(resumeUrl);
      toast.success('Resume URL copied to clipboard');
    }
  };

  const downloadResume = () => window.print();


 
  return (
    <div>
      <div className="max-w-7xl mx-auto py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Progress Bar */}
              <div className="relative mb-6">
                <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
                <hr
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-700"
                  style={{
                    width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                  }}
                />
              </div>

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={template =>
                      setResumeData(prev => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={color =>
                      setResumeData(prev => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex(prevIndex => Math.max(prevIndex - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  {activeSectionIndex !== sections.length - 1 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex(prev =>
                          Math.min(prev + 1, sections.length - 1)
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      Next <ChevronRight className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-6">
                {/* // In ResumeBuilder component, update the personal info section: */}
{activeSection.id === 'personal' && (
  <PersonalInfoForm
    data={resumeData.personal_info || {}}
    onChange={(updatedPersonalInfo) => {
      setResumeData(prev => ({
        ...prev,
        personal_info: updatedPersonalInfo
      }));
    }}
    removeBackground={removeBackground}
    setRemoveBackground={setRemoveBackground}
  />
)}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, professional_summary: data }))
                    }
                  />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, experience: data }))
                    }
                  />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, education: data }))
                    }
                  />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, project: data }))
                    }
                  />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>

              <button
                onClick={() => toast.promise(saveResume(), { loading: 'Saving...' })}
                className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 hover:ring transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>

            

            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
              {resumeData.public && (
                <button
                  onClick={handleShare}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                >
                  <Share2Icon className="size-4" /> Share
                </button>
              )}
              <button
                onClick={changeResumeVisibility}
                className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-300 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors"
              >
                {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                {resumeData.public ? 'Public' : 'Private'}
              </button>

              <button
                onClick={downloadResume}
                className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-300 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
              >
                <DownloadIcon className="size-4" /> Download
              </button>
            </div>
              </div>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
