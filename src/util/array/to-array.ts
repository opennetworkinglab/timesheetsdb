/*
 * Copyright 2020-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getConnection } from 'typeorm';
import { Week } from '../../week/week.entity';
import { Time } from '../../time/time.entity';

const MONTHS30 = [3, 5, 8, 10]; // Apr, Jun, Sep, Nov
const FEB = 1;

export const timesTo2DArray7Days = async (user, days) => {

  const week = await getConnection().getRepository(Week).findOne({
    where: {
      id: days[0].weekId
    }});

  const weekBeginDate = new Date(week.begin);
  let currentDay = weekBeginDate.getDate();
  const month = weekBeginDate.getMonth();
  const year = weekBeginDate.getFullYear();

  const timeName = [] // weekday. e.g. Monday.
  const timeMinutes = []
  const dayTimes = []

  let dayIndex = 0;
  // loop for size of week
  for(let i = 0; i < 7; i++){

    let userIndex = 0;
    let timesIndex = -1;

    // check that day is current day. Also checks if we have gone through all days
    if(dayIndex < days.length && new Date(days[dayIndex].day).getDate() === currentDay) {

      // Sorts the day times into the same order as the projects
      while (userIndex < user.projects.length) {

        timesIndex++;

        // if times are not all dealt with
        if (timesIndex < days[dayIndex].times.length) {

          // Used to sort projects in our days
          if (user.projects[userIndex].name === days[dayIndex].times[timesIndex].name) {

            dayTimes[userIndex] = days[dayIndex].times[timesIndex];

            timesIndex = -1;
            userIndex++;
          }
        }
        // Create times for any additional projects
        else {
          const time = new Time();
          time.name = user.projects[userIndex].name;
          time.minutes = 0;
          dayTimes[userIndex] = time;
          timesIndex = -1;
          userIndex++;
        }
      }
      dayIndex++;

      // check to see if current day is at the end of a month and leap year
      if(month === FEB && (currentDay >= 28 )){
        if(year % 2 === 0 && currentDay === 29){
          currentDay = 1;
        }
        else if (year % 2 !== 0){
          currentDay = 1;
        }else{
          currentDay++;
        }
      }
      else if(currentDay === 30) {

        for (let i = 0; i < MONTHS30.length; i++) {

          if(month === MONTHS30[i]){
            currentDay = 1;
          }
        }
      }
      else if (currentDay === 31){
        currentDay = 1;
      }
      else {
        currentDay++;
      }
    }
    // If all days passed in are dealt with. Populate the remainder days left
    else{

      let count = 0;
      while(count < user.projects.length){

        const time = new Time();
        time.name = user.projects[count].name;
        time.minutes = 0;
        dayTimes[count] = time;
        count++;
      }
      currentDay++;
    }

    timeName[i] = [] // times in weekday. e.g. timeName[0][0] = Sick. Monday at position 0 is Sick
    timeMinutes[i] = []
    let totalWeekdayTime = 0;

    for(let j = 0; j < dayTimes.length; j++){

      timeName[i][j] = dayTimes[j].name;
      timeMinutes[i][j] = dayTimes[j].minutes / 60;
      totalWeekdayTime += timeMinutes[i][j];
    }
    timeName[i][user.projects.length] = 'Total';
    timeMinutes[i][user.projects.length] = totalWeekdayTime;
  }

  timeName[7] = []
  timeMinutes[7] = [] // Stores Total for project

  // This works as long as all days have the same projects. Projects should be added/removed on a week by week basis.
  for(let i = 0; i < timeMinutes[0].length; i++){

    timeName[7][i] = 'Total ' + timeName[0][i];
    let totalProjectTime = 0;

    for(let j = 0; j < timeMinutes.length - 1; j++){

      totalProjectTime += timeMinutes[j][i];
    }
    timeMinutes[7][i] = totalProjectTime;
  }

  return {
    timeName: timeName,
    timeMinutes: timeMinutes
  }
}
