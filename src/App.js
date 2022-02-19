import React, { Component } from "react";
import quizQuestions from "./api/quizQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import "./App.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const acceptRange = 12;
const byPassSecret = "autumn31 is smart";

function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000;
}

function toRad(Value) {
  return (Value * Math.PI) / 180;
}
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: "",
      userAnswer: "",
      answersCount: {},
      result: "",
    };

    this.ontextChange = this.ontextChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      question: quizQuestions[0].question,
      answer: quizQuestions[0].answer,
    });
  }

  handleSubmit(id, event) {
    navigator.geolocation.getCurrentPosition(
      this.success.bind(this, id),
      function(error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }

  check(pos, userAnswer) {
    const { location, text } = this.state.answer;
    console.log(pos, userAnswer);
    console.log(location, text);
    if (userAnswer === byPassSecret) {
      return true;
    }
    if (
      location &&
      distance(pos[0], pos[1], location[0], location[1]) > acceptRange
    ) {
      return false;
    }
    if (text && userAnswer !== text) {
      return false;
    }
    return true;
  }

  success(qid, position) {
    const { latitude, longitude } = position.coords;
    if (this.check([latitude, longitude], this.state.userAnswer)) {
      if (qid < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(qid), 300);
      }
    } else {
      confirmAlert({
        message: "hmm...再想想看",
        buttons: [
          {
            label: "Yes",
          },
        ],
      });
    }
  }

  setNextQuestion(curId) {
    const questionId = curId + 1;
    const counter = curId;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answer: quizQuestions[counter].answer,
      userAnswer: "",
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter(
      (key) => answersCount[key] === maxAnswerCount
    );
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: "Undetermined" });
    }
  }

  ontextChange(e) {
    this.setState({ userAnswer: e.target.value });
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        handleSubmit={this.handleSubmit.bind(this, this.state.questionId)}
        ontextChange={this.ontextChange}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  render() {
    return (
      <div className="App">
        {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default App;
