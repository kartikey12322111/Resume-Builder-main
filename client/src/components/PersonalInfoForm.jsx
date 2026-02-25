import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const PersonalInfoForm = ({ data = {}, onChange, removeBackground, setRemoveBackground }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    linkedin: "",
    website: "",
    image: null
  });

  // Sync props to local state whenever data changes
  // useEffect(() => {
  //   if (data && Object.keys(data).length > 0) {
  //     setFormData(prev => ({ 
  //       ...prev, 
  //       ...data 
  //     }));
  //   }
  // }, [data]);
  //  useEffect(() => {
  //   console.log('Personal Info Form Data:', formData);
  // }, [formData])

  // const handleChange = (field, value) => {
  //   const updatedData = { ...formData, [field]: value };
  //   setFormData(updatedData);
  //   onChange(updatedData); // Send updated data to parent
  // };
   useEffect(() => {
    console.log('📥 PersonalInfoForm received data:', data); // Debug log
    
    if (data && Object.keys(data).length > 0) {
      // Filter out empty strings and only update with actual values
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== "" && value !== null)
      );
      
      setFormData(prev => ({ 
        ...prev, 
        ...filteredData 
      }));
    }
  }, [data]);

  const handleChange = (field, value) => {
    console.log(`✏️ Field ${field} changed to:`, value); // Debug log
    
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const updatedData = { ...formData, image: file };
  //     setFormData(updatedData);
  //     onChange(updatedData);
  //   }
  // };
  // In PersonalInfoForm component
// const handleImageChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     // Check if file is an image
//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select a valid image file');
//       return;
//     }
    
//     // Check file size (e.g., 5MB limit)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image size should be less than 5MB');
//       return;
//     }
    
//     const updatedPersonalInfo = {
//       ...data,
//       image: file // Store the File object directly
//     };
    
//     onChange(updatedPersonalInfo);
    
//     // Create preview URL for immediate display
//     const previewUrl = URL.createObjectURL(file);
//     // You might want to store this preview URL separately for display
//   }
// };

// In PersonalInfoForm.jsx - make sure the image is being set as a File object
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log('🖼️ ========== IMAGE SELECTED ==========');
    console.log('File details:', {
      name: file.name,
      type: file.type, 
      size: file.size,
      isFile: file instanceof File,
      constructor: file.constructor.name
    });
    
    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Create the updated personal info
    const updatedPersonalInfo = {
      ...data,
      image: file // This MUST be the File object
    };
    
    console.log('🔄 Calling onChange with updated personal info');
    console.log('Updated personal_info:', updatedPersonalInfo);
    
    onChange(updatedPersonalInfo);
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    console.log('👀 Preview URL created');
    console.log('========== IMAGE SELECTED END ==========');
  }
};
  const fields = [
    { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
    { key: "email", label: "Email Address", icon: Mail, type: "text", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text" },
    { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
    { key: "website", label: "Personal website", icon: Globe, type: "url" },
  ];

  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
      <p className='text-sm text-gray-600'>Get started with the personal information</p>

      <div className='flex items-center gap-2'>
        <label className='flex items-center gap-2'>
          {formData?.image ? (
            <img
              src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
              alt="user-image"
              className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80'
            />
          ) : (
            <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
              <User className='size-10 p-2.5 border rounded-full' />
              Upload user image
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className='hidden'
            onChange={handleImageChange}
          />
        </label>

        {typeof formData.image === 'object' && (
          <div className='flex flex-col gap-1 pl-4 text-sm'>
            <p>Remove Background</p>
            <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
              <input
                type="checkbox"
                className='sr-only peer'
                onChange={() => setRemoveBackground(prev => !prev)}
                checked={removeBackground}
              />
              <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'></div>
              <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
            </label>
          </div>
        )}
      </div>
      
      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className='space-y-1 mt-5'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
              <Icon className="size-4" />
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </label>
            <input
              type={field.type}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoForm;