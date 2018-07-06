import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      roomName: "No Room Selected",
      username: ''
      // YOUR CODE HERE (1)
    };
  }

  componentDidMount() {
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {
      console.log('connected');
      var username= window.prompt('Enter Username');
      this.setState({username: username})
      this.state.socket.emit('username', username);


      this.state.socket.on('errorMessage', message => {
        // YOUR CODE HERE (3)
        window.alert(message);
      });
    })}

    join(room) {
      // room is called with "Party Place"
      var roomName= window.prompt('Enter room name');
      this.setState({roomName: roomName })
      this.state.socket.emit('room', roomName);
    }

    render() {
      return (
        <div>
          <h1>React Chat</h1>
          <button className="btn btn-default" onClick={() => this.join("Party Place")}>
            Join the Party Place
          </button>
          <div> <ChatRoom roomName ={this.state.roomName} socket = {this.state.socket} username = {this.state.username} /> </div>
        </div>

      );
    }
  }

  class ChatRoom extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        message: '',
        messages:[]
      };
    }

    componentDidMount(){

      this.props.socket.on('message', message => {

      //  message= message.username + ': ' + message.content + '<br /> ';
        message=  message.content;
        var msg= this.state.messages.slice();
        msg.push(message);
        this.setState({messages: msg});
      })
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.roomName !== this.props.roomName){
        this.setState({messages: []})
      }

    }
    handleChange(e) {
      e.preventDefault()
      this.setState({message: e.target.value})
    }

    handleSubmit(e) {
      e.preventDefault()
      var msg= this.state.messages.slice();
      msg.push(this.state.message);

      this.setState({messages: msg});
      this.props.socket.emit('message', msg);


    }

    render() {
      return (
        <form style={{borderStyle: 'outset', height: '400px', width: '900px'}} onSubmit={(e) => this.handleSubmit(e)}>
          <div >

          <h4 style={{color:'red'}} >Room: {this.props.roomName}</h4>

          {this.state.messages.map((message)=> <div style={{color:'blue'}}> {this.props.username +': ' + message} </div> )}
          </div>
            <input
              type="text"
              placeholder="Send message..."
              onChange={(e) => this.handleChange(e)}
              value={this.state.message}
            />
            <input
              type="submit"
              value="Submit"
            />
          </form>
        )
      }
    }

    export default App;
