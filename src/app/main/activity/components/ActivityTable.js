/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseLoading from '@fuse/core/FuseLoading';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Typography,
  Avatar,
} from '@material-ui/core';
import _ from '@lodash';
import CoreService from 'app/services/coreService';
import FirebaseService from 'app/services/firebaseService';
import { getUserGeofence, selectGeofence } from '../store/geofenceSlice';
import { getAllActivity, selectAllActivity } from '../store/activitySlice';
import { getUserAllData, selectAllUsers } from '../store/userSlice';
import ActivityTableHead from './ActivityTableHead';

function ActivityTable(props) {
  const dispatch = useDispatch();
  const activities = useSelector(selectAllActivity);
  const geofence = useSelector(selectGeofence);
  const users = useSelector(selectAllUsers);
  const user = useSelector(({ auth }) => auth.user);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    dispatch(getAllActivity()).then(() => setLoading(false));
    dispatch(getUserGeofence()).then(() => setLoading(false));
    dispatch(getUserAllData());
  }, []);

  useEffect(() => {
    if (activities && activities[0] !== undefined && user && users && users[0] !== undefined) {
      if (user.role === 'SUPER_ADMIN') {
        setData(activities[0]);
      }
      if (user.role === 'ADMIN') {
        FirebaseService.getUserWithEmail(user.email).then((currentUser) => {
          const temp = [];
          activities[0].forEach((element) => {
            users[0].forEach((item) => {
              if (item.id === element.uid) {
                if (currentUser.group_name === item.group_name) {
                  temp.push(element);
                }
              }
            });
          });
          setData(temp);
        });
      }
    }
  }, [activities, users]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.forEach((n) => n.uid));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data && data.length === 0) {
    return (
      <div className="w-full flex flex-col">
        <FuseScrollbars className="flex-grow overflow-x-auto">
          <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
            <ActivityTableHead
              selectedProductIds={selected}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={0}
              onMenuItemClick={handleDeselect}
            />
          </Table>
          <Typography className="mt-5" color="textSecondary" variant="h6" align="center">
            There are no activity!
          </Typography>
        </FuseScrollbars>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ActivityTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data ? data.length : 0}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (order.id) {
                    case 'categories': {
                      return o.categories[0];
                    }
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n, index) => {
                const isSelected = selected.indexOf(index) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={index}
                    selected={isSelected}
                  >
                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      className="px-4 md:pr-0 md:pl-20"
                      component="th"
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {CoreService.getDateStringFromTimestamp(n.timestamp)}{' '}
                      {CoreService.getTimeStringFromTimestamp(n.timestamp)}
                    </TableCell>
                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
                      {users && users[0] !== undefined
                        ? users[0].map((item, i) => {
                            if (item.id === n.uid) {
                              return (
                                <div key={i}>
                                  <div className="flex justify-center">
                                    <Avatar src={item.photo} />
                                  </div>
                                  <div className="flex justify-center">{item.name}</div>
                                </div>
                              );
                            }
                          })
                        : ''}
                    </TableCell>

                    <TableCell
                      align="center"
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                    >
                      <Typography>
                        {geofence && geofence[0] !== undefined
                          ? geofence[0][n.geofence_id].name
                          : ''}
                      </Typography>
                      <Typography>
                        {'['}
                        {geofence && geofence[0] !== undefined
                          ? geofence[0][n.geofence_id].address
                          : ''}
                        {']'}
                      </Typography>
                    </TableCell>

                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
                      {n.status}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="flex-shrink-0 border-t-1"
        component="div"
        count={data ? data.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default ActivityTable;
