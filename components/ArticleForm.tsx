
import React, { useState, useEffect } from 'react';
import type { Article } from '../types';
import { generateArticleContent } from '../services/geminiService';
import Spinner from './Spinner';
import { SparklesIcon, ArrowLeftIcon } from './Icons';

interface ArticleFormProps {
    articleToEdit: Article | null;
    onSave: (article: Article) => void;
    onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ articleToEdit, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (articleToEdit) {
            setTitle(articleToEdit.title);
            setContent(articleToEdit.content);
            setAuthor(articleToEdit.author);
            setImageUrl(articleToEdit.imageUrl || '');
        } else {
            setTitle('');
            setContent('');
            setAuthor('');
            setImageUrl('');
        }
    }, [articleToEdit]);

    const handleGenerateContent = async () => {
        if (!title) {
            setError('Please provide a title to generate content.');
            return;
        }
        setError('');
        setIsGenerating(true);
        try {
            const generatedContent = await generateArticleContent(title);
            setContent(generatedContent);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title || !content || !author) {
            setError("Title, content, and author are required.");
            return;
        }

        const savedArticle: Article = {
            id: articleToEdit?.id || new Date().toISOString(),
            title,
            content,
            author,
            imageUrl: imageUrl || `https://picsum.photos/seed/${articleToEdit?.id || new Date().toISOString()}/1200/600`,
            createdAt: articleToEdit?.createdAt || new Date().toISOString(),
        };
        onSave(savedArticle);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-40 flex justify-center items-start p-4 overflow-auto">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8 relative">
              <button onClick={onCancel} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                  <ArrowLeftIcon />
              </button>
              <h2 className="text-2xl font-bold text-white text-center p-6 border-b border-gray-700">
                  {articleToEdit ? 'Edit Article' : 'Create New Article'}
              </h2>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-900 text-white border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Bitcoin Hits New All-Time High"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                            <input
                                id="author"
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full bg-gray-900 text-white border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Satoshi Nakamoto"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Image URL (Optional)</label>
                        <input
                            id="imageUrl"
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-gray-900 text-white border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.png"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content</label>
                            <button
                                type="button"
                                onClick={handleGenerateContent}
                                disabled={isGenerating}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                {isGenerating ? <Spinner size="sm"/> : <SparklesIcon className="w-4 h-4"/>}
                                <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
                            </button>
                        </div>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            className="w-full bg-gray-900 text-white border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write your article here, or generate it with AI..."
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Save Article
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArticleForm;
