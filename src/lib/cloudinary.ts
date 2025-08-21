// Client-side only Cloudinary upload functions
// No server-side dependencies to avoid build errors

// Helper function to upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dom_properties');
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');

    fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error('Upload failed - no URL returned'));
        }
      })
      .catch((error) => {
        console.error('Error uploading to Cloudinary:', error);
        reject(error);
      });
  });
};

// Helper function to upload multiple images
export const uploadMultipleImagesToCloudinary = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImageToCloudinary(file));
  return Promise.all(uploadPromises);
}; 