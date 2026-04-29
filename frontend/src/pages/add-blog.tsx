import axios from 'axios';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import navigateBackBlackIcon from '@/assets/svg/navigate-back-black.svg';
import navigateBackWhiteIcon from '@/assets/svg/navigate-back-white.svg';
import ModalComponent from '@/components/modal';
import CategoryPill from '@/components/category-pill';
import { categories } from '@/utils/category-colors';

type FormData = {
  title: string;
  authorName: string;
  imageLink: string;
  categories: string[];
  description: string;
  isFeaturedPost: boolean;
};

function AddBlog() {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [modal, setmodal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    authorName: '',
    imageLink: '',
    categories: [],
    description: '',
    isFeaturedPost: false,
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsDarkMode(storedTheme === 'dark');
  }, []);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleselector = () => {
    setFormData((prev) => ({
      ...prev,
      imageLink: selectedImage,
    }));
    setmodal(false);
  };

  const isValidCategory = (category: string): boolean => {
    return formData.categories.length >= 3 && !formData.categories.includes(category);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (category: string) => {
    if (isValidCategory(category)) return;

    if (formData.categories.includes(category)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat !== category),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      isFeaturedPost: !prev.isFeaturedPost,
    }));
  };

  const validateFormData = () => {
    if (!formData.title) return toast.error('Title is required'), false;
    if (!formData.authorName) return toast.error('Author is required'), false;
    if (!formData.description) return toast.error('Description is required'), false;
    if (formData.categories.length === 0)
      return toast.error('Select at least 1 category'), false;

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFormData()) return;

    try {
      // ✅ FIXED PAYLOAD
      const payload = {
        title: formData.title,
        content: formData.description,        // mapped correctly
        author: formData.authorName,          // mapped correctly
        image: formData.imageLink,            // optional
        categories: formData.categories,
        featured: formData.isFeaturedPost,    // optional
      };

      const response = await axios.post('/api/posts', payload);

      if (response.status === 200 || response.status === 201) {
        toast.success('Blog post successfully created!');
        navigate('/');
      } else {
        toast.error('Error: ' + response.data.message);
      }
    } catch (err: any) {
      toast.error('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex-grow bg-slate-50 dark:bg-dark py-10">
      {/* HEADER */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4 w-[32rem]">
          <img
            src={isDarkMode ? navigateBackWhiteIcon : navigateBackBlackIcon}
            onClick={() => navigate(-1)}
            className="h-5 w-10 cursor-pointer"
          />
          <h2 className="text-xl font-semibold">Create Blog</h2>
        </div>
      </div>

      {/* FORM */}
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[32rem] bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-4"
        >
          {/* TITLE */}
          <input
            name="title"
            placeholder="Title"
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Content"
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          {/* AUTHOR */}
          <input
            name="authorName"
            placeholder="Author"
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          {/* IMAGE */}
          <button
            type="button"
            onClick={() => setmodal(true)}
            className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
          >
            Select Image
          </button>

          {formData.imageLink && (
            <p className="text-green-600 text-sm">Image Selected ✅</p>
          )}

          {/* CATEGORIES */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span key={index} onClick={() => handleCategoryClick(category)}>
                <CategoryPill
                  category={category}
                  selected={formData.categories.includes(category)}
                  disabled={isValidCategory(category)}
                />
              </span>
            ))}
          </div>

          {/* FEATURED */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" onChange={handleCheckboxChange} />
            <span>Featured Post</span>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Post Blog
          </button>
        </form>

        {/* MODAL */}
        <ModalComponent
          selectedImage={selectedImage}
          handleImageSelect={handleImageSelect}
          handleSelector={handleselector}
          setModal={setmodal}
          modal={modal}
        />
      </div>
    </div>
  );
}

export default AddBlog;

