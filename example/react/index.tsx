import * as React from 'react';
import ReactDOM from 'react-dom';
import Slide from '../../lib/react';
import './index.css';

interface StateProps {
  opacity:number;
}

class SlideContainer extends React.Component<{}, StateProps> {
  private S:Slide;
  private progress_style = {
    height: 15,
    background: '-webkit-gradient(linear, 0% 0%, 100% 100%, from(rgb(63, 81, 181)), to(#9C27B0))',
  }
  private background_style = {
    height: 15,
    background: '#7569652b',
  }
  private dot_style = {
    height: 20,
  }

  public constructor (props:any) {
    super(props);
    this.state = {
      opacity: 0.5,
    }
  }
  public render () {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: `rgba(114,132,230,${this.state.opacity})`,
      }}>

        react - slide bar

        <Slide 
          width='300px'
          height='50px'
          direction='x'
          default_value='0.2'
          dot_style={this.dot_style}
          background_style={this.background_style}
          progress_style={this.progress_style}
          onload={this.onload.bind(this)}
          onchange={this.oninput.bind(this)}
          oninput={this.oninput.bind(this)}/>
      </div>
    )
  }

  private onload (S:Slide) {
    (window as any).rs =  this.S = S;
  }

  private oninput (value:number) {
    this.setState({opacity: value});
  }
}

console.log(require('react-dom'))
ReactDOM.render(
  <SlideContainer />,
  document.getElementById('react')
);