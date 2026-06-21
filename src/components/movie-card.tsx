'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string | null;
  genre_ids: number[];
}

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onSelect: (movie: Movie) => void;
}

export function MovieCard({ movie, isFavorite, onToggleFavorite, onSelect }: MovieCardProps) {
  // Use poster image for the vertical full card background, fall back to backdrop if needed.
  const imagePath = movie.poster_path || movie.backdrop_path;
  const imageSrc = imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null;
  
  // Format release year
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <div 
        onClick={() => onSelect(movie)}
        className="group relative flex flex-col justify-end aspect-[2/3] w-full bg-gradient-to-b from-[#1b1c18] to-[#11120f] border border-white/10 rounded-[2.2rem] overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-white/5 hover:-translate-y-1 cursor-pointer"
      >
        {/* Full Card Background Image */}
        <div className="absolute inset-0 w-full h-full">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Film size={40} className="text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Heavy bottom-heavy dark gradient overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 z-10" />

        {/* Floating Heart Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all active:scale-95 group/heart"
        >
          <Heart
            size={18}
            className={`transition-colors ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-white/80 group-hover/heart:text-white'
            }`}
          />
        </button>

        {/* Content Section Overlay */}
        <div className="relative z-20 p-6 flex flex-col gap-5">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-2xl font-semibold text-white tracking-tight leading-snug line-clamp-1">
              {movie.title}
            </h3>

            {/* Description / Overview */}
            <p className="text-white/80 text-[0.925rem] font-light leading-relaxed line-clamp-3">
              {movie.overview || 'Explore full movie details, ratings, cast, and overview.'}
            </p>

            {/* Pill Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 text-white/95 text-xs font-normal backdrop-blur-md border border-white/5">
                🏆 {movie.vote_average > 0 ? `${movie.vote_average.toFixed(1)} Rating` : 'No Rating'}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/50 text-white/95 text-xs font-normal backdrop-blur-md border border-white/5">
                {releaseYear} Release
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full rounded-full bg-white text-black hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] font-medium py-6 text-[0.975rem] transition-all duration-200 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
          >
            View details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export type { Movie };
