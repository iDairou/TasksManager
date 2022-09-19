import React from "react";
import API from "./API";

class TasksManager extends React.Component {
  state = {
    tasks: [],
    name: "",
  };
  api = new API();
  constructor() {
    super();
  }

  onClick = () => {
    const { tasks } = this.state;
  };

  render() {
    const { name } = this.state;
    return (
      <div className="panel">
        <h1 className="panel__h1" onClick={this.onClick}>
          Your Tasks Manager
        </h1>
        <p className="panel__description">Enter the name of the task</p>
        <form className="panel__form" onSubmit={this.handleSubmit}>
          <input
            className="panel__form--bar"
            name="task-name"
            placeholder="Your task..."
            value={name}
            onChange={this.changeHandler}
          />
          <input
            className="panel__form--button button"
            type="submit"
            value="Add"
          />
        </form>
        <main className="tasks-list">{this.renderTasks()}</main>
      </div>
    );
  }

  renderTasks() {
    const { tasks } = this.state;
    // tasks.forEach(task =>{
    //   if (task.isRunning === true) {
    //     console.log(task);
    //   }
    // })
    return tasks
      .sort((a, b) => a.isDone - b.isDone)
      .map((t, index) => {
        return (
          <section className={`task ${t.isDone && "task--done"}`} key={index}>
            <header className="task__header">
              <p className="task__header--name">{t.name}</p>
              <p className="task__header--time">Time: {t.time}</p>
            </header>
            <footer className="task__buttons">
              <button
                className={`task__buttons--start button ${
                  t.isRunning && "disabled"
                }`}
                onClick={() => this.handleStart(t.name)}
                disabled={this.handleDisableStart(t.isRunning, t.isDone)}
              >
                Start
              </button>
              <button
                className={`task__buttons--stop button ${
                  !t.isRunning && "disabled"
                }`}
                onClick={() => this.handleStop(t.name)}
                disabled={this.handleDisableStop(t.isRunning, t.isDone)}
              >
                Pause
              </button>
              <button
                className="task__buttons--finish button"
                onClick={() => this.handleFinish(t.name)}
                disabled={t.isDone ? true : false}
              >
                Finished
              </button>
              <button
                className="task__buttons--delete button"
                onClick={() => this.removeTask(t.id)}
                disabled={t.isDone ? false : true}
              >
                Delete
              </button>
            </footer>
          </section>
        );
      });
  }

  componentDidMount = () => {
    return this.api.loadData().then((data) => {
      this.setState({
        tasks: data,
      });
    });
  };
  handleDisableStart(taskRun, taskDone) {
    return taskRun ? true : false || taskDone ? true : false;
  }
  handleDisableStop(taskRun, taskDone) {
    return taskRun ? false : true || taskDone ? true : false;
  }
  checkInterval = (tasks) => {
    console.log(tasks);
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

  handleStart = (taskName) => {
    this.interval = setInterval(() => {
      this.incrementTime(taskName, true);
    }, 1000);
    console.log(this.interval);
  };

  handleStop = (taskName) => {
    clearInterval(this.interval);
    console.log(this.interval);
    this.incrementTime(taskName, false);
  };

  incrementTime(taskName, boolean) {
    this.setState((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.name === taskName) {
          const updated = {
            ...task,
            time: task.time + 1,
            isRunning: boolean,
          };
          this.api.updateData(task.id, updated);
          return updated;
        }
        return task;
      });
      return {
        tasks: newTasks,
      };
    });
  }
  sendToJSON(data) {
    return this.api.addData(data);
  }

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
    if (name != "") {
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
    }
  };
  changeHandler = (e) => {
    this.setState({ name: e.target.value });
  };
}

export default TasksManager;
