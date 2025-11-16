
import React, { useState, useEffect, useCallback } from 'react';
import type { Article, View } from './types';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import ArticleDetail from './components/ArticleDetail';
import { PlusIcon } from './components/Icons';

const sampleArticles: Article[] = [
    {
        id: '1',
        title: 'Bitcoin Surges Past $70,000 in Historic Rally',
        content: `## A New Era for Digital Gold\n\nBitcoin, the world's leading cryptocurrency, has once again shattered expectations by soaring past the **$70,000** mark. This incredible rally has been fueled by a combination of institutional adoption, positive regulatory news, and growing retail interest.\n\n### Key Drivers of the Rally\n\n*   **Institutional Investment:** Major financial institutions are now offering Bitcoin ETFs, making it easier for traditional investors to gain exposure.\n*   **Halving Event:** The recent Bitcoin halving event has reduced the rate of new coin creation, increasing scarcity.\n*   **Global Economic Uncertainty:** Investors are increasingly turning to Bitcoin as a hedge against inflation and geopolitical instability.\n\nAnalysts predict that this is just the beginning, with some forecasting a price target of over $100,000 by the end of the year. The crypto market remains volatile, but the long-term outlook for Bitcoin appears stronger than ever.`,
        author: 'Crypto Analyst',
        createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
        imageUrl: 'https://picsum.photos/seed/1/1200/600',
    },
    {
        id: '2',
        title: 'Ethereum "Dencun" Upgrade Goes Live, Slashing Gas Fees',
        content: `## A Scalability Breakthrough\n\nThe highly anticipated "Dencun" upgrade for the Ethereum network has successfully launched, introducing proto-danksharding (EIP-4844). This upgrade is a game-changer for Ethereum's scalability, significantly reducing transaction fees for Layer 2 rollups.\n\n### What are Blobs?\n\nThe core of the upgrade is the introduction of "blobs," a new way to carry data on the blockchain that is cheaper than traditional calldata. This makes transactions on Layer 2 solutions like Arbitrum and Optimism up to 10x cheaper for users.\n\nThis is a major step towards making Ethereum a more accessible and user-friendly platform for decentralized applications (dApps) and their users.`,
        author: 'Vitalik B.',
        createdAt: new Date('2023-10-25T14:30:00Z').toISOString(),
        imageUrl: 'https://picsum.photos/seed/2/1200/600',
    },
];


const App: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [view, setView] = useState<View>('list');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedArticles = localStorage.getItem('crypto-articles');
            if (storedArticles) {
                setArticles(JSON.parse(storedArticles));
            } else {
                // Load sample articles if local storage is empty
                setArticles(sampleArticles);
                localStorage.setItem('crypto-articles', JSON.stringify(sampleArticles));
            }
        } catch (error) {
            console.error("Failed to load articles from localStorage", error);
            setArticles(sampleArticles);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveArticlesToStorage = (updatedArticles: Article[]) => {
        // sort by date before saving
        const sortedArticles = updatedArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setArticles(sortedArticles);
        localStorage.setItem('crypto-articles', JSON.stringify(sortedArticles));
    };

    const handleCreateNew = () => {
        setSelectedArticle(null);
        setView('form');
    };

    const handleEdit = (article: Article) => {
        setSelectedArticle(article);
        setView('form');
    };


    const handleView = (article: Article) => {
        setSelectedArticle(article);
        setView('detail');
    };

    const handleDelete = (id: string) => {
        const updatedArticles = articles.filter(article => article.id !== id);
        saveArticlesToStorage(updatedArticles);
    };

    const handleSave = (article: Article) => {
        const index = articles.findIndex(a => a.id === article.id);
        let updatedArticles;
        if (index !== -1) {
            updatedArticles = [...articles];
            updatedArticles[index] = article;
        } else {
            updatedArticles = [article, ...articles];
        }
        saveArticlesToStorage(updatedArticles);
        setView('list');
        setSelectedArticle(null);
    };
    
    const handleBackToList = useCallback(() => {
        setView('list');
        setSelectedArticle(null);
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center text-white p-10">Loading articles...</div>;
        }

        switch (view) {
            case 'form':
                return <ArticleForm articleToEdit={selectedArticle} onSave={handleSave} onCancel={handleBackToList} />;
            case 'detail':
                return selectedArticle ? <ArticleDetail article={selectedArticle} onBack={handleBackToList} /> : null;
            case 'list':
            default:
                return (
                    <ArticleList 
                        articles={articles} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <header className="bg-gray-800 shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 
                          className="text-3xl font-bold text-white cursor-pointer"
                          onClick={handleBackToList}
                        >
                          Crypto News <span className="text-blue-400">CMS</span>
                        </h1>
                        {view === 'list' && (
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                <PlusIcon className="w-5 h-5"/>
                                <span>Create New Post</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>

            <footer className="bg-gray-800 mt-12 py-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Crypto News CMS. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
