import { getCourseTerm, terms } from "../utilities/times.js";
import { useState } from "react";
import Course from "./Course.js";

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

export default CourseList;
