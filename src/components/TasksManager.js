import React from "react";
import API from "./API";

class TasksManager extends React.Component {
  state = {
    tasks: [],
    name: "",
  };
  constructor() {
    super();
    this.api = new API();
  }

  onClick = () => {
    const { tasks } = this.state;
  };

  render() {
    const { name } = this.state;
    return (
      <div className="panel">
        <h1 className="panel__h1" onClick={this.onClick}>
          TasksManager
        </h1>
        <p className="panel__description">Enter the name of the task</p>
        <form className="panel__form" onSubmit={this.handleSubmit}>
          <label className="panel__form--label" name="task-name">
            Task name:
          </label>
          <input
            className="panel__form--bar"
            name="task-name"
            value={name}
            onChange={this.changeHandler}
          />
          <input className="panel__form--button" type="submit" value="Add" />
        </form>
        <main className="tasks-list">{this.renderTasks()}</main>
      </div>
    );
  }
  renderTasks = () => {
    const { tasks } = this.state;
    return tasks.map((t, index) => {
      console.log(t, index);

      return (
        <section className="task" key={index}>
          <header className="task__header">
            {t.name}, {t.time}
          </header>
          <footer className="task__buttons">
            <button
              className="task__buttons--start button"
              onClick={() => this.handleStart(t.name)}
              disabled={t.isRunning ? true : false || t.isDone ? true : false}
            >
              start
            </button>
            <button
              className="task__buttons--stop button"
              onClick={() => this.handleStop(t.name)}
              disabled={t.isRunning ? false : true || t.isDone ? true : false}
            >
              stop
            </button>
            <button
              className="task__buttons--finish button"
              onClick={() => this.handleFinish(t.name)}
              disabled={t.isDone ? true : false}
            >
              finished
            </button>
            <button
              className="task__buttons--delete button"
              onClick={() => this.removeTask(t.id)}
              disabled={t.isDone ? false : true}
            >
              delete
            </button>
          </footer>
        </section>
      );
    });
  };

  componentDidMount = () => {
    return this.api.loadData().then((data) => {
      this.setState({
        tasks: data,
      });
    });
  };

  // Po kliknięciu 'finished' isDone = true. Na tej podstawie będę dodawał odpowiednią klasę przy renderowaniu np. przekreślenie tekstu + disabled przycisków,
  // brakuje mi tutaj pomysłu jak przenieść kliknięty task na koniec listy.

  handleFinish = (taskName) => {
    this.setState((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.name === taskName) {
          return { ...task, isDone: true };
        }
        return task;
      });
      return {
        tasks: newTasks,
      };
    });
    this.handleStop(taskName);
  };

  // Problem ze STOP, działa w porządku jeśli operuję na jednym tasku, jeśli odpalimy kilka zadań na raz - wówczas prawidłowo STOP zadziała tylko w ostatnim wystartowanym zadaniu. Na reszcie zaczyna wartiować
  // Dodatkowo brakuje tutaj updatu licznika na serwerze JSON i nie bardzo mam pomysł jak to ogarnąć, żeby jednak zachowywać te dane.

  handleStart = (taskName) => {
    this.interval = setInterval(() => {
      this.incrementTime(taskName, 1, true);
    }, 1000);
  };

  handleStop = (taskName) => {
    clearInterval(this.interval);
    this.incrementTime(taskName, 0, false);
  };

  incrementTime(taskName, num, boolean) {
    this.setState((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.name === taskName) {
          return { ...task, time: task.time + num, isRunning: boolean };
        }
        return task;
      });
      return {
        tasks: newTasks,
      };
    });
  }
  ///////////////////////////////////////////////////////////

  removeTask = (id) => {
    const { tasks } = this.state;
    const currTasks = tasks.filter((task) => task.id !== id);
    this.setState({
      tasks: currTasks,
    });
    return this.api.removeData(id);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { name, tasks } = this.state;
    return this.api
      .addData({
        name: name,
        time: 0,
        isRunning: false,
        isDone: false,
        isRemoved: false,
      })
      .then((data) => {
        this.setState({
          tasks: [...tasks, data],
          name: "",
        });
      });
  };
  changeHandler = (e) => {
    this.setState({ name: e.target.value });
  };
}

export default TasksManager;
