
import React from 'react';
import type { Article } from '../types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
    articles: Article[];
    onEdit: (article: Article) => void;
    onDelete: (id: string) => void;
    onView: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onEdit, onDelete, onView }) => {
    if (articles.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl text-gray-400">No articles found.</h2>
                <p className="text-gray-500 mt-2">Click "Create New Post" to get started!</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
                <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onEdit={onEdit} 
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </div>
    );
};

export default ArticleList;
