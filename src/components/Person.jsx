const Person = (props) => {
  return (
    <div className="person">
      <p>{props.name}</p>
      <p>{props.title}</p>
      <p>{props.salary}</p>
      <p>{props.phone}</p>
      <p>{props.email}</p>
      <p>{props.animal}</p>
    </div>
  );
};

export default Person;
