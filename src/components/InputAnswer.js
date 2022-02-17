import React from "react";
import PropTypes from "prop-types";

function InputAnswer(props) {
  return !props.answer ? (
    <div />
  ) : (
    <div>
      <textarea onChange={props.ontextChange} />
      <button onClick={props.handleSubmit}>Submit</button>
    </div>
  );
}

InputAnswer.propTypes = {
  //   answerType: PropTypes.string.isRequired,
  //   answerContent: PropTypes.string.isRequired,
  //   answer: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  ontextChange: PropTypes.func.isRequired,
};

export default InputAnswer;
