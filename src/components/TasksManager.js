import React from "react";

class TasksManager extends React.Component {
  state = {
    tasks: [],
    name: "",
  };

  onClick = () => {
    const { tasks } = this.state;
    console.log(tasks);
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
            <button onClick={() => this.handleStartStop(t.name)}>
              start/stop
            </button>
            <button>zakończone</button>
            <button disabled={true}>usuń</button>
          </footer>
        </section>
      );
    });
  };
  handleStartStop(taskName) {
    const { tasks } = this.state;
    const currentTask = tasks.includes((t) => {
      console.log(t);
      t.name === taskName;
    });
    console.log(currentTask);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, tasks } = this.state;
    this.setState({
      tasks: [
        ...tasks,
        {
          name: name,
          time: 0,
          isRunning: false,
          isDone: false,
          isRemoved: false,
        },
      ],
      name: "",
    });
  };
  changeHandler = (e) => {
    this.setState({ name: e.target.value });
  };
}

export default TasksManager;
