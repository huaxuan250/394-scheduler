import "./App.css";
import React, { useState, useEffect } from "react";

const Banner = ({ title }) => <h1>{title}</h1>;

const terms = { F: "Fall", W: "Winter", S: "Spring" };

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

const Course = ({ course }) => (
  /*
    To Use the return value of a function call, we need to use {} to enclose it
  */
  <div className="card m-1 p-2">
    <div className="card-body">
      <div className="card-title">
        <b>
          {getCourseTerm(course)} CS {getCourseNumber(course)}
        </b>
      </div>
      <div className="card-text">{course.title}</div>
    </div>
  </div>
);

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState("Fall");
  const termCourses = Object.values(courses).filter(
    (course) => term === getCourseTerm(course)
  );

  return (
    <div>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {Object.values(termCourses).map((course) => (
          <Course course={course} />
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
      setSchedule(json);
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
