import { getCourseTerm, terms } from "../utilities/times.js";
import { useState } from "react";
import Course from "./Course.js";
import {
  signInWithGoogle,
  signOut,
  useUserState,
} from "../utilities/firebase.js";

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

const SignOutButton = () => (
  <button className="btn btn-secondary btn-sm" onClick={() => signOut()}>
    Sign Out
  </button>
);

const SignInButton = () => (
  <button
    className="btn btn-secondary btn-sm"
    onClick={() => signInWithGoogle()}
  >
    Sign In
  </button>
);

// A Term selector has buttons, and has information regarding which term is selected or not
const TermSelector = ({ term, setTerm }) => {
  const [user] = useUserState();

  return (
    <div className="btn-toolbar justify-content-between">
      <div className="btn-group">
        {Object.values(terms).map((value) => (
          <TermButton
            key={value}
            term={value}
            setTerm={setTerm}
            checked={value === term}
          />
        ))}
      </div>
      {user ? <SignOutButton /> : <SignInButton />}
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

export default CourseList;
