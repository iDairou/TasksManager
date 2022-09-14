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
    this.handleStart = this.handleStart.bind(this);
  }

  onClick = () => {
    const { tasks } = this.state;
  };

  render() {
    const { name } = this.state;
    return (
      <div>
        <h1 onClick={this.onClick}>TasksManager</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input value={name} onChange={this.changeHandler} />
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
        <main>{this.renderTasks()}</main>
      </div>
    );
  }
  renderTasks = () => {
    const { tasks } = this.state;
    return tasks.map((t, index) => {
      return (
        <section key={index}>
          <header>
            {t.name}, {t.time}
          </header>
          <footer>
            <button onClick={() => this.handleStart(t.name, t.isRunning)}>
              start
            </button>
            <button onClick={() => this.handleStop(t.name)}>stop</button>
            <button onClick={this.handleFinish}>zakończone</button>
            <button onClick={() => this.removeTask(t.name, t.id)}>usuń</button>
          </footer>
        </section>
      );
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
    console.log(this);
  };

  handleStop = (taskName) => {
    const { tasks } = this.state;
    // const currentTask = tasks.includes((t) => {
    //   t.name !== taskName;
    // });
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
    return this.api.removeData(id).then((data) => {});
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

    // this.setState({
    //   tasks: [
    //     ...tasks,
    //     {
    //       name: name,
    //       time: 0,
    //       isRunning: false,
    //       isDone: false,
    //       isRemoved: false,
    //     },
    //   ],
    //   name: "",
    // });
  };
  changeHandler = (e) => {
    this.setState({ name: e.target.value });
  };
}

export default TasksManager;
