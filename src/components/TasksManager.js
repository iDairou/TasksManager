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
          <label className="panel__form--label" name='task-name'>Task name:</label>
          <input className="panel__form--bar" name='task-name' value={name} onChange={this.changeHandler} />
          <input className="panel__form--button" type="submit" value='Add'/>
        </form>
        <main className="tasks-list" >{this.renderTasks()}</main>
      </div>
    );
  }
  renderTasks = () => {
    const { tasks } = this.state;
    return tasks.map((t, index) => {
      return (
        <section className="task" key={index}>
          <header className="task__header">
            {t.name}, {t.time}
          </header>
          <footer className="task__buttons">
            <button className="task__buttons--start button" onClick={() => this.handleStart(t.name, t.isRunning)}>
              start
            </button>
            <button className="task__buttons--stop button" onClick={() => this.handleStop(t.name)}>stop</button>
            <button className="task__buttons--finish button" onClick={this.handleFinish}>zakończone</button>
            <button className="task__buttons--delete button" onClick={() => this.removeTask(t.name, t.id)}>usuń</button>
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

  handleFinish = (taskName) => {
    const { tasks } = this.state;
    console.log(test);
  };
  // handleStartStop(taskName) {
  //   const { tasks } = this.state;
  //   const currentTask = tasks.includes((t) => {
  //     t.name !== taskName;
  //   });

  //   console.log(currentTask);
  // }

  handleStart = (taskName) => {
    this.id = setInterval(() => {
      this.incrementTime(taskName);
    }, 1000);
  };

  handleStop = () => {
    clearInterval(this.id);
  };

  incrementTime(taskName) {
    this.setState((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.name === taskName) {
        
          return { ...task, time: task.time + 1 };
        }
        return task;
      });
      return {
        tasks: newTasks,
      };
    });
  }

  removeTask = (taskName, id) => {
    const { tasks } = this.state;
    const currTasks = tasks.filter((task) => task.name !== taskName);
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
