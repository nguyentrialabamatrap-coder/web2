
import React from 'react';
import type { Article } from '../types';
import { ArrowLeftIcon } from './Icons';

// A simple markdown-to-html renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderContent = () => {
        return content
            .split('\n')
            .map((line, index) => {
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-gray-100">{line.substring(4)}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-8 mb-3 text-gray-50">{line.substring(3)}</h2>;
                }
                if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-extrabold mt-8 mb-4 text-white">{line.substring(2)}</h1>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-6 list-disc text-gray-300">{line.substring(2)}</li>;
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                // Basic bold/italic support
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
                return <p key={index} className="text-gray-300 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: line }} />;
            });
    };

    return <div className="prose prose-invert max-w-none">{renderContent()}</div>;
};

interface ArticleDetailProps {
    article: Article;
    onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={onBack} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
                <ArrowLeftIcon />
                <span>Back to All Articles</span>
            </button>
            <article>
                <img 
                    src={article.imageUrl || `https://picsum.photos/seed/${article.id}/1200/600`} 
                    alt={article.title} 
                    className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-lg"
                />
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">{article.title}</h1>
                <div className="flex items-center space-x-4 text-gray-400 mb-8">
                    <span>By <span className="font-semibold text-gray-300">{article.author}</span></span>
                    <span>&bull;</span>
                    <span>{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="text-lg text-gray-300 leading-relaxed">
                   <MarkdownRenderer content={article.content} />
                </div>
            </article>
        </div>
    );
};

export default ArticleDetail;
