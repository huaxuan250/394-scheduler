import "./App.css";
import React, { useState, useEffect } from "react";

const Banner = ({ title }) => <h1>{title}</h1>;

const terms = { F: "Fall", W: "Winter", S: "Spring" };

const toggle = (x, lst) =>
  lst.includes(x) ? lst.filter((y) => y !== x) : [x, ...lst];

/*
  Time Modification Section
*/

const meetsPat =
  /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = (meets) => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match
    ? {}
    : {
        days,
        hours: {
          start: hh1 * 60 + mm1 * 1,
          end: hh2 * 60 + mm2 * 1,
        },
      };
};

const mapValues = (fn, obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value)])
  );

const addCourseTimes = (course) => ({
  ...course,
  ...timeParts(course.meets),
});

const addScheduleTimes = (schedule) => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses),
});

const days = ["M", "Tu", "W", "Th", "F"];

const daysOverlap = (days1, days2) =>
  days.some((day) => days1.includes(day) && days2.includes(day));

const hoursOverlap = (hours1, hours2) =>
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end);

const timeConflict = (course1, course2) =>
  daysOverlap(course1.days, course2.days) &&
  hoursOverlap(course1.hours, course2.hours);

const courseConflict = (course1, course2) =>
  getCourseTerm(course1) === getCourseTerm(course2) &&
  timeConflict(course1, course2);

const hasConflict = (course, selected) =>
  selected.some((selection) => courseConflict(course, selection));

// Bottom Up Approach
// A button needs to have its text, its checked state, and the ability to change the state
// Hence, term, checked, setTerm
const TermButton = ({ term, checked, setTerm }) => (
  <div>
    <input
      type="radio"
      id={term}
      className="btn-check"
      autoComplete="off"
      checked={checked}
      onChange={() => setTerm(term)}
    />
    <label class="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </div>
);

// A Term selector has buttons, and has information regarding which term is selected or not
const TermSelector = ({ term, setTerm }) => (
  <div className="btn-group">
    {Object.values(terms).map((value) => (
      <TermButton
        key={value}
        term={value}
        checked={value === term}
        setTerm={setTerm}
      />
    ))}
  </div>
);

/*
  Component Declaration Method:
  1. const name = (input) => (Operation of input); Good for non JSX
  2. const name = ({input}) => <div>(Operation of input)<div/> Good for JSX
  3. If =>(), it is always going to return, if =>{} no return by default
*/

const getCourseTerm = (course) => terms[course.id.charAt(0)];

const getCourseNumber = (course) => course.id.slice(1, 4);

const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const style = {
    backgroundColor: isDisabled
      ? "lightgrey"
      : isSelected
      ? "lightgreen"
      : "white",
  };
  return (
    <div
      className="card m-1 p-2"
      style={style}
      onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
    >
      <div className="card-body">
        <div className="card-title">
          {getCourseTerm(course)} CS {getCourseNumber(course)}
        </div>
        <div className="card-text">{course.title}</div>
      </div>
    </div>
  );
};

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState("Fall");
  const [selected, setSelected] = useState([]);
  const termCourses = Object.values(courses).filter(
    (course) => term === getCourseTerm(course)
  );

  return (
    <div>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {Object.values(termCourses).map((course) => (
          <Course
            course={course}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [schedule, setSchedule] = useState();
  const url = "https://courses.cs.northwestern.edu/394/data/cs-courses.php";

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(addScheduleTimes(json));
    };
    fetchSchedule();
  }, []);

  if (!schedule) {
    return <h1>Loading schedule...</h1>;
  }

  return (
    <div className="container">
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </div>
  );
};

export default App;
