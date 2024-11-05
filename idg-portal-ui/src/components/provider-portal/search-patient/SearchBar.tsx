import React, { useState, useEffect } from 'react';
import { IconButton, InputBase, Paper } from '@mui/material';
import { Mic, Search } from '@mui/icons-material';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listening, setListening] = useState(false);

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
      onSearchChange(transcript); // Update parent with voice input
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
  }, [listening, onSearchChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value); // Update parent on input change
  };

  const handleVoiceSearch = () => {
    setListening((prevState) => !prevState);
  };

  return (
    <Paper
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '600px',
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
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
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
  );
};

export default SearchBar;
