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

export const dayEntityTimesTo2DArray = (user, days) => {

  const timeName = [] // weekday. e.g. Monday
  const timeMinutes = []
  const dayTimes = []

  for(let i = 0; i < days.length; i++){

    let userIndex = 0;
    let timesIndex = -1;

    // Sorts the day times into the same order as the projects
    while(userIndex < user.projects.length){

      timesIndex++;

      if(user.projects[userIndex].name === days[i].times[timesIndex].name){
        dayTimes[userIndex] = days[i].times[timesIndex];
        userIndex++;
        timesIndex = -1;
      }
    }

    timeName[i] = [] // times in weekday. e.g. Sick
    timeMinutes[i] = []
    let totalWeekdayTime = 0;

    for(let j = 0; j < dayTimes.length; j++){

      timeName[i][j] = dayTimes[j].name;
      timeMinutes[i][j] = dayTimes[j].minutes / 60;
      totalWeekdayTime += timeMinutes[i][j];
    }
    timeName[i][days[i].times.length] = 'Total';
    timeMinutes[i][days[i].times.length] = totalWeekdayTime;
  }

  timeName[days.length] = []
  timeMinutes[days.length] = [] // Stores Total for project

  // This works as long as all days have the same projects. Projects should be added/removed on a week by week basis.
  for(let i = 0; i < timeMinutes[0].length; i++){

    timeName[days.length][i] = 'Total ' + timeName[0][i];
    let totalProjectTime = 0;

    for(let j = 0; j < timeMinutes.length - 1; j++){

      totalProjectTime += timeMinutes[j][i];
    }
    timeMinutes[days.length][i] = totalProjectTime;
  }

  return {
    timeName: timeName,
    timeMinutes: timeMinutes
  }
}