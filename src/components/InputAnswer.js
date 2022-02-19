import React from "react";
import PropTypes from "prop-types";
import "./style.css";

function InputAnswer(props) {
  console.log(props.answer);
  return !props.answer ? (
    <div />
  ) : (
    <div class="centered">
      <textarea
        onChange={props.ontextChange}
        defaultValue={props.answer.text ? "" : "此題不用答案"}
      />
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
