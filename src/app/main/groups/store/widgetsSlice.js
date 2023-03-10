import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import FirebaseService from 'app/services/firebaseService';
// import analyticsDashboardAppDB from './analytics-dashboard-db';

export const getWidgets = createAsyncThunk('Groups/getWidgets', async () => {
  const response = await FirebaseService.getGeofence().then(
    (widget) => {
      return widget;
    },
    (error) => {
      return error;
    }
  );
  // const dataTemp = analyticsDashboardAppDB.widgets;
  // console.log('===>', response);
  const data = await response;
  return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgetsEntities, selectById: selectWidgetById } =
  widgetsAdapter.getSelectors((state) => state.Groups.widgets);

const widgetsSlice = createSlice({
  name: 'Groups',
  initialState: widgetsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: widgetsAdapter.setAll,
  },
});

export default widgetsSlice.reducer;
