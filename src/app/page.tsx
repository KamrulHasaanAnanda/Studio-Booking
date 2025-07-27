'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Booking from "@/components/studio-list/Booking";
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
  const [totalStudiosNumber, setTotalStudiosNumber] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // ✅ Get unique locations for suggestions
  const getUniqueLocations = useCallback((studiosData: any[]) => {
    const locations = new Set<string>();
    studiosData.forEach(studio => {
      locations.add(studio.Location.City);
      locations.add(studio.Location.Area);
    });
    return Array.from(locations).sort();
  }, []);

  // ✅ Filter studios based on search query
  const filterStudios = useCallback((query: string, studiosData: any[]) => {
    if (!query.trim()) return studiosData;

    const lowerQuery = query.toLowerCase();
    return studiosData.filter(studio =>
      studio.Location.City.toLowerCase().includes(lowerQuery) ||
      studio.Location.Area.toLowerCase().includes(lowerQuery) ||
      studio.Location.Address.toLowerCase().includes(lowerQuery)
    );
  }, []);

  // ✅ Update suggestions based on search query
  const updateSuggestions = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const uniqueLocations = getUniqueLocations(allStudios);
    const filteredSuggestions = uniqueLocations.filter(location =>
      location.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5
  }, [allStudios, getUniqueLocations]);

  // ✅ Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
    updateSuggestions(value);

    const filtered = filterStudios(value, allStudios);
    setStudios(filtered);
    setHasMore(false); // ✅ Disable infinite scroll during search
  }, [filterStudios, allStudios, updateSuggestions]);

  // ✅ Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);

    const filtered = filterStudios(suggestion, allStudios);
    setStudios(filtered);
    setHasMore(false);
  }, [filterStudios, allStudios]);

  // ✅ Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
    setStudios(allStudios);
    setHasMore(true);
    setPage(1);
  }, [allStudios]);

  // ✅ Fetch studios
  const fetchStudios = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/studios?page=${pageNum}&limit=${ITEMS_PER_PAGE}`);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setStudios(data.data);
          setTotalStudiosNumber(data.pagination.totalStudios);
        } else {
          setStudios(prev => [...prev, ...data.data]);
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

  useEffect(() => {
    fetchStudios(page);
  }, [page, fetchStudios]);

  const loadMoreData = () => {
    setPage(prevPage => prevPage + 1);
  };

  // ✅ Close suggestions on outside click
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
        {/* Hero Section */}
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

        <StatsSection studios={totalStudiosNumber} />

        {/* ✅ Infinite Scroll (Only active when NOT searching) */}
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
                <StudioCard key={index} studio={studio} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <>
            {/* If searching, show results without infinite scroll */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {studios.map((studio: any) => (
                <div key={studio.Id} className="group bg-white rounded-2xl shadow-lg border p-6">{studio.Name}</div>
              ))}
            </div>
          </>
        )}

        {/* No result when searching */}
        {searchQuery && studios.length === 0 && !loading && (
          <NotFound searchQuery={searchQuery} clearSearch={clearSearch} />
        )}
      </div>
    </div>
  );
}
