// components/Schedule.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [newJob, setNewJob] = useState({
    jobTitle: '',
    startTime: '',
    endTime: '',
    jobDescription: '',
    crew: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://192.168.254.86:3000/api/jobs');
        const jobs = response.data.map(job => ({
          title: job.job_title,
          start: new Date(job.start_time),
          end: new Date(job.end_time),
          description: job.job_description,
        }));
        setEvents(jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleAddJob = async () => {
    try {
      const { jobTitle, startTime, endTime, jobDescription, crew } = newJob;
      const newEvent = {
        title: jobTitle,
        start: new Date(startTime),
        end: new Date(endTime),
        description: jobDescription,
        crew,
      };

      // Optional: Post new job to backend
      await axios.post('http://192.168.254.86:3000/api/jobs', {
        job_title: jobTitle,
        start_time: startTime,
        end_time: endTime,
        job_description: jobDescription,
        crew,
      });

      setEvents([...events, newEvent]);
      setNewJob({
        jobTitle: '',
        startTime: '',
        endTime: '',
        jobDescription: '',
        crew: '',
      });
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <div>
      <h2>Technician Job Schedule</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Schedule New Task</h3>
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          value={newJob.jobTitle}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="startTime"
          value={newJob.startTime}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="endTime"
          value={newJob.endTime}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="jobDescription"
          placeholder="Job Description"
          value={newJob.jobDescription}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="crew"
          placeholder="Assign Crew"
          value={newJob.crew}
          onChange={handleInputChange}
        />
        <button onClick={handleAddJob}>Add Job</button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '20px' }}
      />
    </div>
  );
};

export default Schedule;