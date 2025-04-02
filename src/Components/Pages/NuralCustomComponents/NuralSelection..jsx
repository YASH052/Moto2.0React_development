import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function NuralSelection() {
  const [id, setid] = React.useState('');

  const handleChange = (event) => {
    setid(event.target.value);
  };

  return (
    <Box >
      <FormControl fullWidth >
        <InputLabel  sx={{fontSize:"14px",fontWeight:"500",color:"#18244e"}}>Serial Only</InputLabel>
        <Select
        //   labelId="demo-simple-select-label"
        //   id="demo-simple-select"
          value={id}
          label="Select Only"
          onChange={handleChange}
          sx={{borderRadius:"10px"}}
          
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
