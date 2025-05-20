import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
} from '@mui/material';
import { PRIMARY_BLUE2 } from '../../../Common/colors';
import NuralTextField from '../../NuralCustomComponents/NuralTextField';
import NuralButton from '../../NuralCustomComponents/NuralButton';
import NuralAutocomplete from '../../NuralCustomComponents/NuralAutocomplete';

const PriceListEdit = ({
  open,
  onClose,
  editData,
  onSave,
  countryDropdown,
  stateDropdown,
  isCountryLoading,
  isStateLoading,
  fetchStateDrop,
}) => {
  const [formData, setFormData] = useState({
    priceListID: 0,
    priceListName: '',
    priceListType: 0,
    countryID: '',
    stateID: '',
    priceMappingList: [],
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        ...formData,
        ...editData,
      });
    }
  }, [editData]);

  const handleChange = (field, value) => {
    if (field === 'countryID') {
      fetchStateDrop(value);
      setFormData({
        ...formData,
        countryID: value,
        stateID: '',
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = () => {
    const body = {
      type: 2, /* 1: Create, 2: Update, 3: Status Update */
      priceListType: formData.priceListType,
      priceListID: formData.priceListID,
      priceListName: formData.priceListName,
      priceMappingList: [
        {
          countryID: formData.countryID || 0,
          stateID: formData.stateID || 0,
        }
      ],
    };
    onSave(body);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography
          sx={{
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: '16px',
            color: PRIMARY_BLUE2,
          }}
        >
          Edit Price List
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                color: PRIMARY_BLUE2,
                fontFamily: 'Manrope',
                fontWeight: 400,
                fontSize: '10px',
                lineHeight: '13.66px',
                letterSpacing: '4%',
                mb: 1,
              }}
            >
              PRICE LIST NAME
            </Typography>
            <NuralTextField
              value={formData.priceListName}
              onChange={(e) => handleChange('priceListName', e.target.value)}
              placeholder="Enter price list name"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                color: PRIMARY_BLUE2,
                fontFamily: 'Manrope',
                fontWeight: 400,
                fontSize: '10px',
                lineHeight: '13.66px',
                letterSpacing: '4%',
                mb: 1,
              }}
            >
              COUNTRY
            </Typography>
            <NuralAutocomplete
              options={countryDropdown}
              getOptionLabel={(option) => option?.countryName || ''}
              value={countryDropdown.find(
                (option) => option.countryID === formData.countryID
              ) || null}
              onChange={(event, newValue) =>
                handleChange('countryID', newValue?.countryID || '')
              }
              loading={isCountryLoading}
              placeholder="Select Country"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                color: PRIMARY_BLUE2,
                fontFamily: 'Manrope',
                fontWeight: 400,
                fontSize: '10px',
                lineHeight: '13.66px',
                letterSpacing: '4%',
                mb: 1,
              }}
            >
              STATE
            </Typography>
            <NuralAutocomplete
              options={stateDropdown}
              getOptionLabel={(option) => option?.stateName || ''}
              value={stateDropdown.find(
                (option) => option.stateID === formData.stateID
              ) || null}
              onChange={(event, newValue) =>
                handleChange('stateID', newValue?.stateID || '')
              }
              loading={isStateLoading}
              placeholder="Select State"
              disabled={!formData.countryID}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <NuralButton
          text="CANCEL"
          variant="outlined"
          onClick={onClose}
          color={PRIMARY_BLUE2}
          borderColor={PRIMARY_BLUE2}
        />
        <NuralButton
          text="SAVE"
          onClick={handleSubmit}
          backgroundColor={PRIMARY_BLUE2}
          color="#fff"
        />
      </DialogActions>
    </Dialog>
  );
};

export default PriceListEdit; 