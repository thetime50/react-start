import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    // constructor(props) {
    //     super(props)
    //     // this.state = {
    //     //     value: null,
    //     // }
    // }

    render() {
        return (
            <button className="square"
                onClick={
                    // function() {
                    //     console.log('click', this)
                    // }
                    () => {
                        console.log('click', this)
                        // this.setState({ value: 'X' }) //每次在组件中调用 setState 时，React 都会自动更新其子组件。
                        this.props.onClick()
                    }
                }>
                {
                    this.props.value
                    // this.state.value
                }
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            squares: Array(9).fill(null)
        }
    }

    handelClick(i) {
        const squares = this.state.squares.slice() //whay
        // 不需要监控内部的节点
        squares[i] = 'x'
        this.setState({ squares: squares }) // 触发受控组件重新渲染
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handelClick(i)}
            />
        );
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
