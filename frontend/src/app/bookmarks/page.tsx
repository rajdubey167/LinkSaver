"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Bookmark {
  _id: string;
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags: string[];
  createdAt: string; // Added for sorting
}

const SortableBookmark = ({ bookmark, onDelete }: { bookmark: Bookmark, onDelete: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: bookmark._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    flexDirection: "column" as const,
    marginBottom: 16,
    border: "1px solid rgba(45, 138, 78, 0.35)",
    borderRadius: 8,
    padding: 12,
    background: "#fff",
  };
  return (
    <li ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: 8 }}>
        <span {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: 8, userSelect: 'none' }} title="Drag to reorder">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="6" r="1.5" fill="#888"/>
            <circle cx="7" cy="10" r="1.5" fill="#888"/>
            <circle cx="7" cy="14" r="1.5" fill="#888"/>
            <circle cx="13" cy="6" r="1.5" fill="#888"/>
            <circle cx="13" cy="10" r="1.5" fill="#888"/>
            <circle cx="13" cy="14" r="1.5" fill="#888"/>
          </svg>
        </span>
        {bookmark.favicon ? (
          <img 
            src={bookmark.favicon} 
            alt="favicon" 
            style={{ width: 24, height: 24, marginRight: 12, flexShrink: 0 }} 
            onError={e => (e.currentTarget.style.display = 'none')} 
          />
        ) : (
          <div 
            style={{ 
              width: 24, 
              height: 24, 
              marginRight: 12, 
              background: '#e2e8f0', 
              borderRadius: '50%',
              flexShrink: 0
            }} 
          />
        )}
        <div style={{ flex: 1 }}>
          <a 
            href={bookmark.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontWeight: 600, color: "#111111", display: 'block' }}
            onClick={(e) => e.stopPropagation()}
          >
            {bookmark.title}
          </a>
        </div>
        <button
          onClick={() => onDelete(bookmark._id)}
          className="delete-button"
          style={{
            marginLeft: 8,
            background: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#ef4444',
            borderRadius: 4,
            padding: '4px 8px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          Delete
        </button>
      </div>
      <div style={{ paddingLeft: 36 }}>
        <div style={{ fontSize: 12, color: '#111111', lineHeight: '1.5', marginBottom: 4 }}>
          {isExpanded ? bookmark.summary : `${bookmark.summary.slice(0, 150)}...`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="read-more-button"
            style={{
              color: '#2d8a4e',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 4,
              textDecoration: 'underline'
            }}
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div style={{ fontSize: 12, color: '#111111' }}>
              • Tags: {bookmark.tags.join(", ")}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default function BookmarksPage() {
  // 1. All useState hooks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'titleAsc' | 'titleDesc'>('newest');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  // 2. All sensor hooks
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 3. All useMemo hooks
  // Extract unique tags
  const allTags = useMemo(() => {
    return Array.from(new Set(bookmarks.flatMap(b => b.tags || [])));
  }, [bookmarks]);

  // Filter and sort bookmarks
  const filteredAndSortedBookmarks = useMemo(() => {
    let result = [...bookmarks];
    
    // Apply tag filter
    if (selectedTag) {
      result = result.filter(b => b.tags && b.tags.includes(selectedTag));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title?.toLowerCase().includes(query) || 
        b.url.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'titleAsc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'titleDesc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
    }
    
    return result;
  }, [bookmarks, selectedTag, searchQuery, sortBy]);

  // 4. All useEffect hooks
  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line
  }, []);

  // Rest of the component remains the same...
  const fetchBookmarks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(res.data);
    } catch (err: any) {
      setError("Failed to fetch bookmarks. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/bookmarks",
        { url: newUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarks([res.data, ...bookmarks]);
      setNewUrl("");
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to add bookmark.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setBookmarks((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order in backend
        const token = localStorage.getItem("token");
        axios.post(
          "/api/bookmarks/reorder",
          { orders: newItems.map((b, i) => ({ id: b._id, order: i })) },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => {
          // Optionally show error
        });

        return newItems;
      });
    }
  };

  // Delete bookmark handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bookmark?")) {
      return;
    }
    setDeleteStatus(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
      setDeleteStatus("Bookmark deleted successfully.");
      console.log("Bookmark deleted successfully.");
    } catch (err: any) {
      setDeleteStatus("Failed to delete bookmark.");
      console.error("Failed to delete bookmark:", err);
    }
  };

  if (loading) return <div>Loading bookmarks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bookmarks-container" style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 20px" }}>
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Main Content - Left Side */}
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            marginBottom: "32px",
            border: "1px solid rgba(45, 138, 78, 0.35)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 className="text-2xl font-bold text-gray-900">Your Bookmarks</h2>
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: isFilterVisible ? "#f0f9f0" : "white",
                  border: "1px solid #2d8a4e",
                  borderRadius: "8px",
                  color: "#2d8a4e",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filters {isFilterVisible ? "↑" : "↓"}
              </button>
            </div>
            
            <form onSubmit={handleAdd} style={{ 
              display: "flex",
              gap: "12px",
              background: "#f8faf8",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="url"
                  placeholder="Paste a URL to save"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  required
                  style={{ 
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    fontSize: "15px",
                    transition: "all 0.2s ease",
                    outline: "none",
                    backgroundColor: "white",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                  }}
                  onFocus={e => e.target.style.borderColor = '#2d8a4e'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <button 
                type="submit" 
                disabled={addLoading}
                style={{ 
                  minWidth: 140,
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #2d8a4e, #1a472a)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: addLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: addLoading ? 0.7 : 1,
                  boxShadow: "0 2px 4px rgba(45, 138, 78, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={e => {
                  if (!addLoading) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(45, 138, 78, 0.25)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(45, 138, 78, 0.2)';
                }}
              >
                {addLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Bookmark</span>
                  </>
                )}
              </button>
            </form>
            {addError && (
              <div style={{ 
                color: '#dc2626',
                marginTop: 12,
                padding: "12px 16px",
                background: "#fef2f2",
                borderRadius: "8px",
                border: "1px solid #fee2e2",
                fontSize: "14px"
              }}>
                {addError}
              </div>
            )}
          </div>

          {/* Bookmarks List */}
          {deleteStatus && (
            <div style={{
              color: deleteStatus.includes('success') ? '#16a34a' : '#dc2626',
              marginBottom: 16,
              padding: '10px 16px',
              background: deleteStatus.includes('success') ? '#f0fdf4' : '#fef2f2',
              borderRadius: '8px',
              border: `1px solid ${deleteStatus.includes('success') ? '#bbf7d0' : '#fee2e2'}`,
              fontSize: '15px',
              fontWeight: 500
            }}>
              {deleteStatus}
            </div>
          )}
          {filteredAndSortedBookmarks.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "white",
              borderRadius: "12px",
              border: "1px solid rgba(45, 138, 78, 0.35)",
              color: "#666"
            }}>
              {searchQuery 
                ? "No bookmarks found matching your search."
                : `No bookmarks${selectedTag ? ` with tag "${selectedTag}"` : ""}.`}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredAndSortedBookmarks.map(b => b._id)}
                strategy={verticalListSortingStrategy}
              >
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {filteredAndSortedBookmarks.map((bookmark) => (
                    <SortableBookmark
                      key={bookmark._id}
                      bookmark={bookmark}
                      onDelete={handleDelete}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Filter Section - Right Side */}
        <div style={{ 
          width: "300px", 
          flexShrink: 0,
          display: isFilterVisible ? "block" : "none",
          transition: "all 0.3s ease"
        }}>
          <div style={{ 
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(45, 138, 78, 0.35)",
            position: "sticky",
            top: "24px"
          }}>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: 600, 
              marginBottom: "16px",
              color: "#111111",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              Filter & Sort
              <button
                onClick={() => setIsFilterVisible(false)}
                style={{
                  padding: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                  borderRadius: "4px"
                }}
              >
                ✕
              </button>
            </h3>

            {/* Search Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontSize: "14px", 
                color: "#4B5563",
                fontWeight: 500 
              }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  backgroundColor: "#f9fafb"
                }}
              />
            </div>

            {/* Sort Options */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontSize: "14px", 
                color: "#4B5563",
                fontWeight: 500 
              }}>
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                style={{ 
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  backgroundColor: "#f9fafb",
                  cursor: "pointer"
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="titleAsc">Title (A-Z)</option>
                <option value="titleDesc">Title (Z-A)</option>
              </select>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  color: "#4B5563",
                  fontWeight: 500 
                }}>
                  Filter by Tag
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <button
                    onClick={() => setSelectedTag(null)}
                    style={{ 
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      background: !selectedTag ? "#f0f9f0" : "#f9fafb",
                      color: !selectedTag ? "#2d8a4e" : "#111111",
                      border: "1px solid",
                      borderColor: !selectedTag ? "#2d8a4e" : "#e5e7eb",
                      cursor: "pointer",
                      fontWeight: !selectedTag ? 600 : 400
                    }}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      style={{ 
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        background: selectedTag === tag ? "#f0f9f0" : "#f9fafb",
                        color: selectedTag === tag ? "#2d8a4e" : "#111111",
                        border: "1px solid",
                        borderColor: selectedTag === tag ? "#2d8a4e" : "#e5e7eb",
                        cursor: "pointer",
                        fontWeight: selectedTag === tag ? 600 : 400
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}