const DefaultTaskView = ({ taskInstance }) => {
  console.log(taskInstance);
  return (
    <>
      {taskInstance.information}
    </>
  )
};

export default DefaultTaskView;
