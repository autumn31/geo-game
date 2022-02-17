import React from "react";
import PropTypes from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";
import Question from "../components/Question";
import QuestionCount from "../components/QuestionCount";
import InputAnswer from "../components/InputAnswer";

function Quiz(props) {
  return (
    <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div key={props.questionId}>
        <QuestionCount counter={props.questionId} total={props.questionTotal} />
        <Question content={props.question} />
        <InputAnswer
          answer={props.answer}
          handleSubmit={props.handleSubmit}
          ontextChange={props.ontextChange}
        />
      </div>
    </CSSTransitionGroup>
  );
}

Quiz.propTypes = {
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  ontextChange: PropTypes.func.isRequired,
};

export default Quiz;
