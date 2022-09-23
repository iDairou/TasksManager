import React from "react";
import Clock from "react-live-clock";

class Time extends React.Component {
  render() {
    return <Clock className="clock" format={"HH:mm:ss"} ticking={true} timezone={"US/Pacific"} />;
  }
}
export default Time;
