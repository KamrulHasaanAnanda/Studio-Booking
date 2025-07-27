'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import StatsSection from '@/features/stats-section';
import HeroSection from '@/features/hero-section';
import GetDataLoader from '@/components/loaders/GetDataLoader';
import EndResult from '@/components/studio-list/EndResult';
import NotFound from '@/components/searches/NotFound';
import InfiniteScroll from 'react-infinite-scroll-component';
import StudioCard from '@/features/studio-card';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [studios, setStudios] = useState<any[]>([]);
  const [allStudios, setAllStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const getUniqueLocations = useCallback((studiosData: any[]) => {
    const locations = new Set<string>();
    studiosData.forEach(studio => {
      locations.add(studio.Location.City);
      locations.add(studio.Location.Area);
    });
    return Array.from(locations).sort();
  }, []);

  const updateSuggestions = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const uniqueLocations = getUniqueLocations(allStudios);
    const filteredSuggestions = uniqueLocations.filter(location =>
      location.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions.slice(0, 5));
  }, [allStudios, getUniqueLocations]);

  const fetchStudios = useCallback(async (pageNum: number, search: string = '') => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_APP_URL}/api/studios?page=${pageNum}&limit=${ITEMS_PER_PAGE}`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setStudios(data.data);
          setAllStudios(data.data);
        } else {
          setStudios(prev => [...prev, ...data.data]);
          setAllStudios(prev => [...prev, ...data.data]);
        }
        setHasMore(data.pagination.hasNextPage);
      } else {
        console.error('Error fetching studios:', data.error);
      }
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
    updateSuggestions(value);
    setPage(1);
    fetchStudios(1, value);
    setHasMore(false); // Disable infinite scroll while searching
  }, [updateSuggestions, fetchStudios]);

  // Handle suggestion click from autocomplete dropdown
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setPage(1);
    fetchStudios(1, suggestion);
    setHasMore(false);
  }, [fetchStudios]);

  // Clear the search and reset data
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
    setPage(1);
    fetchStudios(1, '');
    setHasMore(true);
  }, [fetchStudios]);

  // Load more data for infinite scroll (only when no search active)
  const loadMoreData = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Fetch more data on page change (only when no search active)
  useEffect(() => {
    if (!searchQuery.trim() && page) {
      fetchStudios(page);
    }
  }, [page, searchQuery, fetchStudios]);

  // Close suggestions on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section with Search */}
        <HeroSection
          studios={studios}
          searchRef={searchRef as React.RefObject<HTMLDivElement>}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          clearSearch={clearSearch}
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
        />

        {/* <StatsSection studios={allStudios.length} /> */}

        {/* Studio List */}
        {!searchQuery ? (
          <InfiniteScroll
            dataLength={studios.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={<GetDataLoader />}
            endMessage={<EndResult />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {studios.map((studio: any, index: number) => (
                <StudioCard key={studio.Id || index} studio={studio} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          // When searching, show filtered results without infinite scroll
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {studios.map((studio: any, index: number) => (
                <StudioCard key={studio.Id || index} studio={studio} />
              ))}
            </div>
          </>
        )}

        {/* No results message */}
        {searchQuery && studios.length === 0 && !loading && (
          <NotFound searchQuery={searchQuery} clearSearch={clearSearch} />
        )}
      </div>
    </div>
  );
}
