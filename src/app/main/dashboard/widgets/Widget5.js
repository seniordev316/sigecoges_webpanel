/* eslint-disable import/no-extraneous-dependencies */
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { memo, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import clsx from 'clsx';
import { DatePicker } from '@material-ui/pickers';
import _ from '@lodash';
import FirebaseService from 'app/services/firebaseService';

const useStyles = makeStyles({
  chart: {
    minHeight: '450px',
    height: '450px',
  },
});

function Widget5(props) {
  const theme = useTheme();
  const optionsData = {
    chart: {
      id: 'users',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      labels: {
        formatter(val) {
          return val.toFixed(0);
        },
      },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    fill: {
      opacity: 1,
    },
    tooltip: {
      followCursor: true,
      theme: 'dark',
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
    },
    legend: {
      show: false,
    },
  };
  const classes = useStyles();
  const [awaitRender, setAwaitRender] = useState(true);
  const [series, setSeries] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      setAwaitRender(false);
      const year = selectedDate.getFullYear();
      FirebaseService.getUserAllData().then((result) => {
        if (result) {
          const temp = [];
          // result.forEach((element) => {});
          const yearData = _.filter(result, (o) => {
            return new Date(o.date.time).getFullYear() === year;
          });
          for (let index = 0; index < 12; index++) {
            const eachMonthData = _.filter(yearData, (o) => {
              return new Date(o.date.time).getMonth() === index;
            });
            temp.push(eachMonthData.length);
          }
          setSeries([
            {
              name: 'Users',
              data: temp,
            },
          ]);
        }
      });
    }
  }, [selectedDate]);

  if (awaitRender) {
    return null;
  }
  return (
    <Paper className="w-full rounded-20 shadow">
      <div className="flex items-center justify-between p-20">
        <Typography className="text-16 font-medium">Registered Users</Typography>
        <DatePicker
          views={['year']}
          label="Select Year"
          maxDate={new Date()}
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <div className="flex flex-row flex-wrap">
        {series ? (
          <div className={clsx(classes.chart, 'w-full p-16')}>
            <ReactApexChart options={optionsData} series={series} type="bar" height="100%" />
          </div>
        ) : null}
      </div>
    </Paper>
  );
}

export default memo(Widget5);
