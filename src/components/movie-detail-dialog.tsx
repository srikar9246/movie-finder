'use client';

import Image from 'next/image';
import { Star, Clock, Heart, Film } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/components/movie-card';

interface MovieDetailDialogProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export function MovieDetailDialog({
  movie,
  open,
  onOpenChange,
  isFavorite,
  onToggleFavorite,
}: MovieDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {movie && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                {movie.backdrop_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Film size={64} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock size={14} />
                  {movie.release_date}
                </Badge>
                <Button
                  variant={isFavorite ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onToggleFavorite(movie)}
                  className="gap-2 ml-auto"
                >
                  <Heart
                    size={16}
                    className={isFavorite ? 'fill-current' : ''}
                  />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Overview</h4>
                <p className="text-muted-foreground">{movie.overview}</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
