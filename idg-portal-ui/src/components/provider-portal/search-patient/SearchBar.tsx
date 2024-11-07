import React, { useState, useEffect, useCallback } from 'react';
import {
  IconButton,
  InputBase,
  Paper,
  Stack,
  Button,
  Box,
  Typography,
  Chip,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
  TextField,
} from '@mui/material';
import { Cancel, Mic, Search } from '@mui/icons-material';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close'; // Import Close Icon
import _ from 'lodash';

// Define the search criteria type
export interface SearchCriteria {
  unifiedSearch: string;
  patientId: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicationName: string;
  conditionCode: string;
  encounterDateRange: (string | null)[]; // Encounter Date Range: Start and End Date
}

interface SearchBarProps {
  onSearchChange: (query: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    unifiedSearch: '',
    patientId: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    medicationName: '',
    conditionCode: '',
    encounterDateRange: [null, null],
  });
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [filteredSearches, setFilteredSearches] = useState<
    { originalTerm: string; matchedText: string }[]
  >([]);

  const theme = useTheme();

  // Debounce function using lodash.debounce
  const debouncedSearch = useCallback(
    _.debounce((query: string) => {
      if (!query.trim()) {
        setFilteredSearches([]); // Clear filtered results only when query is empty
        return;
      }

      const recentSearches = getRecentSearches();

      // Split the query into words and filter out empty strings
      const queryWords = query
        .toLowerCase()
        .split(' ')
        .filter((word) => word.trim() !== '');

      const filtered = recentSearches
        .map((term) => {
          // Check if the term matches any of the query words (partial match for each word)
          const matches = queryWords.map((word) =>
            term.toLowerCase().includes(word)
          );

          // If at least one of the query words matches the term, include it
          const isMatched = matches.some(Boolean); // If any word in the query matches

          if (isMatched) {
            // Highlight matching text
            const matchedText = queryWords
              .map((word) => {
                const matchIndex = term.toLowerCase().indexOf(word);
                return matchIndex !== -1
                  ? term.slice(matchIndex, matchIndex + word.length)
                  : '';
              })
              .join(' '); // Join all matched words
            return { originalTerm: term, matchedText };
          }

          return null; // Return null if no match
        })
        .filter((item) => item !== null); // Remove null values from the result

      setFilteredSearches(
        filtered as { originalTerm: string; matchedText: string }[]
      ); // Type casting
    }, 500),
    []
  );

  // useEffect(() => {
  //   if (searchQuery.length < 3) {
  //     setFilteredSearches([]);
  //   }
  // }, [searchQuery]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      const searchCriteriaCopy = _.clone(searchCriteria);
      searchCriteriaCopy.unifiedSearch = transcript;
      onSearchChange(searchCriteriaCopy);
    };

    recognition.onend = () => {
      setListening(false);
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [listening]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length === 0) {
      setFilteredSearches([]);
      return;
    }
    if (value.length >= 3) {
      debouncedSearch(value);
    } else {
      setFilteredSearches([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.length >= 3) {
      const recentSearches = getRecentSearches();
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter(
          (term) => term.toLocaleLowerCase() !== searchQuery.toLocaleLowerCase()
        ),
      ];
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

      const searchCriteriaCopy = {
        ...searchCriteria,
        unifiedSearch: searchQuery,
      };
      setSearchCriteria(searchCriteriaCopy);
      onSearchChange(searchCriteriaCopy);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.length >= 3) {
      const recentSearches = getRecentSearches();

      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter((term) => term !== searchQuery),
      ].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

      const searchCriteriaCopy = {
        ...searchCriteria,
        unifiedSearch: searchQuery,
      };
      setSearchCriteria(searchCriteriaCopy);
      onSearchChange(searchCriteriaCopy);
    }
  };

  const handleVoiceSearch = () => {
    setListening((prevState) => !prevState);
  };

  const handleSearchCriteriaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSearchCriteria((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEncounterDateRangeChange = (index: number, date: string) => {
    const newEncounterDateRange = [...searchCriteria.encounterDateRange];
    newEncounterDateRange[index] = date;
    setSearchCriteria((prevState) => ({
      ...prevState,
      encounterDateRange: newEncounterDateRange,
    }));
  };

  const handleApplyFilters = () => {
    setShowAppliedFilters(true);
    onSearchChange(searchCriteria);
    setDrawerOpen(false); // Close the drawer after applying filters
  };

  const toggleAdvancedSearch = () => {
    setDrawerOpen(true);
  };

  const getSelectedFilters = () => {
    const filters = [];
    if (searchCriteria.unifiedSearch) {
      filters.push({
        label: `Search: ${searchCriteria.unifiedSearch}`,
        key: 'unifiedSearch',
      });
    }

    if (searchCriteria.patientId)
      filters.push({
        label: `Patient ID: ${searchCriteria.patientId}`,
        key: 'patientId',
      });
    if (searchCriteria.patientId)
      filters.push({
        label: `Patient ID: ${searchCriteria.patientId}`,
        key: 'patientId',
      });
    if (searchCriteria.email)
      filters.push({ label: `Email: ${searchCriteria.email}`, key: 'email' });
    if (searchCriteria.firstName)
      filters.push({
        label: `First Name: ${searchCriteria.firstName}`,
        key: 'firstName',
      });
    if (searchCriteria.lastName)
      filters.push({
        label: `Last Name: ${searchCriteria.lastName}`,
        key: 'lastName',
      });
    if (searchCriteria.dateOfBirth)
      filters.push({
        label: `DOB: ${searchCriteria.dateOfBirth}`,
        key: 'dateOfBirth',
      });
    if (searchCriteria.medicationName)
      filters.push({
        label: `Medication: ${searchCriteria.medicationName}`,
        key: 'medicationName',
      });
    if (searchCriteria.conditionCode)
      filters.push({
        label: `Condition Code: ${searchCriteria.conditionCode}`,
        key: 'conditionCode',
      });
    if (
      searchCriteria.encounterDateRange[0] &&
      searchCriteria.encounterDateRange[1]
    )
      filters.push({
        label: `Encounter Date: ${searchCriteria.encounterDateRange[0]} to ${searchCriteria.encounterDateRange[1]}`,
        key: 'encounterDateRange',
      });
    return filters;
  };

  // Function to remove a selected filter
  const removeFilter = (key: keyof SearchCriteria) => {
    const newCriteria = { ...searchCriteria };
    if (key === 'encounterDateRange') {
      newCriteria.encounterDateRange = [null, null]; // Reset encounter date range
    } else {
      newCriteria[key] = '';
    }
    setSearchCriteria(newCriteria);
    if (key === 'unifiedSearch') {
      setSearchQuery('');
    }
    if (hasNonEmptyValues(newCriteria)) {
      setShowAppliedFilters(true);
    } else {
      setShowAppliedFilters(false);
    }
    onSearchChange(newCriteria);
  };

  const hasNonEmptyValues = (data: any) => {
    return Object.entries(data).some(([key, value]) => {
      if (key !== 'unifiedSearch') {
        // Check if value is not an empty string, not null, or if encounterDateRange is not both null
        return (
          value !== '' &&
          value !== null &&
          !(Array.isArray(value) && value.every((item) => item === null))
        );
      }
    });
  };

  const getRecentSearches = (): string[] => {
    const storedSearches = localStorage.getItem('recentSearches');
    return storedSearches ? JSON.parse(storedSearches) : [];
  };

  const handleChipClick = (term: string) => {
    setSearchQuery(term);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredSearches([]);
    const searchCriteriaCopy = {
      ...searchCriteria,
      unifiedSearch: '',
    };
    setSearchCriteria(searchCriteriaCopy);
    onSearchChange(searchCriteriaCopy);
  };

  return (
    <Box>
      {/* Unified Search and Tune buttons side by side */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Paper
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '2px 8px',
              borderRadius: '50px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by Patient Name, conditions..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyUp={handleKeyPress}
            />
            {searchQuery && searchQuery.length > 0 && (
              <IconButton
                type="submit"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={handleClearSearch}
              >
                <Cancel />
              </IconButton>
            )}

            <IconButton
              type="submit"
              sx={{ p: '10px' }}
              aria-label="search"
              onClick={handleSearchClick}
            >
              <Search />
            </IconButton>
            <IconButton
              color={listening ? 'primary' : 'default'}
              sx={{ p: '10px' }}
              aria-label="voice search"
              onClick={handleVoiceSearch}
            >
              <Mic />
            </IconButton>
          </Paper>

          <IconButton
            color="primary"
            onClick={toggleAdvancedSearch}
            sx={{ p: '10px' }}
          >
            <TuneIcon
              sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Box>
        {filteredSearches.length > 0 && (
          <div className="chip-container">
            {filteredSearches.map((item, index) => (
              <div
                key={index}
                className="chip"
                onClick={() => handleChipClick(item.originalTerm)}
              >
                {/* Display the matching text with highlight */}
                {item.originalTerm
                  .split(item.matchedText)
                  .map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span style={{ backgroundColor: 'yellow' }}>
                          {item.matchedText}
                        </span>
                      )}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        )}
      </Box>

      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ marginBottom: 3, fontSize: '1rem !important', fontWeight: 600, color: 'primary.main' }}
        >
          Applied Filters:
        </Typography>
        {showAppliedFilters && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {getSelectedFilters().map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                color="primary"
                sx={{ marginBottom: 1 }}
                deleteIcon={<CloseIcon />}
                onDelete={() =>
                  removeFilter(filter.key as keyof SearchCriteria)
                } // Call removeFilter on X click
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Drawer for Advanced Search with only filter fields */}
      <Drawer
        open={drawerOpen}
        anchor="right"
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: 350,
          }}
        >
          {/* Header with Close Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <Typography variant="h6">Advanced Filters</Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Body - Scrollable sections */}
          <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
            {/* Personal Information */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Personal Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Patient ID"
                    name="patientId"
                    value={searchCriteria.patientId}
                    onChange={handleSearchCriteriaChange}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={searchCriteria.email}
                    onChange={handleSearchCriteriaChange}
                  />
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={searchCriteria.firstName}
                    onChange={handleSearchCriteriaChange}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={searchCriteria.lastName}
                    onChange={handleSearchCriteriaChange}
                  />
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={searchCriteria.dateOfBirth}
                    onChange={handleSearchCriteriaChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Medication and Condition */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Medication and Condition</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Medication Name"
                    name="medicationName"
                    value={searchCriteria.medicationName}
                    onChange={handleSearchCriteriaChange}
                  />
                  <TextField
                    fullWidth
                    label="Condition Code"
                    name="conditionCode"
                    value={searchCriteria.conditionCode}
                    onChange={handleSearchCriteriaChange}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Encounter Date Range */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Encounter Date Range</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={searchCriteria.encounterDateRange[0] || ''}
                    onChange={(e) =>
                      handleEncounterDateRangeChange(0, e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={searchCriteria.encounterDateRange[1] || ''}
                    onChange={(e) =>
                      handleEncounterDateRangeChange(1, e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Footer with Apply Filters button */}
          <Box
            sx={{
              padding: 2,
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white',
            }}
          >
            <Button variant="contained" fullWidth onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SearchBar;
