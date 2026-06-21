'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Heart, Film, TrendingUp, Loader2 } from 'lucide-react';
import { ScrollExpandMedia } from '@/components/scroll-expand-media';
import { Features, type Feature } from '@/components/features';
import { MovieCard, type Movie } from '@/components/movie-card';
import { MovieDetailDialog } from '@/components/movie-detail-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const BASE_URL = 'https://api.tmdb.org/3';

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'favorites'>('browse');

  // Pagination states
  const [browsePage, setBrowsePage] = useState(1);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [totalBrowsePages, setTotalBrowsePages] = useState(1);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('movieFavorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Verify format is Movie[] (has ID and details) and filter accordingly
          const formatted = parsed.filter((item) => item && typeof item === 'object' && 'id' in item);
          setFavorites(formatted);
        }
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchMovies = useCallback(async (p: number, query?: string) => {
    setLoading(true);
    setError('');
    try {
      const startIdx = (p - 1) * 12;
      const endIdx = p * 12 - 1;
      const tmdbPage1 = Math.floor(startIdx / 20) + 1;
      const tmdbPage2 = Math.floor(endIdx / 20) + 1;

      let results: Movie[] = [];
      let totalResults = 0;

      if (tmdbPage1 === tmdbPage2) {
        const url = query
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${tmdbPage1}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${tmdbPage1}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        results = data.results || [];
        totalResults = data.total_results || 0;
      } else {
        const url1 = query
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${tmdbPage1}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${tmdbPage1}`;
        const url2 = query
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${tmdbPage2}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${tmdbPage2}`;

        const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]);
        if (!res1.ok || !res2.ok) throw new Error('API Error');
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        const results1 = data1.results || [];
        const results2 = data2.results || [];
        results = [...results1, ...results2];
        totalResults = data1.total_results || 0;
      }

      // Slice the combined results to get exactly 12 results for our page
      const sliceStart = startIdx % 20;
      const slicedMovies = results.slice(sliceStart, sliceStart + 12);

      setMovies(slicedMovies);
      setTotalBrowsePages(Math.max(1, Math.ceil(totalResults / 12)));
    } catch {
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset page when search query changes
  useEffect(() => {
    setBrowsePage(1);
  }, [searchQuery]);

  // Debounced search / page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(browsePage, searchQuery);
    }, searchQuery.trim() ? 500 : 0);

    return () => clearTimeout(timer);
  }, [searchQuery, browsePage, fetchMovies]);

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const totalFavoritesPages = Math.ceil(favorites.length / 12);

  // Clamp favoritesPage if it exceeds the maximum page count after a removal
  useEffect(() => {
    const maxPage = Math.max(1, totalFavoritesPages);
    if (favoritesPage > maxPage) {
      setFavoritesPage(maxPage);
    }
  }, [favorites.length, favoritesPage, totalFavoritesPages]);

  const displayMovies =
    activeTab === 'favorites'
      ? favorites.slice((favoritesPage - 1) * 12, favoritesPage * 12)
      : movies;

  const features: Feature[] = [
    {
      id: 1,
      icon: Film,
      title: 'Browse Movies',
      description:
        'Explore thousands of movies with beautiful posters, ratings, and release dates.',
      image:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
    },
    {
      id: 2,
      icon: Search,
      title: 'Live Search',
      description:
        'Find any movie instantly with our real-time search feature.',
      image:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop',
    },
    {
      id: 3,
      icon: Heart,
      title: 'Save Favorites',
      description:
        'Keep track of your favorite movies with persistent local storage.',
      image:
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=400&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Scroll-to-Expand */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280&h=720&fit=crop"
        bgImageSrc="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop"
        title="Movie Discovery"
        date="2024"
        scrollToExpand="Scroll to explore"
        textBlend
      >
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto mb-8 flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 shadow-xl border border-white/10 transition-all focus-within:ring-2 focus-within:ring-white/30">
              <input
                id="movie-search"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-6 pr-4 py-3 text-white placeholder:text-zinc-400 text-lg border-none outline-none focus:ring-0 focus:outline-none"
              />
              <button
                type="button"
                className="flex items-center justify-center bg-white hover:bg-white/90 text-black rounded-full p-3.5 transition-colors focus:outline-none mr-1 active:scale-95"
                onClick={() => {
                  fetchMovies(1, searchQuery);
                }}
              >
                <Search size={20} />
              </button>
            </div>

            {/* Browse / Favorites Tabs */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                id="tab-browse"
                variant={activeTab === 'browse' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab('browse');
                  setBrowsePage(1);
                }}
                className="gap-2"
              >
                <TrendingUp size={18} />
                Browse
              </Button>
              <Button
                id="tab-favorites"
                variant={activeTab === 'favorites' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab('favorites');
                  setFavoritesPage(1);
                }}
                className="gap-2"
              >
                <Heart size={18} />
                Favorites ({favorites.length})
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-destructive text-lg">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && displayMovies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {activeTab === 'favorites'
                  ? 'No favorites yet. Start adding some!'
                  : 'No movies found.'}
              </p>
            </div>
          )}

          {/* Movie Grid */}
          {!loading && !error && displayMovies.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={favorites.some((m) => m.id === movie.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-12 py-4">
                <Button
                  id="btn-prev"
                  variant="outline"
                  onClick={() => {
                    if (activeTab === 'browse') {
                      setBrowsePage((prev) => Math.max(1, prev - 1));
                    } else {
                      setFavoritesPage((prev) => Math.max(1, prev - 1));
                    }
                  }}
                  disabled={activeTab === 'browse' ? browsePage === 1 : favoritesPage === 1}
                >
                  Previous
                </Button>

                <span className="text-sm font-medium text-muted-foreground">
                  Page {activeTab === 'browse' ? browsePage : favoritesPage} of{' '}
                  {activeTab === 'browse' ? totalBrowsePages : Math.max(1, totalFavoritesPages)}
                </span>

                <Button
                  id="btn-next"
                  variant="outline"
                  onClick={() => {
                    if (activeTab === 'browse') {
                      setBrowsePage((prev) => Math.min(totalBrowsePages, prev + 1));
                    } else {
                      setFavoritesPage((prev) => Math.min(totalFavoritesPages, prev + 1));
                    }
                  }}
                  disabled={
                    activeTab === 'browse'
                      ? browsePage === totalBrowsePages || totalBrowsePages === 0
                      : favoritesPage === totalFavoritesPages || totalFavoritesPages === 0
                  }
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </ScrollExpandMedia>

      {/* Features Showcase */}
      <Features features={features} />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Start Discovering Today</h3>
          <p className="text-muted-foreground mb-6">
            Explore thousands of movies, save your favorites, and never miss a
            great film.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              id="footer-browse"
              size="lg"
              className="gap-2"
              onClick={() => {
                setActiveTab('browse');
                setBrowsePage(1);
                const el = document.getElementById('movie-search');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Film size={20} />
              Browse Movies
            </Button>
            <Button
              id="footer-favorites"
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => {
                setActiveTab('favorites');
                setFavoritesPage(1);
                const el = document.getElementById('movie-search');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Heart size={20} />
              View Favorites
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mt-8">
            Built for Jeevan — Srikar
          </p>
        </div>
      </footer>

      {/* Movie Detail Dialog */}
      <MovieDetailDialog
        movie={selectedMovie}
        open={!!selectedMovie}
        onOpenChange={(open) => {
          if (!open) setSelectedMovie(null);
        }}
        isFavorite={selectedMovie ? favorites.some((m) => m.id === selectedMovie.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
