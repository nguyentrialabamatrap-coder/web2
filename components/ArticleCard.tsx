
import React from 'react';
import type { Article } from '../types';
import { EditIcon, TrashIcon } from './Icons';

interface ArticleCardProps {
    article: Article;
    onEdit: (article: Article) => void;
    onDelete: (id: string) => void;
    onView: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onEdit, onDelete, onView }) => {
    const snippet = article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '');

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:transform hover:-translate-y-2">
            <img 
                src={article.imageUrl || `https://picsum.photos/seed/${article.id}/400/200`} 
                alt={article.title} 
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => onView(article)}
            />
            <div className="p-6 flex-grow flex flex-col">
                <h3 
                    className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-blue-400"
                    onClick={() => onView(article)}
                >
                    {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{snippet}</p>
                <div className="flex justify-between items-center mt-auto">
                    <div>
                        <p className="text-gray-300 text-sm font-semibold">{article.author}</p>
                        <p className="text-gray-500 text-xs">{new Date(article.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={() => onEdit(article)} className="text-gray-400 hover:text-blue-400 transition-colors">
                            <EditIcon />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm('Are you sure you want to delete this article?')) {
                                    onDelete(article.id)
                                }
                            }} 
                            className="text-gray-400 hover:text-red-500 transition-colors">
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
