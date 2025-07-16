import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  X,
  Calendar,
  TrendingUp,
  Clock,
  Eye,
  Heart,
} from "lucide-react";

interface SearchFilters {
  search: string;
  category: string;
  sortBy: string;
  dateRange: string;
  readingTime: string;
  author: string;
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  resultsCount?: number;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onClearFilters,
  isLoading = false,
  resultsCount = 0,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: "all", label: "All Categories", icon: "📚" },
    { value: "strategies", label: "Strategies", icon: "🎯" },
    { value: "game-guides", label: "Game Guides", icon: "🎮" },
    { value: "news", label: "News", icon: "📰" },
    { value: "tips-tricks", label: "Tips & Tricks", icon: "💡" },
    { value: "reviews", label: "Reviews", icon: "⭐" },
    { value: "promotions", label: "Promotions", icon: "🎁" },
    { value: "winner-stories", label: "Winner Stories", icon: "🏆" },
    { value: "responsible-gambling", label: "Responsible Gaming", icon: "🛡️" },
  ];

  const sortOptions = [
    { value: "-createdAt", label: "Latest First", icon: "📅" },
    { value: "createdAt", label: "Oldest First", icon: "📅" },
    { value: "-views", label: "Most Popular", icon: "👁️" },
    { value: "-likes", label: "Most Liked", icon: "❤️" },
    { value: "title", label: "A-Z", icon: "🔤" },
    { value: "-title", label: "Z-A", icon: "🔤" },
    { value: "readingTime", label: "Quick Reads", icon: "⚡" },
    { value: "-readingTime", label: "Long Reads", icon: "📖" },
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "Last 3 Months" },
    { value: "year", label: "This Year" },
  ];

  const readingTimes = [
    { value: "all", label: "Any Length" },
    { value: "1-3", label: "1-3 minutes" },
    { value: "4-7", label: "4-7 minutes" },
    { value: "8-15", label: "8-15 minutes" },
    { value: "15+", label: "15+ minutes" },
  ];

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.category !== "all" ||
      filters.sortBy !== "-createdAt" ||
      filters.dateRange !== "all" ||
      filters.readingTime !== "all" ||
      filters.author
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="mb-8">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search casino articles, strategies, guides..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-12 pr-32 h-14 text-lg bg-gray-800 border-casino-gold/30 text-white placeholder-gray-400 focus:border-casino-gold"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-casino-neon hover:bg-casino-neon/20"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="gold-gradient text-black font-semibold"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.slice(0, 7).map((category) => (
          <Button
            key={category.value}
            variant={
              filters.category === category.value ? "default" : "outline"
            }
            size="sm"
            onClick={() => updateFilter("category", category.value)}
            className={
              filters.category === category.value
                ? "gold-gradient text-black"
                : "border-casino-gold/30 text-casino-gold hover:bg-casino-gold hover:text-black"
            }
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card className="casino-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Filter className="mr-2 h-5 w-5 text-casino-gold" />
                Advanced Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Sort By
                </label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => updateFilter("sortBy", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-casino-gold/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-casino-gold/30">
                    {sortOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white hover:bg-casino-gold/20"
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date Range
                </label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => updateFilter("dateRange", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-casino-gold/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-casino-gold/30">
                    {dateRanges.map((range) => (
                      <SelectItem
                        key={range.value}
                        value={range.value}
                        className="text-white hover:bg-casino-gold/20"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reading Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Reading Time
                </label>
                <Select
                  value={filters.readingTime}
                  onValueChange={(value) => updateFilter("readingTime", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-casino-gold/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-casino-gold/30">
                    {readingTimes.map((time) => (
                      <SelectItem
                        key={time.value}
                        value={time.value}
                        className="text-white hover:bg-casino-gold/20"
                      >
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Eye className="inline h-4 w-4 mr-1" />
                  Author
                </label>
                <Input
                  type="text"
                  placeholder="Filter by author..."
                  value={filters.author}
                  onChange={(e) => updateFilter("author", e.target.value)}
                  className="bg-gray-800 border-casino-gold/30 text-white placeholder-gray-400 focus:border-casino-gold"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-casino-gold/20">
              <div className="text-sm text-gray-400">
                {resultsCount > 0 && <span>{resultsCount} articles found</span>}
              </div>
              <div className="flex gap-2">
                {hasActiveFilters() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                    className="border-casino-red text-casino-red hover:bg-casino-red hover:text-white"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Clear All
                  </Button>
                )}
                <Button
                  onClick={onSearch}
                  size="sm"
                  disabled={isLoading}
                  className="gold-gradient text-black font-semibold"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-gray-400">Active filters:</span>

          {filters.search && (
            <span className="bg-casino-neon/20 text-casino-neon px-3 py-1 rounded-full text-sm flex items-center">
              Search: "{filters.search}"
              <button
                onClick={() => updateFilter("search", "")}
                className="ml-2 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.category !== "all" && (
            <span className="bg-casino-gold/20 text-casino-gold px-3 py-1 rounded-full text-sm flex items-center">
              {categories.find((c) => c.value === filters.category)?.label}
              <button
                onClick={() => updateFilter("category", "all")}
                className="ml-2 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.sortBy !== "-createdAt" && (
            <span className="bg-casino-purple/20 text-casino-purple px-3 py-1 rounded-full text-sm flex items-center">
              Sort: {sortOptions.find((s) => s.value === filters.sortBy)?.label}
              <button
                onClick={() => updateFilter("sortBy", "-createdAt")}
                className="ml-2 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.dateRange !== "all" && (
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center">
              {dateRanges.find((d) => d.value === filters.dateRange)?.label}
              <button
                onClick={() => updateFilter("dateRange", "all")}
                className="ml-2 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.readingTime !== "all" && (
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
              {readingTimes.find((r) => r.value === filters.readingTime)?.label}
              <button
                onClick={() => updateFilter("readingTime", "all")}
                className="ml-2 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.author && (
            <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm flex items-center">
              Author: {filters.author}
              <button
                onClick={() => updateFilter("author", "")}
                className="ml-2 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
