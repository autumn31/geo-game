import React, { Component } from "react";
import quizQuestions from "./api/quizQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import "./App.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const acceptRange = 50;

function distance(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  }
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

    this.handleSubmit = this.handleSubmit.bind(this);
    this.ontextChange = this.ontextChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      question: quizQuestions[0].question,
      answer: quizQuestions[0].answer,
    });
  }

  handleSubmit(event) {
    navigator.geolocation.getCurrentPosition(this.success.bind(this), function(
      error
    ) {
      console.error("Error Code = " + error.code + " - " + error.message);
    });
  }

  check(pos, userAnswer) {
    const { location, text } = this.state.answer;
    console.log(pos, userAnswer);
    console.log(location, text);
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

  success(position) {
    const { latitude, longitude } = position.coords;
    if (this.check([latitude, longitude], this.state.userAnswer)) {
      if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
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

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

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
    this.setState({ answer: e.target.value });
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        handleSubmit={this.handleSubmit}
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
