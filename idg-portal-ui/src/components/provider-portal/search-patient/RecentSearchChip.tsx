import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface SearchItem {
  originalTerm: string;
  matchedText: string;
}

interface ChipContainerProps {
  filteredSearches: SearchItem[];
  handleChipClick: (term: string) => void;
}

const RecentSearchChip: React.FC<ChipContainerProps> = ({ filteredSearches, handleChipClick }) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if the chip container is scrollable
  useEffect(() => {
    const checkIfScrollable = () => {
      if (containerRef.current) {
        const isScrollable =
          containerRef.current.scrollWidth > containerRef.current.clientWidth;
        setIsScrollable(isScrollable);
      }
    };

    checkIfScrollable(); // Run on mount

    window.addEventListener('resize', checkIfScrollable); // Re-run on window resize
    return () => window.removeEventListener('resize', checkIfScrollable); // Clean up listener
  }, [filteredSearches]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Left Arrow */}
      {isScrollable && (
        <IconButton
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
          onClick={() => scroll('left')}
        >
          <ArrowBackIcon />
        </IconButton>
      )}

      {/* Right Arrow */}
      {isScrollable && (
        <IconButton
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
          onClick={() => scroll('right')}
        >
          <ArrowForwardIcon />
        </IconButton>
      )}

      {/* Chip Container */}
      <div
        ref={containerRef}
        className="chip-container"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          padding: '8px 0',
          maxWidth: '100%',
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filteredSearches.map((item, index) => (
          <div
            key={index}
            className="chip"
            style={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.background.paper // Dark mode: background is paper
                  : theme.palette.common.white, // Light mode: background is white
              color: theme.palette.primary.contrastText,
              cursor: 'pointer',
              margin: '2px',
              padding: '5px 10px',
              borderRadius: '5px',
              boxShadow: `0px 2px 4px 0px rgba(0, 0, 0, 0.1)`,
            }}
            onClick={() => handleChipClick(item.originalTerm)}
          >
            {/* Display the matching text with highlight */}
            {item.originalTerm
              .split(item.matchedText)
              .map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span
                      style={{
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? theme.palette.secondary.main // Highlight in dark mode
                            : theme.palette.primary.main, // Highlight in light mode
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {item.matchedText}
                    </span>
                  )}
                </span>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearchChip;
