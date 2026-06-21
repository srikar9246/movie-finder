# AI Development Log

## Tools Used
- **Directory Inspections**: `list_dir` to inspect the project layout and components.
- **File Viewer**: `view_file` to read config files, dependencies, and component scripts.
- **File Writer**: `write_to_file` to scaffold artifacts, component changes, and documentation.
- **File Replacement Editor**: `replace_file_content` and `multi_replace_file_content` to make single and non-contiguous edits to components and configuration files.
- **Shell Runner**: `run_command` and `manage_task` to execute checks, verify server compiles, and run tests.

---

## Best Prompts
- "Core Features Required: Browse, Search, Details, Favorites, States, Pagination with Next/Prev buttons — exactly 12 results per page, no infinite scroll, GitHub repo named movie-finder-srikar, AI_LOG.md file in root, Footer with exact text Built for Jeevan — Srikar"

---

## What I Fixed Manually
1. **Parallel TMDB Fetch & Slice**: Adapted TMDB's default 20 results per page to exactly 12 results per page by fetching consecutive TMDB pages in parallel (when the 12-item page window spans two TMDB pages) and slicing the combined list.
2. **Favorites Object Storage**: Migrated the `localStorage` favorites array from storing movie IDs to complete `Movie` objects. This allows instantaneous local rendering and detail lookup in the Favorites tab without making unnecessary API calls for off-page movies.
3. **Refactored Prop Signatures**: Updated `MovieCard` and `MovieDetailDialog` prop types to pass the full `Movie` object for toggles instead of just the ID.
4. **Vite/Next.js Remote Image Patterns**: Adjusted `next.config.ts` from strict path checking to object-based `remotePatterns` configurations to accommodate dynamic query arguments in Unsplash image URLs.
5. **Mockup Card Layout Styling**: Redesigned `MovieCard` to match the exact mockup styling (rounded `rounded-[2.2rem]` container, landscape `aspect-[16/10]` image render using movie backdrop paths, dark-olive gradient background, matching translucent badges, floating heart favorite button, and full-width high-contrast white button).
6. **ScrollExpandMedia Date Header Removal**: Removed the text-blue-200 paragraph element displaying the date string in the scroll expand media component.
7. **Mockup Search Bar Redesign**: Redesigned the search input block to match the mockup structure using a glassmorphic look (translucent `bg-white/10` background container with `backdrop-blur-md` and `border-white/10`, white input text with zinc-400 placeholder, and a high-contrast circular white search button).
8. **Environment Variables Config**: Migrated the hardcoded TMDB API Key to read from `process.env.NEXT_PUBLIC_TMDB_API_KEY` with a fallback key, and configured the root `.env` file to securely define it.
9. **Bypassed ISP TMDB Block**: Switched TMDB API host from `api.themoviedb.org` to `api.tmdb.org` to resolve connection timeouts and loading issues caused by ISP blocks in specific regions.
