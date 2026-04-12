/**
 * Calculates the time taken (in seconds) for a specific question.
 * @param {Number} index - The index of the current question
 * @param {Array<Date>} submissionTimes - The array of timestamps
 * @param {Date} startTime - The start time of the match
 */
const calculateTimeTaken = (index, submissionTimes, startTime) => {
  if (!submissionTimes || !submissionTimes[index]) return 0;

  const currentSubTime = new Date(submissionTimes[index]).getTime();
  let previousTime;

  if (index === 0) {
    previousTime = new Date(startTime).getTime();
  } else {
    previousTime = new Date(submissionTimes[index - 1]).getTime();
  }

  return Math.round((currentSubTime - previousTime) / 1000);
};

const calculateAvgTime = (submissionTimes, startTime) => {
  if (!submissionTimes || submissionTimes.length === 0) return 0;
  
  const validSubmissions = submissionTimes.filter(t => t != null);
  if (validSubmissions.length === 0) return 0;

  const startMs = new Date(startTime).getTime();
  const endMs = new Date(validSubmissions[validSubmissions.length - 1]).getTime();
  
  const totalSeconds = (endMs - startMs) / 1000;
  return Math.round(totalSeconds / validSubmissions.length);
};

module.exports = {
  calculateAvgTime ,
  calculateTimeTaken
}